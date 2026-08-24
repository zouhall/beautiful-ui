"use client";

import { Avatar as Base } from "@base-ui/react/avatar";

/* Avatar — image with initials fallback on the inset token. */

export function Avatar({
  src,
  alt,
  fallback,
  size = 28,
  className = "",
}: {
  src?: string;
  alt?: string;
  fallback: string;
  size?: number;
  className?: string;
}) {
  return (
    <Base.Root
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-inset font-medium text-ink-3 ring-1 ring-line ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(9, size * 0.38) }}
    >
      {src ? <Base.Image src={src} alt={alt ?? ""} className="size-full object-cover" /> : null}
      <Base.Fallback>{fallback}</Base.Fallback>
    </Base.Root>
  );
}
