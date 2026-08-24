export type PiTool = {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result: string;
  status: "running" | "done" | "error";
  error: boolean;
};

export type PiMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  thinking: string;
  tools: PiTool[];
};

export type PiApproval = {
  id: string;
  kind: "confirm" | "select" | "input" | "editor";
  title: string;
  message: string;
  options: string[];
  status: "pending" | "answered";
};

export type PiView = {
  messages: PiMessage[];
  streaming: boolean;
  error: string | null;
  lastSeq: number;
  approvals: PiApproval[];
  model: { provider?: string; id?: string } | null;
  thinkingLevel: string | null;
};

export type PiWrapped = {
  seq?: number;
  event?: Record<string, unknown>;
  type?: string;
};

function uid() {
  return `m_${Math.random().toString(16).slice(2, 10)}`;
}

function textOf(message: unknown): string {
  if (!message || typeof message !== "object") return "";
  const m = message as { content?: unknown };
  if (typeof m.content === "string") return m.content;
  const bits: string[] = [];
  for (const part of Array.isArray(m.content) ? m.content : []) {
    if (typeof part === "string") bits.push(part);
    else if (part && typeof part === "object") {
      const p = part as { type?: string; text?: string };
      if (p.type === "text" && p.text) bits.push(p.text);
    }
  }
  return bits.join("");
}

function thinkingOf(message: unknown): string {
  if (!message || typeof message !== "object") return "";
  const m = message as { content?: unknown };
  const bits: string[] = [];
  for (const part of Array.isArray(m.content) ? m.content : []) {
    if (!part || typeof part !== "object") continue;
    const p = part as { type?: string; thinking?: string; text?: string };
    if (p.type === "thinking" && (p.thinking || p.text)) bits.push(p.thinking || p.text || "");
  }
  return bits.join("");
}

function resultText(result: unknown): string {
  if (!result || typeof result !== "object") return "";
  const r = result as { content?: unknown };
  return (Array.isArray(r.content) ? r.content : [])
    .map((c) => (c && typeof c === "object" ? String((c as { text?: string }).text || "") : ""))
    .join("");
}

export function emptyPiView(): PiView {
  return {
    messages: [],
    streaming: false,
    error: null,
    lastSeq: 0,
    approvals: [],
    model: null,
    thinkingLevel: null,
  };
}

function lastAssistant(messages: PiMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "assistant") return i;
  }
  return -1;
}

function withAssistant(view: PiView) {
  const messages = view.messages.slice();
  let i = lastAssistant(messages);
  if (i < 0) {
    messages.push({ id: uid(), role: "assistant", text: "", thinking: "", tools: [] });
    i = messages.length - 1;
  } else {
    messages[i] = { ...messages[i], tools: (messages[i].tools || []).slice() };
  }
  return { messages, i };
}

function upsertTool(tools: PiTool[], patch: Partial<PiTool> & { id: string }) {
  const idx = tools.findIndex((t) => t.id === patch.id);
  if (idx < 0) {
    tools.push({
      id: patch.id,
      name: patch.name || "tool",
      args: patch.args ?? {},
      result: patch.result ?? "",
      status: patch.status || "running",
      error: Boolean(patch.error),
    });
    return;
  }
  tools[idx] = { ...tools[idx], ...patch };
}

