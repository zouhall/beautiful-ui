"use client";

import { useEffect, useRef, useState } from "react";
import ApprovalCard from "@/components/primitives/ApprovalCard";
import LoadingState from "@/components/primitives/LoadingState";
import StreamingText from "@/components/primitives/StreamingText";
import ThinkingState from "@/components/primitives/ThinkingState";
import ToolChips from "@/components/primitives/ToolChips";
import { emptyPiView, piApi } from "@/lib/pi-client";
import type { PiApproval, PiMessage, PiView } from "@/lib/pi-fold";

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end pl-10 sm:pl-24" style={{ animation: "fade-up 300ms cubic-bezier(0.23,1,0.32,1) both" }}>
      <div className="rounded-xl bg-field px-3.5 py-2 text-[13px] leading-relaxed text-ink shadow-hairline">{text}</div>
    </div>
  );
}

function AssistantTurn({ message, streaming }: { message: PiMessage; streaming: boolean }) {
  const last = streaming;
  return (
    <article className="min-w-0" style={{ animation: "fade-up 450ms cubic-bezier(0.23,1,0.32,1) both" }}>
      {message.thinking ? (
        <ThinkingState
          variant="Reasoning"
          transcript={message.thinking}
          working={last && !message.text && message.tools.length === 0}
          active="Thinking"
          done="Thought"
        />
      ) : null}
      {message.tools.length > 0 ? (
        <div className={message.thinking ? "mt-3" : undefined}>
          <ToolChips tools={message.tools} />
        </div>
      ) : null}
      {message.text || (last && !message.thinking && message.tools.length === 0) ? (
        <div className={message.thinking || message.tools.length ? "mt-4" : undefined}>
          {message.text ? (
            <StreamingText fill loop={false} text={message.text} streaming={last && !message.tools.some((t) => t.status === "running")} />
          ) : (
            <LoadingState label="Thinking" variant="Dots" />
          )}
        </div>
      ) : null}
    </article>
  );
}

export default function PiThread({
  sessionId,
  pendingUser,
  error,
}: {
  sessionId: string;
  pendingUser?: string;
  error?: string;
}) {
  const [view, setView] = useState<PiView>(emptyPiView());
  const [approvals, setApprovals] = useState<PiApproval[]>([]);
  const after = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      try {
        const data = await piApi.poll(sessionId, after.current);
        if (stop) return;
        after.current = data.lastSeq;
        setView(data.view);
        setApprovals(data.approvals || []);
      } catch {
        /* next tick */
      }
    };
    tick();
    const t = window.setInterval(tick, 280);
    return () => {
      stop = true;
      window.clearInterval(t);
    };
  }, [sessionId]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [view.messages.length, view.streaming, view.messages.at(-1)?.text, view.messages.at(-1)?.thinking]);

  const last = view.messages[view.messages.length - 1];
  const showPending =
    pendingUser &&
    !view.messages.some((m) => m.role === "user" && m.text === pendingUser);

  return (
    <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-4 py-8 sm:px-8 lg:px-12">
        {view.messages.map((message, i) => {
          const streaming = view.streaming && i === view.messages.length - 1 && message.role === "assistant";
          return (
            <div key={message.id} className="w-full">
              {message.role === "user" ? (
                <UserBubble text={message.text} />
              ) : (
                <AssistantTurn message={message} streaming={streaming} />
              )}
            </div>
          );
        })}
        {showPending ? <UserBubble text={pendingUser} /> : null}
        {view.streaming && last?.role !== "assistant" ? (
          <LoadingState label="Thinking" variant="Dots" />
        ) : null}
        {approvals.map((a) => (
          <ApprovalCard
            key={a.id}
            title={a.title}
            message={a.message}
            options={a.options}
            resettable={false}
            onDecide={(ok, value) => {
              piApi.decide(sessionId, a.id, a.kind === "confirm" ? { confirmed: ok } : { value, cancelled: !ok }).catch(() => {});
            }}
          />
        ))}
        {error ? <p className="text-[13px] text-red">{error}</p> : null}
        {view.error ? <p className="text-[13px] text-red">{view.error}</p> : null}
      </div>
    </div>
  );
}
