import type { DevicePlatform } from "./qianwen";

export const SHANGOU_AI_CHAT_URL =
  "https://tb.ele.me/app/eleme/next-chat/chat?wh_weex=true&weex_mode=dom&weex_cache_disabled=true&wx_use_layoutng=true&use_pkg=false&tms_force=true&_wx_statusbar_hidden=true&wx_navbar_hidden=true";
export const SHANGOU_HOME_DEEP_LINK = "eleme://home";
export const SHANGOU_OPEN_FALLBACK_DELAY_MS = 1800;

export const SHANGOU_DOWNLOAD_URLS: Record<Exclude<DevicePlatform, "harmony">, string> = {
  ios: "https://apps.apple.com/cn/app/e-le-me/id507161324",
  android:
    "https://appdownload.alicdn.com/publish/eleme_android/latest/eleme_android_1601275026119.apk",
  unknown: `https://links.ele.me/stage/alsc-growth-download.html?fastmode=1&url=${encodeURIComponent(
    SHANGOU_HOME_DEEP_LINK,
  )}`,
};

export function getShangouPromptText(promptText: string) {
  return promptText
    .replace(/^帮我用淘宝闪购在/, "帮我在")
    .replace(/^帮我在淘宝闪购买/, "帮我买")
    .replace(/^用闪购帮我在/, "帮我在")
    .replace(/^帮我用闪购在/, "帮我在")
    .replaceAll("淘宝闪购", "")
    .trim();
}

export function getShangouAiChatUrl(promptText: string) {
  const url = new URL(SHANGOU_AI_CHAT_URL);
  url.searchParams.set("voiceQuery", promptText);
  return url.toString();
}

export function getShangouDeepLink(promptText: string) {
  const params = new URLSearchParams({
    action: "ali.open.nav",
    module: "h5",
    packageName: "me.ele",
    fastmode: "1",
    url: getShangouAiChatUrl(promptText),
  });

  return `eleme://web?${params.toString()}`;
}

export function getShangouDownloadUrl(platform: DevicePlatform) {
  if (platform === "ios") {
    return SHANGOU_DOWNLOAD_URLS.ios;
  }

  if (platform === "android") {
    return SHANGOU_DOWNLOAD_URLS.android;
  }

  return SHANGOU_DOWNLOAD_URLS.unknown;
}
