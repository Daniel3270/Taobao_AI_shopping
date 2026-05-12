import type { CampaignQuery } from "./query";

export type TrackingEvent =
  | "page_view"
  | "copy_click"
  | "copy_success"
  | "copy_fail"
  | "open_taobao"
  | "config_load_success"
  | "config_load_fail"
  | "invalid_scene";

type TrackPayload = CampaignQuery & {
  event: TrackingEvent;
  scene?: string;
  campaignId?: string;
  extra?: Record<string, unknown>;
};

export function getTrackingEndpoint() {
  const endpoint = process.env.NEXT_PUBLIC_TRACKING_ENDPOINT?.trim();
  return endpoint || null;
}

export function trackEvent(payload: TrackPayload) {
  if (typeof window === "undefined") {
    return;
  }

  const endpoint = getTrackingEndpoint();
  if (!endpoint) {
    return;
  }

  const body = JSON.stringify({
    ...payload,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    referer: document.referrer,
    path: window.location.pathname,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(endpoint, blob);
    return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
