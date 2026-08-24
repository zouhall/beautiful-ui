import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { EventEmitter } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { foldPiEvent, emptyPiView, type PiView, type PiWrapped } from "../pi-fold";
import { withSecrets } from "./secrets";

const PI_BIN = process.env.PI_BIN || "/home/ubuntu/.local/bin/pi";
const SESSION_DIR = process.env.PI_SESSION_DIR || path.join(process.cwd(), "sessions");
const HOME = process.env.HOME || "/home/ubuntu";
const DEFAULT_PROVIDER = process.env.PI_PROVIDER || "openai-codex";
const DEFAULT_MODEL = process.env.PI_MODEL || "gpt-5.6-sol";
const DEFAULT_THINKING = process.env.PI_THINKING || "high";
const MAX_EVENTS = 8000;

export type SessionMeta = {
  id: string;
  name: string;
  cwd: string;
  provider: string;
  model: string;
  thinking: string;
  status: "live" | "stopped";
  created_at: number;
  updated_at: number;
  session_file?: string;
};

function newId() {
  return `pi_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 8)}`;
}

function splitJsonl(chunk: Buffer | string, carry: string) {
  const text = carry + chunk.toString("utf8");
  const parts = text.split("\n");
  return {
    lines: parts.slice(0, -1).map((l) => (l.endsWith("\r") ? l.slice(0, -1) : l)),
    carry: parts[parts.length - 1],
  };
}

function safeCwd(cwd?: string) {
  const resolved = path.resolve(cwd || HOME);
  const roots = [HOME, path.join(HOME, "projects")];
  const ok = roots.some((root) => resolved === root || resolved.startsWith(`${root}${path.sep}`));
  return ok && fs.existsSync(resolved) ? resolved : HOME;
}

class PiSession extends EventEmitter {
  id: string;
  meta: SessionMeta;
  proc: ChildProcessWithoutNullStreams;
  pending = new Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  events: { seq: number; ts: number; event: Record<string, unknown> }[] = [];
  seq = 0;
  n = 0;
  carry = "";
  stderr = "";
  alive = true;
  state: Record<string, unknown> | null = null;
  view: PiView = emptyPiView();

  constructor({ id, meta, proc }: { id: string; meta: SessionMeta; proc: ChildProcessWithoutNullStreams }) {
    super();
    this.id = id;
    this.meta = meta;
    this.proc = proc;
    proc.stdout.on("data", (buf) => {
      const { lines, carry } = splitJsonl(buf, this.carry);
      this.carry = carry;
      for (const line of lines) this.onLine(line);
    });
    proc.stderr.on("data", (buf) => {
      this.stderr += buf.toString();
      if (this.stderr.length > 20_000) this.stderr = this.stderr.slice(-12_000);
    });
    proc.on("exit", (code, signal) => {
      this.alive = false;
      this.meta.status = "stopped";
      this.meta.updated_at = Date.now();
      const err = new Error(`pi rpc exited ${code ?? signal}`);
      for (const [, p] of this.pending) p.reject(err);
      this.pending.clear();
      this.push({ type: "session_stopped", code, signal });
    });
  }

  onLine(line: string) {
    if (!line.trim()) return;
    let obj: Record<string, unknown>;
    try {
      obj = JSON.parse(line);
    } catch {
      return;
    }
    if (obj.type === "response") {
      const pending = obj.id != null ? this.pending.get(String(obj.id)) : null;
      if (pending) {
        this.pending.delete(String(obj.id));
        if (obj.success === false) pending.reject(new Error(String(obj.error || `${obj.command} failed`)));
        else pending.resolve(obj);
        return;
      }
    }
    this.push(obj);
  }

  push(event: Record<string, unknown>) {
    const rec = { seq: ++this.seq, ts: Date.now(), event };
    this.events.push(rec);
    if (this.events.length > MAX_EVENTS) this.events.splice(0, this.events.length - MAX_EVENTS);
    this.view = foldPiEvent(this.view, rec as PiWrapped);
    this.emit("event", rec);
  }

  send(cmd: Record<string, unknown>, timeoutMs = 30_000) {
    if (!this.alive) return Promise.reject(new Error("session stopped"));
    const id = `r${++this.n}`;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`rpc timeout ${cmd.type}`));
        }
      }, timeoutMs);
      this.pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      this.proc.stdin.write(`${JSON.stringify({ id, ...cmd })}\n`);
    });
  }

  async getState() {
    const res = (await this.send({ type: "get_state" })) as { data?: Record<string, unknown> };
    this.state = res.data || null;
    const model = this.state?.model as { provider?: string; id?: string } | undefined;
    if (this.state?.sessionFile) this.meta.session_file = String(this.state.sessionFile);
    if (model) {
      this.meta.provider = model.provider || this.meta.provider;
      this.meta.model = model.id || this.meta.model;
    }
    return this.state;
  }

  snapshot() {
    return { ...this.meta, alive: this.alive, seq: this.seq, state: this.state };
  }

  eventsAfter(after = 0) {
    return this.events.filter((e) => e.seq > Number(after || 0));
  }

  async stop() {
    if (!this.alive) return;
    try {
      this.proc.kill("SIGTERM");
    } catch {
      /* ignore */
    }
    this.alive = false;
    this.meta.status = "stopped";
    this.meta.updated_at = Date.now();
  }
}

