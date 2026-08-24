import type { ReactNode } from "react";

/* AppShell — the application skeleton: sidebar rail, topbar, scrollable
 * content. Slots only; bring your own nav and header content. */

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
    <div className={`flex h-dvh bg-canvas text-ink ${className}`}>
      {sidebar ? (
        <aside className="w-60 shrink-0 overflow-y-auto border-r border-line bg-surface">
          {sidebar}
        </aside>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        {header ? (
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-5">
            {header}
          </header>
        ) : null}
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
