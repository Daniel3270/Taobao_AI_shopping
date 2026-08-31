import { createServer } from "node:http";
import { createHash, randomUUID } from "node:crypto";
import { appendFile, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const host = process.env.QIANWEN_DIRECT_HOST || "0.0.0.0";
const port = Number.parseInt(process.env.QIANWEN_DIRECT_PORT || "3010", 10);

const qianwenBaseUrl =
  "https://u.qianwen.com/?qk_biz=ai_qwen&qk_module=home&entry=life_assistant";
const shangouAiChatUrl =
  "https://tb.ele.me/app/eleme/next-chat/chat?wh_weex=true&weex_mode=dom&weex_cache_disabled=true&wx_use_layoutng=true&use_pkg=false&tms_force=true&_wx_statusbar_hidden=true&wx_navbar_hidden=true";
const shangouOfficialDownloadUrl =
  "https://links.ele.me/stage/alsc-growth-download.html?fastmode=1&url=eleme%3A%2F%2Fhome";
const shangouIosStoreUrl = "https://apps.apple.com/cn/app/e-le-me/id507161324";
const defaultPromptConfigPath = resolve(
  process.env.QIANWEN_DIRECT_PROMPTS || "config/qianwen-direct-prompts.json",
);
const defaultEventLogPath = resolve(
  process.env.QIANWEN_DIRECT_LOG_PATH || "logs/qianwen-direct-events.jsonl",
);
const ipHashSalt = process.env.QIANWEN_DIRECT_IP_HASH_SALT || "qianwen-direct-local-experiment";

export function loadChannelConfigs(configPath = defaultPromptConfigPath) {
  const configs = JSON.parse(readFileSync(configPath, "utf8"));

  if (!configs || typeof configs !== "object" || Array.isArray(configs)) {
    throw new Error("千问渠道配置格式无效");
  }

  return configs;
}

export function isWeChatUserAgent(userAgent = "") {
  return /MicroMessenger/i.test(userAgent);
}

export function isAlipayUserAgent(userAgent = "") {
  return /AlipayClient/i.test(userAgent);
}

function getBrowser(userAgent = "") {
  if (isWeChatUserAgent(userAgent)) return "wechat";
  if (isAlipayUserAgent(userAgent)) return "alipay";
  return "external";
}

function getPlatform(userAgent = "") {
  if (/OpenHarmony|HarmonyOS|ArkWeb/i.test(userAgent)) return "harmony";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "unknown";
}

function getClientIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0];
  return forwardedIp?.trim() || request.headers["x-real-ip"] || request.socket.remoteAddress || "";
}

function hashIp(ip) {
  return createHash("sha256").update(`${ipHashSalt}:${ip}`).digest("hex");
}

function writeEvent(eventLogPath, request, details) {
  const userAgent = request.headers["user-agent"] || "";
  const event = {
    requestId: randomUUID(),
    timestamp: new Date().toISOString(),
    ...details,
    browser: getBrowser(userAgent),
    platform: getPlatform(userAgent),
    ipHash: hashIp(getClientIp(request)),
    userAgent,
    referer: request.headers.referer || "",
  };

  appendFile(eventLogPath, `${JSON.stringify(event)}\n`, (error) => {
    if (error) console.error("Failed to write qianwen direct event", error);
  });
}

export function getShangouPromptText(promptText) {
  return promptText
    .replace(/^帮我用淘宝闪购在/, "帮我在")
    .replace(/^帮我在淘宝闪购买/, "帮我买")
    .replace(/^用闪购帮我在/, "帮我在")
    .replace(/^帮我用闪购在/, "帮我在")
    .replaceAll("淘宝闪购", "")
    .trim();
}

export function buildShangouDirectUrl(promptText) {
  const chatUrl = new URL(shangouAiChatUrl);
  chatUrl.searchParams.set("voiceQuery", getShangouPromptText(promptText));

  const params = new URLSearchParams({
    action: "ali.open.nav",
    module: "h5",
    packageName: "me.ele",
    fastmode: "1",
    url: chatUrl.toString(),
  });

  return `eleme://web?${params.toString()}`;
}

export function getShangouStoreUrl(platform, userAgent = "") {
  if (platform === "ios") return shangouIosStoreUrl;
  if (platform === "harmony" || /HUAWEI|HONOR/i.test(userAgent)) {
    return "appmarket://details?id=me.ele";
  }
  if (/Xiaomi|Redmi|MI\s/i.test(userAgent)) return "mimarket://details?id=me.ele";
  if (/OPPO|OnePlus|realme/i.test(userAgent)) {
    return "oppomarket://details?packagename=me.ele";
  }
  if (/vivo|iQOO/i.test(userAgent)) return "vivomarket://details?id=me.ele";
  if (/Samsung/i.test(userAgent)) return "samsungapps://ProductDetail/me.ele";
  return "market://details?id=me.ele";
}

