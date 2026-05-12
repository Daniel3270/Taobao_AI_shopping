import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedEvents = new Set([
  "page_view",
  "copy_click",
  "copy_success",
  "copy_fail",
  "open_taobao",
  "config_load_success",
  "config_load_fail",
  "invalid_scene",
]);

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ code: 400, message: "Invalid JSON" }, { status: 400 });
  }

  const event = String(payload.event || "");
  if (!allowedEvents.has(event)) {
    return NextResponse.json({ code: 400, message: "Invalid event" }, { status: 400 });
  }

  const record = {
    ...payload,
    receivedAt: new Date().toISOString(),
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "",
  };

  console.info("[track]", JSON.stringify(record));

  return NextResponse.json({ code: 0 });
}
