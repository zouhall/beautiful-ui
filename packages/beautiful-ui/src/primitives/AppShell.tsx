import type { ReactNode } from "react";

/* AppShell — the application skeleton. Everything sits on the canvas; the
 * content lives in a rounded page window (the harness pattern). The
 * sidebar rests directly on the canvas — no elevation, no hard border. */

export default function AppShell({
  sidebar,
  header,
  children,
  className = "",
}: {
  sidebar?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex h-dvh gap-2.5 bg-canvas p-2.5 text-ink ${className}`}>
      {sidebar ? (
        <aside className="hidden w-60 shrink-0 overflow-y-auto lg:block">
          {sidebar}
        </aside>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-window border border-line bg-page">
        {header ? (
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-5">
            {header}
          </header>
        ) : null}
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
