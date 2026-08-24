import { NextResponse } from "next/server";
import { listPickerModels } from "@/lib/server/pi-models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ models: listPickerModels() });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message, models: [] }, { status: 500 });
  }
}
