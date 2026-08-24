"use client";

import { Checkbox as Base } from "@base-ui/react/checkbox";

/* Checkbox — matches the records-table checkbox: hairline box, accent fill. */

export function Checkbox({
  checked,
  onCheckedChange,
  defaultChecked,
  label,
  className = "",
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <Base.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(c) => onCheckedChange?.(c === true)}
      aria-label={label}
      className={`flex size-[18px] items-center justify-center rounded-[6px] border border-line-strong bg-surface text-transparent transition-all data-[checked]:border-accent data-[checked]:bg-accent data-[checked]:text-white ${className}`}
    >
      <Base.Indicator>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m4 12 5 5L20 6" />
        </svg>
      </Base.Indicator>
    </Base.Root>
  );
}
