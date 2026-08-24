"use client";

import { Dialog as Base } from "@base-ui/react/dialog";
import type { ReactNode } from "react";

/* Dialog — modal on Base UI: backdrop, scroll lock, focus trap and Esc
 * come from the primitive; the skin is the studio's CodeView language. */

export const Dialog = Base.Root;
export const DialogTrigger = Base.Trigger;
export const DialogClose = Base.Close;
export const DialogTitle = Base.Title;
export const DialogDescription = Base.Description;

export function DialogContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Base.Portal>
      <Base.Backdrop
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        style={{ animation: "fade-in 160ms ease-out both" }}
      />
      <Base.Viewport className="fixed inset-0 flex items-center justify-center p-6">
        <Base.Popup
          className={`bui-overlay w-full max-w-sm rounded-window border border-line bg-surface p-5 text-ink shadow-overlay ${className}`}
          style={{ animation: "pop-in 180ms var(--ease-out-strong) both" }}
        >
          {children}
        </Base.Popup>
      </Base.Viewport>
    </Base.Portal>
  );
}
