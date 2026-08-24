"use client";

import { Separator as Base } from "@base-ui/react/separator";

/* Separator — hairline rule, horizontal or vertical. */

export function Separator({
  orientation = "horizontal",
  className = "",
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <Base
      orientation={orientation}
      className={`bg-line ${
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch"
      } ${className}`}
    />
  );
}
