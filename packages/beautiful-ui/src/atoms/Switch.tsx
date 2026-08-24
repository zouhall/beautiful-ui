"use client";

import { useState } from "react";

/* Controlled when `checked` is passed, self-managed with `defaultChecked`. */
export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (v: boolean) => void;
  label?: string;
}) {
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked ?? internal;

  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => {
        if (checked === undefined) setInternal(!on);
        onChange?.(!on);
      }}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200
        ${on ? "bg-ink" : "bg-line-strong"}`}
    >
      <span
        className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white
          shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200"
        style={{
          transform: on ? "translateX(16px)" : "translateX(0)",
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />
    </button>
  );
}
