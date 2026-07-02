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
  posterImage: "/assets/jindouya-poster-summer.webp",
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

const channelPromptTexts: Record<string, string> = {
  huangshang: "帮我在黄商超市淘宝闪购买一提金豆芽金银花柚子汁礼盒装100ml*(12袋+1袋）",
  jiadefu: "帮我用淘宝闪购在家得福购买一提【不怕上火】金豆芽金银花柚子汁100ml*13礼盒",
  jiajiali: "帮我在家家利超市淘宝闪购买一提金豆芽金银花柚子果汁饮料100ml*13",
  kidswant: "用闪购帮我在孩子王购买金豆芽金银花柚子汁礼盒装100ml",
  huayubaijia: "帮我在华豫佰佳超市淘宝闪购买一提金豆芽金银花柚子汁100ml*13袋/提",
  metro: "用闪购帮我在麦德龙购买金豆芽金银花柚子汁",
  miaoduoke: "帮我在妙多客超市淘宝闪购买一提金豆芽金银花柚子汁100ml*13礼盒",
  rtmart: "帮我在大润发淘宝闪购买一提金豆芽金银花柚子汁100ml*13袋/盒",
  xingqin: "帮我在兴勤超市淘宝闪购买一提金豆芽金银花柚子汁100ml*13袋",
  yasi: "帮我在雅斯超市淘宝闪购买一提金豆芽金银花柚子汁复合果汁饮品100ml*(12袋+1袋）/箱",
  yingbeier: "帮我用闪购在婴贝儿（领秀城贵和店）购买金豆芽金银花柚子汁宝宝饮品礼盒",
  yinzuo: "用闪购帮我在银座买金豆芽金银花苹果汁礼盒装100ml",
};

export function getPromptTextForChannel(channel: string | undefined, fallbackPromptText: string) {
  const normalizedChannel = channel?.trim().toLowerCase();

  return (normalizedChannel && channelPromptTexts[normalizedChannel]) || fallbackPromptText;
}

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
