import type { Metadata } from "next";
import IceCreamHarness from "@/components/site/IceCreamHarness";

export const metadata: Metadata = {
  title: "Pi — Beautiful UI",
  description: "Talk to Pi through Beautiful UI. Pick a real model, send a prompt, watch the turn stream.",
};

export default function HarnessPage() {
  return <IceCreamHarness />;
}
