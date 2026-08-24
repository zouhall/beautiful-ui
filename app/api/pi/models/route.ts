import { NextResponse } from "next/server";
import { hub } from "@/lib/server/pi-hub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await hub.models();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message, models: [] }, { status: 500 });
  }
}
