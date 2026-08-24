"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseGroup } from "@base-ui/react/radio-group";
import type { ReactNode } from "react";

/* Radio group — accent dot on a hairline ring. */

export function RadioGroup({
  value,
  onValueChange,
  defaultValue,
  children,
  className = "",
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <BaseGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onValueChange?.(v as string)}
      className={`flex flex-col gap-2 ${className}`}
    >
      {children}
    </BaseGroup>
  );
}

export function RadioItem({
  value,
  label,
  className = "",
}: {
  value: string;
  label?: ReactNode;
  className?: string;
}) {
  const circle = (
    <Radio.Root
      value={value}
      aria-label={typeof label === "string" ? label : undefined}
      className={`flex size-[16px] shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface transition-colors data-[checked]:border-accent ${className}`}
    >
      <Radio.Indicator className="flex size-[8px] rounded-full bg-accent" />
    </Radio.Root>
  );
  if (label == null) return circle;
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-2">
      {circle}
      {label}
    </label>
  );
}