export function renderShangouLauncher({ channel, channelName, deepLink, platform, userAgent, visitId }) {
  const safeChannelName = String(channelName).replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  const storeUrl = getShangouStoreUrl(platform, userAgent);

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <meta name="theme-color" content="#f7faf8" />
    <title>打开淘宝闪购</title>
    <style>
      * { box-sizing: border-box; }
      html, body { min-height: 100%; margin: 0; }
      body {
        display: grid;
        min-height: 100vh;
        place-items: center;
        padding: 28px;
        background: #f7faf8;
        color: #17231d;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      }
      main { width: min(100%, 360px); text-align: center; }
      [hidden] { display: none !important; }
      .spinner {
        width: 36px;
        height: 36px;
        margin: 0 auto 18px;
        border: 3px solid #d8e9df;
        border-top-color: #159552;
        border-radius: 50%;
        animation: spin .8s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      h1 { margin: 0; font-size: 22px; line-height: 1.4; }
      p { margin: 10px 0 0; color: #68756e; font-size: 14px; line-height: 1.7; }
      .actions { display: grid; gap: 10px; margin-top: 24px; }
      .button {
        display: flex;
        min-height: 50px;
        align-items: center;
        justify-content: center;
        border: 1px solid #159552;
        border-radius: 8px;
        color: #117d46;
        font-size: 16px;
        font-weight: 700;
        text-decoration: none;
      }
      .button.primary { background: #159552; color: #fff; }
      .channel { margin-top: 20px; color: #939c97; font-size: 12px; }
      @media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }
    </style>
  </head>
  <body>
    <main>
      <section id="opening">
        <div class="spinner" aria-hidden="true"></div>
        <h1>正在打开淘宝闪购</h1>
        <p>请稍候</p>
      </section>
      <section id="fallback" hidden>
        <h1>暂未成功打开淘宝闪购</h1>
        <p>可能尚未安装应用。正在尝试打开手机应用商店，也可以选择官方下载。</p>
        <div class="actions">
          <a class="button primary" href=${JSON.stringify(storeUrl)}>前往应用商店</a>
          <a class="button" href=${JSON.stringify(shangouOfficialDownloadUrl)}>官方下载</a>
          <a class="button" href=${JSON.stringify(deepLink)}>重新打开淘宝闪购</a>
        </div>
        <p class="channel">${safeChannelName}</p>
      </section>
    </main>
    <script>
      (function () {
        var deepLink = ${JSON.stringify(deepLink)};
        var storeUrl = ${JSON.stringify(storeUrl)};
        var visitId = ${JSON.stringify(visitId)};
        var completed = false;
        var fallbackStarted = false;
        var fallbackTimer;

        function track(event) {
          var body = JSON.stringify({ event: event, target: "shangou", channel: ${JSON.stringify(channel)}, visitId: visitId });
          if (navigator.sendBeacon) {
            navigator.sendBeacon("/direct-event", new Blob([body], { type: "application/json" }));
          } else {
            fetch("/direct-event", { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true }).catch(function () {});
          }
        }

        function markOpened() {
          if (completed || fallbackStarted) return;
          completed = true;
          clearTimeout(fallbackTimer);
          track("shangou_app_opened_inferred");
        }

        document.addEventListener("visibilitychange", function () {
          if (document.hidden) markOpened();
        });
        window.addEventListener("pagehide", markOpened);

        fallbackTimer = setTimeout(function () {
          if (completed || document.hidden) return;
          fallbackStarted = true;
          document.getElementById("opening").hidden = true;
          document.getElementById("fallback").hidden = false;
          track("shangou_download_fallback");
          setTimeout(function () { window.location.href = storeUrl; }, 300);
        }, 1800);

        setTimeout(function () { window.location.href = deepLink; }, 60);
      })();
    </script>
  </body>
</html>`;
}

export function renderBrowserGuide(channelName, appName = "千问", browserName = "微信") {
  const safeChannelName = String(channelName).replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  const safeAppName = String(appName).replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  const safeBrowserName = String(browserName).replaceAll("&", "&amp;").replaceAll("<", "&lt;");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <meta name="theme-color" content="#f7faf8" />
    <title>请在浏览器打开</title>
    <style>
      * { box-sizing: border-box; }
      html, body { min-height: 100%; margin: 0; }
      body {
        background: #f7faf8;
        color: #17231d;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      }
      main { min-height: 100vh; padding: 176px 24px 40px; position: relative; }
      .arrow { position: absolute; right: 22px; top: 18px; width: 116px; height: 142px; color: #159552; }
      .panel {
        max-width: 360px;
        margin: 0 auto;
        padding: 28px 24px;
        border: 1px solid rgba(21, 149, 82, .16);
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 16px 42px rgba(24, 65, 43, .10);
        text-align: center;
      }
      h1 { margin: 0; font-size: 24px; line-height: 1.35; }
      .action { margin: 10px 0 0; color: #118849; font-size: 18px; font-weight: 700; }
      .hint { margin: 18px 0 0; color: #66736c; font-size: 14px; line-height: 1.8; }
      .channel { margin: 18px 0 0; color: #8a948f; font-size: 12px; }
    </style>
  </head>
  <body>
    <main>
      <svg class="arrow" viewBox="0 0 116 142" fill="none" aria-hidden="true">
        <path d="M12 130C72 108 94 65 88 18" stroke="currentColor" stroke-width="8" stroke-linecap="round" />
        <path d="M68 29L89 11L107 32" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <section class="panel">
        <h1>点击右上角 ···</h1>
        <p class="action">选择“在浏览器打开”</p>
        <p class="hint">${safeBrowserName}内无法直接打开${safeAppName}。使用系统浏览器继续后，将自动唤起${safeAppName}并发送购物需求。</p>
        <p class="channel">${safeChannelName}</p>
      </section>
    </main>
  </body>
</html>`;
}

export function buildQianwenDirectUrl(promptText) {
  const targetUrl = new URL(qianwenBaseUrl);
  targetUrl.searchParams.set(
    "qk_params",
    JSON.stringify({
      query: promptText,
      query_info: {
        direct_send: "true",
        biz_data: {
          contextScene: "qwen_banshi",
        },
      },
    }),
  );

  const appSchemeUrl = new URL("tongyi://page/h5");
  appSchemeUrl.searchParams.set("url", targetUrl.toString());
  return appSchemeUrl.toString();
}

export function createQianwenDirectServer({
  promptConfigPath = defaultPromptConfigPath,
  eventLogPath = defaultEventLogPath,
} = {}) {
  mkdirSync(dirname(eventLogPath), { recursive: true });

  return createServer((request, response) => {
    const requestUrl = new URL(request.url || "/", "http://localhost");

    if (request.method === "POST" && requestUrl.pathname === "/direct-event") {
      let body = "";
      request.on("data", (chunk) => {
        if (body.length < 4096) body += chunk;
      });
      request.on("end", () => {
        try {
          const payload = JSON.parse(body || "{}");
          const allowedEvents = new Set([
            "shangou_app_opened_inferred",
            "shangou_download_fallback",
          ]);
          if (allowedEvents.has(payload.event)) {
            writeEvent(eventLogPath, request, {
              event: payload.event,
              channel: payload.channel,
              target: payload.target,
              visitId: payload.visitId,
            });
          }
        } catch {
          // Client telemetry must never block the redirect experience.
        }
        response.writeHead(204, { "Cache-Control": "no-store" });
        response.end();
      });
      return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/health") {
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }

    const match = requestUrl.pathname.match(/^\/(qianwen|shangou)-direct\/([a-z0-9-]+)\/?$/);
    const target = match?.[1];
    const channel = match?.[2];
    let channelConfig;

    try {
      channelConfig = channel ? loadChannelConfigs(promptConfigPath)[channel] : undefined;
    } catch (error) {
      console.error("Failed to load qianwen direct prompts", error);
      response.writeHead(500, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(JSON.stringify({ error: "config_error" }));
      return;
    }

    if (request.method !== "GET" || !channelConfig?.promptText) {
      response.writeHead(404, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(JSON.stringify({ error: "not_found" }));
      return;
    }

    const userAgent = request.headers["user-agent"] || "";
    const browser = getBrowser(userAgent);
    if (browser === "wechat") {
      writeEvent(eventLogPath, request, {
        event: `${target}_${browser}_guide`,
        channel,
        target,
      });
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      });
      response.end(
        renderBrowserGuide(
          channelConfig.name || channel,
          target === "shangou" ? "淘宝闪购" : "千问",
          "微信",
        ),
      );
      return;
    }

    const targetUrl =
      target === "shangou"
        ? buildShangouDirectUrl(channelConfig.promptText)
        : buildQianwenDirectUrl(channelConfig.promptText);

    if (target === "shangou") {
      const visitId = randomUUID();
      writeEvent(eventLogPath, request, {
        event: "shangou_launch_page",
        channel,
        target,
        visitId,
      });
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      });
      response.end(
        renderShangouLauncher({
          channel,
          channelName: channelConfig.name || channel,
          deepLink: targetUrl,
          platform: getPlatform(userAgent),
          userAgent,
          visitId,
        }),
      );
      return;
    }

    writeEvent(eventLogPath, request, { event: `${target}_redirect`, channel, target });
    response.writeHead(302, {
      Location: targetUrl,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    });
    response.end();
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createQianwenDirectServer().listen(port, host, () => {
    console.log(`AI shopping direct redirect experiment: http://${host}:${port}`);
  });
}
