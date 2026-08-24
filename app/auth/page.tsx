import type { Metadata } from "next";
import { AuthCard } from "@/components/blocks/AuthCard";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = {
  title: "Sign in — Beautiful UI template",
  description: "Auth page template: the AuthCard centered on the canvas.",
};

export default function AuthPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center bg-canvas p-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <AuthCard />
    </main>
  );
}
