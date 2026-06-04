import { afterEach, describe, expect, it } from "vitest";
import { getCampaignConfig, getPromptTextForChannel, loadCampaignConfig } from "../lib/campaigns";
import { getCampaignQuery } from "../lib/query";
import { getTrackingEndpoint } from "../lib/tracking";

const originalTrackingEndpoint = process.env.NEXT_PUBLIC_TRACKING_ENDPOINT;

afterEach(() => {
  if (originalTrackingEndpoint === undefined) {
    delete process.env.NEXT_PUBLIC_TRACKING_ENDPOINT;
    return;
  }

  process.env.NEXT_PUBLIC_TRACKING_ENDPOINT = originalTrackingEndpoint;
});

describe("getTrackingEndpoint", () => {
  it("returns null when no endpoint is configured", () => {
    delete process.env.NEXT_PUBLIC_TRACKING_ENDPOINT;

    expect(getTrackingEndpoint()).toBeNull();
  });

  it("returns the trimmed configured endpoint", () => {
    process.env.NEXT_PUBLIC_TRACKING_ENDPOINT = " https://example.com/track ";

    expect(getTrackingEndpoint()).toBe("https://example.com/track");
  });
});

describe("getCampaignConfig", () => {
  it("falls back to the default campaign for unknown scenes", () => {
    expect(getCampaignConfig("unknown-scene")).toMatchObject({
      fallback: true,
      invalidScene: true,
    });
  });

  it("returns a static payload for page consumption", () => {
    expect(loadCampaignConfig("unknown-scene")).toMatchObject({
      code: 0,
      data: {
        scene: "juice01",
      },
      meta: {
        fallback: true,
        invalidScene: true,
      },
    });
  });
});

describe("getPromptTextForChannel", () => {
  const defaultPromptText = "帮我在淘宝闪购买一提金豆芽金银花柚子汁";

  it("uses the kidswant prompt for child-and-baby channel placements", () => {
    expect(getPromptTextForChannel("kidswant", defaultPromptText)).toBe(
      "用闪购帮我在孩子王购买金豆芽金银花柚子汁礼盒装100ml",
    );
  });

  it("uses the jiadefu prompt for Jiadefu placements", () => {
    expect(getPromptTextForChannel("jiadefu", defaultPromptText)).toBe(
      "用闪购帮我在家得福购买【不怕上火】金豆芽金银花柚子汁100ml",
    );
  });

  it("keeps the default prompt for supermarket placements", () => {
    expect(getPromptTextForChannel("supermarket", defaultPromptText)).toBe(defaultPromptText);
  });

  it("uses the metro prompt for Metro placements", () => {
    expect(getPromptTextForChannel("metro", defaultPromptText)).toBe(
      "用闪购帮我在麦德龙购买金豆芽金银花柚子汁",
    );
  });
});

describe("getCampaignQuery", () => {
  it("normalizes channel for stable tracking buckets", () => {
    const query = getCampaignQuery(new URLSearchParams("channel= KidsWant "));
    expect(query.channel).toBe("kidswant");
  });

  it("trims tracked query values", () => {
    const query = getCampaignQuery(
      new URLSearchParams("scene= juice01 &campaignId= tb-ai-juice-2026 &storeId= 001 "),
    );
    expect(query).toMatchObject({
      scene: "juice01",
      campaignId: "tb-ai-juice-2026",
      storeId: "001",
    });
  });
});
