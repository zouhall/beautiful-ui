import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyPiView, foldPiEvent, foldPiEvents } from "./pi-fold.ts";

test("empty view starts idle", () => {
  const v = emptyPiView();
  assert.equal(v.streaming, false);
  assert.equal(v.messages.length, 0);
  assert.equal(v.approvals.length, 0);
  assert.equal(v.error, null);
});

test("text_delta appends assistant text", () => {
  let v = emptyPiView();
  v = foldPiEvent(v, { seq: 1, event: { type: "agent_start" } });
  v = foldPiEvent(v, {
    seq: 2,
    event: { type: "message_start", message: { role: "assistant", content: [] } },
  });
  v = foldPiEvent(v, {
    seq: 3,
    event: {
      type: "message_update",
      assistantMessageEvent: { type: "text_delta", delta: "Hello" },
    },
  });
  v = foldPiEvent(v, {
    seq: 4,
    event: {
      type: "message_update",
      assistantMessageEvent: { type: "text_delta", delta: " world" },
    },
  });
  assert.equal(v.streaming, true);
  assert.equal(v.messages.at(-1)?.role, "assistant");
  assert.equal(v.messages.at(-1)?.text, "Hello world");
});

test("thinking_delta fills thinking", () => {
  let v = emptyPiView();
  v = foldPiEvent(v, { seq: 1, event: { type: "agent_start" } });
  v = foldPiEvent(v, {
    seq: 2,
    event: {
      type: "message_update",
      assistantMessageEvent: { type: "thinking_delta", delta: "plan" },
    },
  });
  assert.equal(v.messages.at(-1)?.thinking, "plan");
});

test("tool events upsert chips", () => {
  let v = emptyPiView();
  v = foldPiEvent(v, {
    seq: 1,
    event: { type: "tool_execution_start", toolCallId: "t1", toolName: "bash", args: { command: "ls" } },
  });
  v = foldPiEvent(v, {
    seq: 2,
    event: {
      type: "tool_execution_end",
      toolCallId: "t1",
      toolName: "bash",
      result: { content: [{ type: "text", text: "ok" }] },
      isError: false,
    },
  });
  const tool = v.messages.at(-1)?.tools[0];
  assert.equal(tool?.name, "bash");
  assert.equal(tool?.status, "done");
  assert.equal(tool?.result, "ok");
});

test("user message_start is kept", () => {
  const v = foldPiEvent(emptyPiView(), {
    seq: 1,
    event: { type: "message_start", message: { role: "user", content: "hi" } },
  });
  assert.equal(v.messages[0]?.role, "user");
  assert.equal(v.messages[0]?.text, "hi");
});

test("duplicate seq is ignored", () => {
  let v = foldPiEvent(emptyPiView(), { seq: 3, event: { type: "agent_start" } });
  v = foldPiEvent(v, { seq: 3, event: { type: "agent_start" } });
  assert.equal(v.lastSeq, 3);
});

test("agent_settled stops streaming", () => {
  const v = foldPiEvents([
    { seq: 1, event: { type: "agent_start" } },
    { seq: 2, event: { type: "agent_settled" } },
  ]);
  assert.equal(v.streaming, false);
});

test("extension confirm becomes a pending approval", () => {
  const v = foldPiEvent(emptyPiView(), {
    seq: 1,
    event: {
      type: "extension_ui_request",
      id: "u1",
      method: "confirm",
      title: "Run rm?",
      message: "This deletes files",
    },
  });
  assert.equal(v.approvals.length, 1);
  assert.equal(v.approvals[0]?.id, "u1");
  assert.equal(v.approvals[0]?.kind, "confirm");
  assert.equal(v.approvals[0]?.title, "Run rm?");
});

test("error event records message and stops stream", () => {
  const v = foldPiEvent(emptyPiView(), { seq: 1, event: { type: "error", error: "boom" } });
  assert.equal(v.error, "boom");
  assert.equal(v.streaming, false);
});

test("assistant errorMessage becomes view.error", () => {
  const v = foldPiEvent(emptyPiView(), {
    seq: 1,
    event: {
      type: "message_end",
      message: { role: "assistant", content: [], errorMessage: "403 quota", stopReason: "error" },
    },
  });
  assert.equal(v.error, "403 quota");
  assert.equal(v.streaming, false);
});
