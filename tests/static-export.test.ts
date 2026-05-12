import { afterEach, describe, expect, it } from "vitest";
import { getCampaignConfig, loadCampaignConfig } from "../lib/campaigns";
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
