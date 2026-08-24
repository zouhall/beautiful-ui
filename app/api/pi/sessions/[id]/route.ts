import { NextResponse } from "next/server";
import { hub } from "@/lib/server/pi-hub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const after = Number(new URL(req.url).searchParams.get("after") || 0);
  const data = hub.poll(id, after);
  if (!data) return NextResponse.json({ error: "no-session" }, { status: 404 });
  return NextResponse.json(data);
}
