import type { Metadata } from "next";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import RecordsTable from "@/components/primitives/RecordsTable";
import { CLIENT_ROWS } from "@/lib/clients";

export const metadata: Metadata = {
  title: "Clients — Records Table",
  description: "HQ client roster in the Records Table primitive.",
};

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-page text-ink">
      <header className="flex h-[64px] items-center justify-between border-b border-line px-5 sm:px-7">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[15px] font-semibold tracking-[-0.02em] text-ink">Clients</h1>
            <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[10.5px] font-medium text-accent-ink">
              {CLIENT_ROWS.length} records
            </span>
          </div>
          <p className="truncate text-[12px] text-ink-3">HQ roster · Records Table</p>
        </div>
        <ThemeToggle />
      </header>
      <section className="px-4 py-5 sm:px-6 sm:py-6">
        <RecordsTable variant="Clients" rows={CLIENT_ROWS} />
      </section>
    </main>
  );
}