export type PiHub = ReturnType<typeof createPiHub>;

export function createPiHub() {
  const live = new Map<string, PiSession>();

  function spawnProc(opts: { provider?: string; model?: string; thinking?: string; name?: string; cwd: string }) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
    const args = [
      "--mode", "rpc",
      "--approve",
      "--no-extensions",
      "--provider", opts.provider || DEFAULT_PROVIDER,
      "--model", opts.model || DEFAULT_MODEL,
      "--thinking", opts.thinking || DEFAULT_THINKING,
      "--session-dir", SESSION_DIR,
    ];
    if (opts.name) args.push("--name", opts.name);
    return spawn(PI_BIN, args, {
      cwd: opts.cwd,
      env: withSecrets(),
      stdio: ["pipe", "pipe", "pipe"],
    });
  }

  return {
    list() {
      return [...live.values()].map((s) => s.snapshot());
    },
    get(id: string) {
      return live.get(id) || null;
    },
    async create(body: { cwd?: string; provider?: string; model?: string; thinking?: string; name?: string } = {}) {
      const id = newId();
      const cwd = safeCwd(body.cwd);
      const meta: SessionMeta = {
        id,
        name: body.name || "New chat",
        cwd,
        provider: body.provider || DEFAULT_PROVIDER,
        model: body.model || DEFAULT_MODEL,
        thinking: body.thinking || DEFAULT_THINKING,
        status: "live",
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      const proc = spawnProc({ ...meta, name: id, cwd });
      const sess = new PiSession({ id, meta, proc });
      live.set(id, sess);
      sess.proc.on("exit", () => {
        /* keep for poll of last events */
      });
      try {
        await sess.getState();
      } catch {
        /* boot can race; prompt will retry */
      }
      return sess.snapshot();
    },
    async prompt(id: string, message: string) {
      const sess = live.get(id);
      if (!sess) throw new Error("no-session");
      if (!sess.alive) throw new Error("session stopped");
      const streaming = Boolean(sess.state?.isStreaming || sess.view.streaming);
      const cmd = streaming
        ? { type: "steer", message }
        : { type: "prompt", message };
      const res = await sess.send(cmd);
      sess.getState().catch(() => {});
      return res;
    },
    async abort(id: string) {
      const sess = live.get(id);
      if (!sess) throw new Error("no-session");
      return sess.send({ type: "abort" });
    },
    async setModel(id: string, provider: string, modelId: string) {
      const sess = live.get(id);
      if (!sess) throw new Error("no-session");
      const res = await sess.send({ type: "set_model", provider, modelId });
      sess.meta.provider = provider;
      sess.meta.model = modelId;
      sess.meta.updated_at = Date.now();
      return (res as { data?: unknown }).data;
    },
    async setThinking(id: string, level: string) {
      const sess = live.get(id);
      if (!sess) throw new Error("no-session");
      await sess.send({ type: "set_thinking_level", level });
      sess.meta.thinking = level;
      return { level };
    },
    async models() {
      const first = [...live.values()].find((s) => s.alive);
      if (!first) {
        const snap = await this.create({ name: "models" });
        const sess = live.get(snap.id);
        if (!sess) return { models: [] };
        const res = (await sess.send({ type: "get_available_models" })) as { data?: { models?: unknown[] } };
        return { models: res.data?.models || [] };
      }
      const res = (await first.send({ type: "get_available_models" })) as { data?: { models?: unknown[] } };
      return { models: res.data?.models || [] };
    },
    async decide(id: string, aid: string, body: { confirmed?: boolean; value?: string; cancelled?: boolean }) {
      const sess = live.get(id);
      if (!sess) throw new Error("no-session");
      const payload: Record<string, unknown> = { type: "extension_ui_response", id: aid };
      if (body.cancelled) payload.cancelled = true;
      else if (typeof body.confirmed === "boolean") payload.confirmed = body.confirmed;
      else if (body.value != null) payload.value = body.value;
      sess.proc.stdin.write(`${JSON.stringify(payload)}\n`);
      sess.view = {
        ...sess.view,
        approvals: sess.view.approvals.map((a) => (a.id === aid ? { ...a, status: "answered" } : a)),
      };
      return { ok: true };
    },
    poll(id: string, after = 0) {
      const sess = live.get(id);
      if (!sess) return null;
      return {
        session: sess.snapshot(),
        events: sess.eventsAfter(after),
        view: sess.view,
        lastSeq: sess.seq,
        approvals: sess.view.approvals.filter((a) => a.status === "pending"),
      };
    },
  };
}

const g = globalThis as typeof globalThis & { __beautifulPiHub?: PiHub };
if (!g.__beautifulPiHub) g.__beautifulPiHub = createPiHub();
export const hub = g.__beautifulPiHub;
