"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { IconHome } from "@central-icons-react/round-outlined-radius-2-stroke-2/IconHome";
import { useDialKit, type DialConfig } from "dialkit";
import posthog from "posthog-js";
import PromptBar, { type PromptBarModel } from "@/components/primitives/PromptBar";
import SidebarNav, { type SidebarRecent } from "@/components/primitives/SidebarNav";
import { UseThisModal } from "@/components/site/UseThisHarness";
import PiThread from "@/components/site/PiTurn";
import { piApi, type PiSessionSnap } from "@/lib/pi-client";
import { DEFAULT_MODEL_KEY, splitModelKey } from "@/lib/pi-models";

const WORKSPACE = { name: "Pi", monogram: "P" };
const NAV_ITEMS = [{ key: "chats", label: "Chats", icon: <IconHome size={18} /> }];
const FALLBACK_MODELS: PromptBarModel[] = [{ key: DEFAULT_MODEL_KEY, name: "gpt-5.6-sol", tag: "Codex" }];
const STARTERS = [
  { id: "pong", label: "Reply with pong" },
  { id: "cwd", label: "What is the current working directory?" },
  { id: "who", label: "Which model are you, and what can you do here?" },
];

function SuggestionIcon({ kind }: { kind: string }) {
  const paths: Record<string, ReactNode> = {
    pong: <path d="M12 3v18M8 8l4-4 4 4M8 16l4 4 4-4" />,
    cwd: <g><path d="M4 6h6l2 2h8v10H4z" /><path d="M4 10h16" /></g>,
    who: <g><circle cx="12" cy="8" r="3.2" /><path d="M5 19c1.4-3.2 3.8-4.8 7-4.8S17.6 15.8 19 19" /></g>,
  };
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[kind] ?? paths.pong}
    </svg>
  );
}

const HOME_REVEAL_TIMING = {
  hello: 170,
  question: 330,
  prompt: 400,
  recommendations: 550,
};

const HOME_REVEAL = {
  offsetY: 23,
  blur: 17,
  duration: 800,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
};

const HOME_REVEAL_DIALS = {
  reveal: {
    blur: [HOME_REVEAL.blur, 0, 40, 1],
    offsetY: [HOME_REVEAL.offsetY, 0, 60, 1],
    duration: [HOME_REVEAL.duration, 200, 800, 10],
  },
  sequence: {
    helloAt: [HOME_REVEAL_TIMING.hello, 0, 300, 10],
    questionAt: [HOME_REVEAL_TIMING.question, 0, 500, 10],
    promptAt: [HOME_REVEAL_TIMING.prompt, 0, 700, 10],
    recommendationsAt: [HOME_REVEAL_TIMING.recommendations, 0, 900, 10],
  },
  replay: { type: "action", label: "Replay entrance" },
} satisfies DialConfig;

function homeRevealStyle(
  visible: boolean,
  reveal: { blur: number; offsetY: number; duration: number },
): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0, 0, 0)" : `translate3d(0, ${reveal.offsetY}px, 0)`,
    filter: visible ? "blur(0px)" : `blur(${reveal.blur}px)`,
    transition: ["opacity", "transform", "filter"]
      .map((property) => `${property} ${reveal.duration}ms ${HOME_REVEAL.easing}`)
      .join(", "),
  };
}

