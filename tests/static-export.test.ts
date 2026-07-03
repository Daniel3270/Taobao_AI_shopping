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
      "帮我用淘宝闪购在家得福购买一提【不怕上火】金豆芽金银花柚子汁100ml",
    );
  });

  it("uses the huangshang prompt for Huangshang supermarket placements", () => {
    expect(getPromptTextForChannel("huangshang", defaultPromptText)).toBe(
      "帮我在淘宝闪购买一提金豆芽金银花柚子汁",
    );
  });

  it.each([
    ["changshen", "帮我用淘宝闪购在长申超市买一提金豆芽金银花柚子汁100ml"],
    ["dazhangshengdemei", "帮我用淘宝闪购在大张盛德美买一提金豆芽金银花柚子汁100ml"],
    ["jiajiali", "帮我用淘宝闪购在家家利超市买一提金豆芽金银花柚子果汁饮料100ml"],
    ["miaoduoke", "帮我用淘宝闪购在妙多客超市买一提金豆芽金银花柚子汁100ml"],
    ["yasi", "帮我用淘宝闪购在雅斯超市买一提金豆芽金银花柚子汁复合果汁饮品100ml"],
    ["huayubaijia", "帮我用淘宝闪购在华豫佰佳超市买一提金豆芽金银花柚子汁100ml"],
    ["xingqin", "帮我用淘宝闪购在兴勤超市买一提金豆芽金银花柚子汁"],
    ["rtmart", "帮我用淘宝闪购在大润发买一提金豆芽金银花柚子汁"],
  ])("uses the %s prompt for channel placements", (channel, promptText) => {
    expect(getPromptTextForChannel(channel, defaultPromptText)).toBe(promptText);
  });

  it("uses the metro prompt for Metro placements", () => {
    expect(getPromptTextForChannel("metro", defaultPromptText)).toBe(
      "用闪购帮我在麦德龙购买金豆芽金银花柚子汁",
    );
  });

  it("uses the yingbeier prompt for Yingbeier placements", () => {
    expect(getPromptTextForChannel("yingbeier", defaultPromptText)).toBe(
      "帮我用闪购在婴贝儿（领秀城贵和店）购买金豆芽金银花柚子汁宝宝饮品礼盒",
    );
  });

  it("uses the yinzuo prompt for Yinzuo supermarket placements", () => {
    expect(getPromptTextForChannel("yinzuo", defaultPromptText)).toBe(
      "用闪购帮我在银座买金豆芽金银花苹果汁礼盒装100ml",
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
