"use client";

import { Drawer as Base } from "@base-ui/react/drawer";
import type { ReactNode } from "react";

/* Drawer — bottom sheet on Base UI, swipe-to-dismiss included. */

export const Drawer = Base.Root;
export const DrawerTrigger = Base.Trigger;
export const DrawerClose = Base.Close;
export const DrawerTitle = Base.Title;
export const DrawerDescription = Base.Description;

export function DrawerContent({
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
      <Base.Viewport className="fixed inset-0 flex items-end justify-center">
        <Base.Popup
          className={`bui-overlay w-full max-w-lg rounded-t-window border border-line bg-surface p-5 pb-8 text-ink shadow-overlay ${className}`}
        >
          <span className="mx-auto mb-4 block h-1 w-9 rounded-full bg-line-strong" aria-hidden />
          {children}
        </Base.Popup>
      </Base.Viewport>
    </Base.Portal>
  );
}