function EmptyState({
  onSend,
  models,
  modelKey,
  onModel,
}: {
  onSend: (text: string) => void;
  models: PromptBarModel[];
  modelKey: string;
  onModel: (key: string) => void;
}) {
  const [stage, setStage] = useState(0);
  const [replayTrigger, setReplayTrigger] = useState(0);
  const revealParams = useDialKit("Home entrance", HOME_REVEAL_DIALS, {
    id: "harness-home-entrance-v2",
    persist: true,
    onAction: (action) => {
      if (action === "replay") setReplayTrigger((current) => current + 1);
    },
  });
  useEffect(() => {
    setStage(0);
    const timers = [
      setTimeout(() => setStage(1), revealParams.sequence.helloAt),
      setTimeout(() => setStage(2), revealParams.sequence.questionAt),
      setTimeout(() => setStage(3), revealParams.sequence.promptAt),
      setTimeout(() => setStage(4), revealParams.sequence.recommendationsAt),
    ];
    return () => timers.forEach(clearTimeout);
  }, [
    replayTrigger,
    revealParams.sequence.helloAt,
    revealParams.sequence.questionAt,
    revealParams.sequence.promptAt,
    revealParams.sequence.recommendationsAt,
  ]);

  return (
    <div className="mx-auto flex min-h-full max-w-[720px] flex-col justify-center px-4 py-10 sm:px-8">
      <h1 className="text-[26px] font-normal tracking-[-0.02em] text-ink">
        <span className="home-reveal block text-ink-3" style={homeRevealStyle(stage >= 1, revealParams.reveal)}>
          Hello
        </span>
        <span className="home-reveal block" style={homeRevealStyle(stage >= 2, revealParams.reveal)}>
          What can I help you with?
        </span>
      </h1>

      <div className="home-reveal relative mt-7" style={homeRevealStyle(stage >= 3, revealParams.reveal)}>
        <PromptBar
          demo={false}
          tall
          placeholder="Ask Pi…"
          models={models}
          modelKey={modelKey}
          onModel={onModel}
          onSend={onSend}
        />
      </div>

      <div className="home-reveal mt-6 flex flex-col" style={homeRevealStyle(stage >= 4, revealParams.reveal)}>
        {STARTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              posthog.capture("harness_suggestion_selected");
              onSend(item.label);
            }}
            className="-mx-2 flex items-center gap-3 rounded-control px-2 py-2.5 text-left text-[14px] text-ink transition-colors duration-150 hover:bg-hover"
          >
            <span className="text-ink-3">
              <SuggestionIcon kind={item.id} />
            </span>
            <span className="min-w-0 truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

type Chat = {
  id: number;
  title: string | null;
  sessionId?: string;
  pending?: string;
  err?: string;
  messages: { id: number; text: string }[];
};

function sessionLabel(session: PiSessionSnap): string {
  return session.name && session.name !== "New chat" ? session.name : `${session.provider}/${session.model}`;
}

export default function IceCreamHarness() {
  const [chats, setChats] = useState<Chat[]>([{ id: 1, title: null, messages: [] }]);
  const [activeId, setActiveId] = useState(1);
  const [useOpen, setUseOpen] = useState(false);
  const [models, setModels] = useState<PromptBarModel[]>(FALLBACK_MODELS);
  const [modelKey, setModelKey] = useState(DEFAULT_MODEL_KEY);
  const [recents, setRecents] = useState<SidebarRecent[]>([]);
  const chatIdRef = useRef(1);
  const msgIdRef = useRef(0);
  const sessionRef = useRef<Record<number, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const chat = chats.find((c) => c.id === activeId) ?? chats[0];
  const active = chat.messages.length > 0 || Boolean(chat.sessionId || chat.pending);

  const refreshRecents = () => {
    void piApi
      .sessions()
      .then(({ sessions }) => {
        setRecents(
          sessions.map((session) => ({
            id: session.id,
            label: sessionLabel(session),
          })),
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    void piApi
      .models()
      .then((data) => {
        if (!data.models?.length) return;
        setModels(data.models);
        setModelKey((current) => (data.models.some((model) => model.key === current) ? current : data.models[0].key));
      })
      .catch(() => {});
    refreshRecents();
  }, []);

  const changeModel = (key: string) => {
    setModelKey(key);
    const { provider, id } = splitModelKey(key);
    const sessionId = sessionRef.current[chat.id] || chat.sessionId;
    if (!sessionId || !provider || !id) return;
    void piApi.setModel(sessionId, provider, id).catch((error) => {
      setChats((current) =>
        current.map((item) => (item.id === chat.id ? { ...item, err: (error as Error).message } : item)),
      );
    });
  };

  const send = (text: string) => {
    posthog.capture("harness_prompt_sent");
    const label = text.length > 30 ? `${text.slice(0, 30).trimEnd()}…` : text;
    const chatId = chat.id;
    setChats((current) =>
      current.map((item) =>
        item.id === chatId
          ? {
              ...item,
              title: item.title ?? label,
              pending: text,
              err: undefined,
              messages: [...item.messages, { id: (msgIdRef.current += 1), text }],
            }
          : item,
      ),
    );
    void (async () => {
      try {
        let sessionId = sessionRef.current[chatId] || chat.sessionId;
        if (!sessionId) {
          const { provider, id } = splitModelKey(modelKey);
          const created = await piApi.create({
            name: label,
            ...(provider ? { provider, model: id } : {}),
          });
          sessionId = created.session.id;
          sessionRef.current[chatId] = sessionId;
          setChats((current) => current.map((item) => (item.id === chatId ? { ...item, sessionId } : item)));
          refreshRecents();
        }
        await piApi.prompt(sessionId, text);
        setChats((current) => current.map((item) => (item.id === chatId ? { ...item, pending: undefined } : item)));
      } catch (error) {
        setChats((current) =>
          current.map((item) =>
            item.id === chatId ? { ...item, err: (error as Error).message, pending: undefined } : item,
          ),
        );
      }
    })();
  };

  const pickRecent = (sessionId: string, label: string) => {
    posthog.capture("harness_recent_chat_opened");
    const existing = chats.find((item) => item.sessionId === sessionId || sessionRef.current[item.id] === sessionId);
    if (existing) {
      setActiveId(existing.id);
      return;
    }
    const id = (chatIdRef.current += 1);
    sessionRef.current[id] = sessionId;
    setChats((current) => [...current, { id, title: label, messages: [], sessionId }]);
    setActiveId(id);
    void piApi
      .poll(sessionId, 0)
      .then((data) => {
        const key = `${data.session.provider}/${data.session.model}`;
        if (models.some((model) => model.key === key)) setModelKey(key);
      })
      .catch(() => {});
  };

  const newChat = () => {
    const id = (chatIdRef.current += 1);
    setChats((current) => [...current, { id, title: null, messages: [] }]);
    setActiveId(id);
  };

  const closeChat = (id: number) => {
    const remaining = chats.filter((item) => item.id !== id);
    if (remaining.length === 0) {
      const nextId = (chatIdRef.current += 1);
      setChats([{ id: nextId, title: null, messages: [] }]);
      setActiveId(nextId);
      return;
    }
    setChats(remaining);
    if (id === activeId) setActiveId(remaining[remaining.length - 1].id);
  };

  useEffect(() => {
    if (!active) return;
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat.messages, active]);

  const composer = (
    <PromptBar
      demo={false}
      tall
      placeholder={active ? "Reply" : "Ask Pi…"}
      models={models}
      modelKey={modelKey}
      onModel={changeModel}
      onSend={send}
    />
  );

  const tabBar = (
    <div className="flex h-11 shrink-0 items-center gap-1 overflow-x-auto border-b border-line px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {chats.map((item) => (
        <div
          key={item.id}
          className={`group/tab flex h-7 w-36 shrink-0 items-center gap-0.5 rounded-[7px] pl-2.5 pr-1 text-[12.5px] font-medium transition-colors duration-100 ${
            item.id === activeId ? "bg-hover-2 text-ink" : "text-ink-2 hover:bg-hover hover:text-ink"
          }`}
        >
          <button
            type="button"
            aria-pressed={item.id === activeId}
            onClick={() => setActiveId(item.id)}
            title={item.title ?? "New chat"}
            className="min-w-0 flex-1 text-left"
          >
            <span className="block truncate">{item.title ?? "New chat"}</span>
          </button>
          <button
            type="button"
            aria-label="Close tab"
            onClick={() => closeChat(item.id)}
            className="-my-1 flex size-6 shrink-0 items-center justify-center rounded-[5px] text-ink-3 transition-[background-color,color] duration-100 hover:bg-hover-2 hover:text-ink"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        aria-label="New chat"
        onClick={newChat}
        className="ml-0.5 flex size-7 shrink-0 items-center justify-center rounded-[7px] text-ink-3 transition-colors duration-100 hover:bg-hover hover:text-ink"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );

  return (
    <main className="flex h-[100dvh] gap-0 bg-canvas p-2.5 text-ink lg:pl-0">
      <SidebarNav
        fill
        className="hidden lg:flex"
        workspace={WORKSPACE}
        navItems={NAV_ITEMS}
        recents={recents}
        activeTitle={chat.title}
        onPick={(id, label) => pickRecent(id, label)}
        onNewChat={newChat}
        footerLabel="Fork this"
        onFooterClick={() => setUseOpen(true)}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex min-h-0 flex-1 gap-2.5">
          <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-line bg-page">
            {tabBar}
            {active ? (
              <div className="flex min-h-0 flex-1 flex-col">
                {chat.sessionId ? (
                  <PiThread sessionId={chat.sessionId} pendingUser={chat.pending} error={chat.err} />
                ) : (
                  <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-4 py-8 sm:px-8 lg:px-12">
                      {chat.err ? <p className="text-[13px] text-red">{chat.err}</p> : null}
                    </div>
                  </div>
                )}
                <div className="shrink-0 bg-page px-4 pt-3 pb-6 sm:px-8 lg:px-12">
                  <div className="mx-auto max-w-[720px]">{composer}</div>
                </div>
              </div>
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto">
                <EmptyState onSend={send} models={models} modelKey={modelKey} onModel={changeModel} />
              </div>
            )}
          </section>
        </div>
      </div>

      <UseThisModal open={useOpen} onClose={() => setUseOpen(false)} />
    </main>
  );
}