export function foldPiEvent(view: PiView, wrapped: PiWrapped): PiView {
  const seq = typeof wrapped?.seq === "number" ? wrapped.seq : null;
  if (seq != null && seq <= (view.lastSeq || 0)) return view;
  const e = (wrapped?.event || wrapped) as Record<string, unknown>;
  if (!e || typeof e !== "object") return view;
  const done = (next: PiView) => (seq != null ? { ...next, lastSeq: seq } : next);

  if (e.type === "agent_start") return done({ ...view, streaming: true, error: null });
  if (e.type === "agent_settled" || e.type === "agent_end") {
    return done({ ...view, streaming: false });
  }

  if (e.type === "message_start") {
    const m = (e.message || {}) as { role?: string; id?: string; content?: unknown };
    const role = m.role === "user" ? "user" : m.role === "assistant" ? "assistant" : null;
    if (!role) return done(view);
    const text = textOf(m);
    const prev = view.messages[view.messages.length - 1];
    if (role === "user" && prev?.role === "user" && prev.text === text && text) {
      return done(view);
    }
    return done({
      ...view,
      messages: [
        ...view.messages,
        { id: m.id || uid(), role, text, thinking: thinkingOf(m), tools: [] },
      ],
    });
  }

  if (e.type === "message_update") {
    const d = (e.assistantMessageEvent || {}) as {
      type?: string;
      delta?: string;
      content?: string;
      thinking?: string;
      toolCall?: { id?: string; toolCallId?: string; name?: string; toolName?: string; arguments?: Record<string, unknown>; args?: Record<string, unknown> };
    };
    const { messages, i } = withAssistant(view);
    const last = { ...messages[i] };
    if (d.type === "text_delta") last.text += d.delta || "";
    if (d.type === "thinking_delta") last.thinking += d.delta || "";
    if (d.type === "text_end" && d.content) last.text = d.content;
    if (d.type === "thinking_end" && (d.content || d.thinking)) last.thinking = d.content || d.thinking || last.thinking;
    if (d.type === "toolcall_end" && d.toolCall) {
      const tools = (last.tools || []).slice();
      upsertTool(tools, {
        id: d.toolCall.id || d.toolCall.toolCallId || uid(),
        name: d.toolCall.name || d.toolCall.toolName,
        args: d.toolCall.arguments || d.toolCall.args || {},
        status: "running",
      });
      last.tools = tools;
    }
    messages[i] = last;
    return done({ ...view, messages, streaming: true });
  }

  if (e.type === "message_end" && (e.message as { role?: string } | undefined)?.role === "assistant") {
    const { messages, i } = withAssistant(view);
    const text = textOf(e.message);
    const thinking = thinkingOf(e.message);
    const err = (e.message as { errorMessage?: string }).errorMessage;
    messages[i] = {
      ...messages[i],
      text: text || messages[i].text,
      thinking: thinking || messages[i].thinking,
    };
    return done({ ...view, messages, error: err ? String(err) : view.error, streaming: err ? false : view.streaming });
  }

  if (e.type === "tool_execution_start") {
    const { messages, i } = withAssistant(view);
    const tools = (messages[i].tools || []).slice();
    upsertTool(tools, {
      id: String(e.toolCallId || uid()),
      name: String(e.toolName || "tool"),
      args: (e.args as Record<string, unknown>) || {},
      status: "running",
    });
    messages[i] = { ...messages[i], tools };
    return done({ ...view, messages, streaming: true });
  }

  if (e.type === "tool_execution_update") {
    const { messages, i } = withAssistant(view);
    const tools = (messages[i].tools || []).slice();
    upsertTool(tools, {
      id: String(e.toolCallId || uid()),
      name: String(e.toolName || "tool"),
      args: (e.args as Record<string, unknown>) || {},
      result: resultText(e.partialResult),
      status: "running",
    });
    messages[i] = { ...messages[i], tools };
    return done({ ...view, messages });
  }

  if (e.type === "tool_execution_end") {
    const { messages, i } = withAssistant(view);
    const tools = (messages[i].tools || []).slice();
    upsertTool(tools, {
      id: String(e.toolCallId || uid()),
      name: String(e.toolName || "tool"),
      result: resultText(e.result),
      status: e.isError ? "error" : "done",
      error: Boolean(e.isError),
    });
    messages[i] = { ...messages[i], tools };
    return done({ ...view, messages });
  }

  if (e.type === "extension_ui_request") {
    const method = String(e.method || "");
    if (!["confirm", "select", "input", "editor"].includes(method)) return done(view);
    const approval: PiApproval = {
      id: String(e.id || uid()),
      kind: method as PiApproval["kind"],
      title: String(e.title || "Approval"),
      message: String(e.message || ""),
      options: Array.isArray(e.options) ? e.options.map(String) : [],
      status: "pending",
    };
    return done({ ...view, approvals: [...view.approvals.filter((a) => a.id !== approval.id), approval] });
  }

  if (e.type === "error" || e.error) {
    return done({
      ...view,
      error: String(e.error || e.message || "agent error"),
      streaming: false,
    });
  }

  return done(view);
}

export function foldPiEvents(events: PiWrapped[], start = emptyPiView()): PiView {
  return (events || []).reduce(foldPiEvent, start);
}
