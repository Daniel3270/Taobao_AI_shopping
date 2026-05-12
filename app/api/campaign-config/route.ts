import { NextRequest, NextResponse } from "next/server";
import { getCampaignConfig } from "@/lib/campaigns";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const scene = request.nextUrl.searchParams.get("scene");
  const { config, fallback, invalidScene } = getCampaignConfig(scene);

  return NextResponse.json({
    code: 0,
    data: config,
    meta: {
      fallback,
      invalidScene,
    },
  });
}
