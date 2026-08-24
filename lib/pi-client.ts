import type { PiView, PiApproval } from "./pi-fold";
import { emptyPiView } from "./pi-fold";

export type PiSessionSnap = {
  id: string;
  name: string;
  cwd: string;
  provider: string;
  model: string;
  thinking: string;
  status: string;
  alive: boolean;
  seq: number;
};

async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data as { error?: string }).error || r.statusText);
  return data as T;
}

export const piApi = {
  sessions: () => j<{ sessions: PiSessionSnap[] }>("/api/pi/sessions"),
  create: (body: Record<string, unknown> = {}) =>
    j<{ session: PiSessionSnap }>("/api/pi/sessions", { method: "POST", body: JSON.stringify(body) }),
  poll: (id: string, after = 0) =>
    j<{ session: PiSessionSnap; view: PiView; lastSeq: number; approvals: PiApproval[] }>(
      `/api/pi/sessions/${encodeURIComponent(id)}?after=${after}`,
    ),
  prompt: (id: string, message: string) =>
    j<{ ok: boolean }>(`/api/pi/sessions/${encodeURIComponent(id)}/prompt`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  abort: (id: string) =>
    j<{ ok: boolean }>(`/api/pi/sessions/${encodeURIComponent(id)}/abort`, { method: "POST" }),
  decide: (id: string, aid: string, body: { confirmed?: boolean; value?: string; cancelled?: boolean }) =>
    j<{ ok: boolean }>(`/api/pi/sessions/${encodeURIComponent(id)}/approvals`, {
      method: "POST",
      body: JSON.stringify({ id: aid, ...body }),
    }),
  setModel: (id: string, provider: string, model: string) =>
    j<{ ok: boolean }>(`/api/pi/sessions/${encodeURIComponent(id)}/model`, {
      method: "POST",
      body: JSON.stringify({ provider, model }),
    }),
  models: () => j<{ models: { key: string; name: string; tag: string; provider: string; id: string }[] }>("/api/pi/models"),
};

export { emptyPiView };
