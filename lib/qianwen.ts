export type DevicePlatform = "ios" | "android" | "harmony" | "unknown";

export const QIANWEN_DEEP_LINK =
  "https://u.qianwen.com/?qk_biz=ai_qwen&qk_module=home&entry=life_assistant";
export const QIANWEN_HARMONY_DEEP_LINK = "tongyi://page/h5";
export const QIANWEN_OPEN_FALLBACK_DELAY_MS = 1800;

export const QIANWEN_DOWNLOAD_URLS: Record<Exclude<DevicePlatform, "harmony">, string> = {
  ios: "https://apps.apple.com/cn/app/%E9%80%9A%E4%B9%89-%E4%BD%A0%E7%9A%84%E8%B6%85%E7%BA%A7ai%E5%8A%A9%E6%89%8B/id6466733523?platform=iphone",
  android:
    "https://appdownload.alicdn.com/publish/tongyi_android/latest/tongyi_android_36396434394984.apk",
  unknown:
    "https://m.tongyi.com/app/tongyi/tongyi-hybrid/download-guide?app_url=tongyi%3A%2F%2F%3Fsid%3Dundefined%26source_type%3Dscheme",
};

export function getDevicePlatform(userAgent: string, platformOverride?: string | null): DevicePlatform {
  if (platformOverride?.trim().toLowerCase() === "harmony") {
    return "harmony";
  }

  const normalizedUserAgent = userAgent.toLowerCase();

  if (/harmony|openharmony|arkweb/.test(normalizedUserAgent)) {
    return "harmony";
  }

  if (/iphone|ipad|ipod/.test(normalizedUserAgent)) {
    return "ios";
  }

  if (/android/.test(normalizedUserAgent)) {
    return "android";
  }

  return "unknown";
}

export function getQianwenDeepLink(_platform: DevicePlatform, promptText?: string) {
  const prompt = promptText?.trim();
  const targetUrl = new URL(QIANWEN_DEEP_LINK);

  if (prompt) {
    const qkParams = {
      query: prompt,
      query_info: {
        direct_send: "true",
        biz_data: {
          contextScene: "qwen_banshi",
        },
      },
    };
    targetUrl.searchParams.set("qk_params", JSON.stringify(qkParams));
  }

  const appSchemeUrl = new URL(QIANWEN_HARMONY_DEEP_LINK);
  appSchemeUrl.searchParams.set("url", targetUrl.toString());
  return appSchemeUrl.toString();
}

export function getQianwenDownloadUrl(platform: DevicePlatform) {
  if (platform === "ios") {
    return QIANWEN_DOWNLOAD_URLS.ios;
  }

  if (platform === "android") {
    return QIANWEN_DOWNLOAD_URLS.android;
  }

  return QIANWEN_DOWNLOAD_URLS.unknown;
}
