"use client";

import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Separator } from "../atoms/Separator";

/* AuthCard — the sign-in panel: provider button first, credentials under
 * the rule. Centered on the page by the caller. */

export function AuthCard({
  title = "Welcome back",
  description = "Sign in to your workspace",
  provider = "GitHub",
  className = "",
}: {
  title?: string;
  description?: string;
  provider?: string;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-80 rounded-window border border-line bg-surface p-5 shadow-card ${className}`}>
      <h1 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-0.5 text-[12.5px] text-ink-3">{description}</p>

      <div className="mt-4 space-y-2.5">
        <Input type="email" placeholder="Email" aria-label="Email" />
        <Input type="password" placeholder="Password" aria-label="Password" />
        <Button variant="accent" size="sm" className="w-full">
          Sign in
        </Button>
      </div>

      <div className="my-4 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-[11px] text-ink-3">or</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="secondary" size="sm" className="w-full">
        Continue with {provider}
      </Button>

      <p className="mt-4 text-center text-[11.5px] text-ink-3">
        No account?{" "}
        <span className="cursor-pointer font-medium text-accent-ink">Create one</span>
      </p>
    </div>
  );
}
