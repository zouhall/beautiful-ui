"use client";

import { Slider as Base } from "@base-ui/react/slider";

/* Slider — the studio's pg-range look, accessible and draggable. */

export function Slider({
  value,
  onValueChange,
  defaultValue = 40,
  min = 0,
  max = 100,
  step = 1,
  label,
  className = "",
}: {
  value?: number;
  onValueChange?: (value: number) => void;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}) {
  return (
    <Base.Root
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onValueChange?.(v as number)}
      aria-label={label}
      className={`w-full ${className}`}
    >
      <Base.Control className="flex w-full touch-none items-center py-1.5 select-none">
        <Base.Track className="h-1 w-full rounded-full bg-line">
          <Base.Indicator className="rounded-full bg-accent" />
          <Base.Thumb className="size-3.5 rounded-full border-2 border-surface bg-accent shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform hover:scale-115" />
        </Base.Track>
      </Base.Control>
    </Base.Root>
  );
}
