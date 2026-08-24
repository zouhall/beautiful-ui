import { NextResponse } from "next/server";
import { hub } from "@/lib/server/pi-hub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  try {
    const res = await hub.prompt(id, String(body.message || ""));
    return NextResponse.json({ ok: true, res });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
