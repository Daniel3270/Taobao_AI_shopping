export type CampaignConfig = {
  scene: string;
  campaignId: string;
  brandName: string;
  pageTitle: string;
  subTitle: string;
  logoImage: string;
  heroImage: string;
  productImage: string;
  posterImage: string;
  promptText: string;
  targetUrl: string;
  targetAppUrl: string;
  buttonText: string;
  manualCopyTip: string;
  enabled: boolean;
};

export type CampaignConfigResponse = {
  code: number;
  data: CampaignConfig;
  meta: {
    fallback: boolean;
    invalidScene: boolean;
  };
};

export const DEFAULT_SCENE = "juice01";

export const defaultCampaignConfig: CampaignConfig = {
  scene: "juice01",
  campaignId: "tb-ai-juice-2026",
  brandName: "金豆芽",
  pageTitle: "金豆芽官方活动",
  subTitle: "复制购物口令，直达淘宝 AI 购物",
  logoImage: "/assets/jindouya-logo.webp",
  heroImage: "/assets/jindouya-hero-16x9.webp",
  productImage: "/assets/jindouya-products.webp",
  posterImage: "/assets/jindouya-poster-4x5.webp",
  promptText: "帮我在淘宝闪购买一提金豆芽金银花柚子汁",
  targetUrl:
    "https://pages-fast.m.taobao.com/wow/z/app/taowise/aiassistant/home?assistantOpenFrom=wb",
  targetAppUrl:
    "taobao://m.taobao.com/tbopen/index.html?h5Url=https%3A%2F%2Fpages-fast.m.taobao.com%2Fwow%2Fz%2Fapp%2Ftaowise%2Faiassistant%2Fhome%3FassistantOpenFrom%3Dwb",
  buttonText: "复制口令并打开淘宝",
  manualCopyTip: "如果没有自动复制，请长按上方提示词手动复制后再到淘宝粘贴。",
  enabled: true,
};

const campaignConfigs: Record<string, CampaignConfig> = {
  juice01: defaultCampaignConfig,
};

export function getCampaignConfig(scene?: string | null) {
  const normalizedScene = scene?.trim() || DEFAULT_SCENE;
  const config = campaignConfigs[normalizedScene];

  if (!config || !config.enabled) {
    return {
      config: defaultCampaignConfig,
      fallback: true,
      invalidScene: Boolean(scene && scene !== DEFAULT_SCENE),
    };
  }

  return {
    config,
    fallback: false,
    invalidScene: false,
  };
}

export function loadCampaignConfig(scene?: string | null): CampaignConfigResponse {
  const { config, fallback, invalidScene } = getCampaignConfig(scene);

  return {
    code: 0,
    data: config,
    meta: {
      fallback,
      invalidScene,
    },
  };
}
