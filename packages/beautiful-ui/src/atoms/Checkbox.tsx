"use client";

import { Checkbox as Base } from "@base-ui/react/checkbox";
import { IconCheck } from "./icons";

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
      className={`flex size-[18px] items-center justify-center rounded-chip border border-line-strong bg-surface text-transparent transition-all data-[checked]:border-accent data-[checked]:bg-accent data-[checked]:text-white ${className}`}
    >
      <Base.Indicator>
        <IconCheck size={11} strokeWidth={3.2} />
      </Base.Indicator>
    </Base.Root>
  );
}
