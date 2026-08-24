import { NextResponse } from "next/server";
import { hub } from "@/lib/server/pi-hub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ sessions: hub.list() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const session = await hub.create(body);
    return NextResponse.json({ session });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
