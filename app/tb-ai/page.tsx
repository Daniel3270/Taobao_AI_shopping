"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { copyText } from "@/lib/clipboard";
import {
  type CampaignConfig,
  defaultCampaignConfig,
  getPromptTextForChannel,
  loadCampaignConfig,
} from "@/lib/campaigns";
import { getCampaignQuery } from "@/lib/query";
import { trackEvent } from "@/lib/tracking";
import { recordAplusClick, sendManualPageView } from "@/lib/umeng";

type ToastState = {
  type: "success" | "error";
  text: string;
};

function isWeChatBrowser() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /MicroMessenger/i.test(navigator.userAgent);
}

function isTaobaoBrowser() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /AliApp\(TB\//i.test(navigator.userAgent) || /\bTaobao\b/i.test(navigator.userAgent);
}

function TaobaoAiCampaignPageContent({ searchParamsString }: { searchParamsString: string }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isWeChat, setIsWeChat] = useState(false);
  const [isTaobao, setIsTaobao] = useState(false);

  const campaignQuery = useMemo(() => {
    return getCampaignQuery(new URLSearchParams(searchParamsString));
  }, [searchParamsString]);

  const scene = useMemo(() => {
    return new URLSearchParams(searchParamsString).get("scene");
  }, [searchParamsString]);

  const campaignResult = useMemo(() => {
    return loadCampaignConfig(scene);
  }, [scene]);

  const config: CampaignConfig = campaignResult.data;
  const promptText = useMemo(() => {
    return getPromptTextForChannel(campaignQuery.channel, config.promptText);
  }, [campaignQuery.channel, config.promptText]);
  const fallbackMessage =
    campaignResult.meta.invalidScene || campaignResult.meta.fallback
      ? "活动信息加载异常，已使用默认配置。"
      : "";

  const baseTrackingParams = useMemo(() => {
    return {
      scene: campaignQuery.scene || config.scene,
      campaignId: campaignQuery.campaignId || config.campaignId,
      channel: campaignQuery.channel,
      storeId: campaignQuery.storeId,
      sku: campaignQuery.sku,
    };
  }, [
    campaignQuery.campaignId,
    campaignQuery.channel,
    campaignQuery.scene,
    campaignQuery.sku,
    campaignQuery.storeId,
    config.campaignId,
    config.scene,
  ]);

  const umengTrackingParams = useMemo(() => {
    return {
      scene: campaignQuery.scene || config.scene,
      campaignId: campaignQuery.campaignId || config.campaignId,
      biz_channel: campaignQuery.channel,
      storeId: campaignQuery.storeId,
      sku: campaignQuery.sku,
    };
  }, [
    campaignQuery.campaignId,
    campaignQuery.channel,
    campaignQuery.scene,
    campaignQuery.sku,
    campaignQuery.storeId,
    config.campaignId,
    config.scene,
  ]);

  const track = useCallback(
    (event: Parameters<typeof trackEvent>[0]["event"], extra?: Record<string, unknown>) => {
      trackEvent({
        ...campaignQuery,
        event,
        scene: campaignQuery.scene || config.scene,
        campaignId: campaignQuery.campaignId || config.campaignId,
        extra,
      });
    },
    [campaignQuery, config.campaignId, config.scene],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsWeChat(isWeChatBrowser());
      setIsTaobao(isTaobaoBrowser());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    trackEvent({
      ...campaignQuery,
      event: "config_load_success",
      scene: campaignQuery.scene || campaignResult.data.scene,
      campaignId: campaignQuery.campaignId || campaignResult.data.campaignId,
      extra: campaignResult.meta,
    });

    if (campaignResult.meta.invalidScene) {
      trackEvent({
        ...campaignQuery,
        event: "invalid_scene",
        scene: campaignQuery.scene || scene || defaultCampaignConfig.scene,
        campaignId: campaignQuery.campaignId || campaignResult.data.campaignId,
      });
    }
  }, [campaignQuery, campaignResult, scene]);

  useEffect(() => {
    const browser = isWeChatBrowser() ? "wechat" : "external";

    sendManualPageView({
      ...umengTrackingParams,
      browser,
    });
    track("page_view", { browser });
  }, [track, umengTrackingParams]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const copyPrompt = useCallback(async () => {
    const success = await copyText(promptText);
    if (success) {
      setToast({ type: "success", text: "口令已复制，即将打开淘宝。" });
      return true;
    }

    setToast({ type: "error", text: "自动复制失败，请长按口令手动复制。" });
    return false;
  }, [promptText]);

  const handleCopyOnly = useCallback(async () => {
    recordAplusClick("click_copy_only", umengTrackingParams);
    track("copy_click", { mode: "copy_only" });
    const success = await copyPrompt();
    track(success ? "copy_success" : "copy_fail", { mode: "copy_only" });
  }, [copyPrompt, track, umengTrackingParams]);

  const handleCopyAndOpen = useCallback(async () => {
    recordAplusClick("click_copy_and_open", umengTrackingParams);
    track("copy_click", { mode: "copy_and_open" });
    const success = await copyPrompt();
    track(success ? "copy_success" : "copy_fail", { mode: "copy_and_open" });

    if (isTaobao) {
      return;
    }

    track("open_taobao");

    window.setTimeout(async () => {
      if (success) {
        await copyText(promptText);
      }

      window.location.href = config.targetAppUrl || config.targetUrl;

      window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          window.location.href = config.targetUrl;
        }
      }, 1400);
    }, success ? 650 : 1000);
  }, [config.targetAppUrl, config.targetUrl, copyPrompt, isTaobao, promptText, track, umengTrackingParams]);

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[430px] bg-[#dff3f6] text-brand-ink">
      <div className="relative aspect-[941/1672] w-full overflow-hidden">
        <img
          src={config.posterImage}
          alt={`${config.brandName}淘宝 AI 购物活动`}
          className="absolute inset-x-0 top-0 h-auto w-full select-none"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-[calc(env(safe-area-inset-bottom)+12px)]">
          {fallbackMessage ? (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-brand-citrus/45 bg-white/90 px-3 py-2 text-xs leading-5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
              <span>{fallbackMessage}</span>
            </div>
          ) : null}

          <section>
            <div className="grid gap-2.5">
              <button
                type="button"
                disabled={isWeChat}
                onClick={handleCopyAndOpen}
                className="cta-attention flex min-h-14 w-full items-center justify-center gap-2.5 rounded-lg border border-white/25 bg-[linear-gradient(135deg,#178248_0%,#1f9858_48%,#126b3d_100%)] px-5 text-[17px] font-bold text-white shadow-soft active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
                  <ExternalLink className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span className="leading-none">
                  {isWeChat ? "请用浏览器打开" : isTaobao ? "复制购物口令" : config.buttonText}
                </span>
              </button>
              <button
                type="button"
                disabled={isWeChat}
                onClick={handleCopyOnly}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-brand-green/25 bg-white/78 px-4 text-sm font-semibold text-brand-green shadow-[0_5px_18px_rgba(35,53,44,0.06)] backdrop-blur-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                <span>仅复制口令</span>
              </button>
            </div>
            <p className="mt-2 text-center text-xs leading-5 text-brand-ink/55">
              点击后将自动复制购物口令
            </p>
          </section>
        </div>
      </div>

      {isWeChat ? (
        <section className="fixed inset-0 z-30 mx-auto max-w-[430px] bg-white/72 text-brand-ink backdrop-blur-md">
          <svg
            className="absolute right-3 top-2 h-44 w-36 text-brand-green drop-shadow-lg"
            viewBox="0 0 144 176"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M24 158C96 128 122 76 110 18"
              stroke="currentColor"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M88 28L110 12L130 34"
              stroke="currentColor"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="absolute inset-x-5 top-56 rounded-lg bg-white/95 px-5 py-5 text-center text-brand-ink shadow-soft">
            <p className="text-2xl font-bold">点右上角</p>
            <p className="mt-2 text-lg font-semibold text-brand-green">在浏览器打开</p>
          </div>
        </section>
      ) : null}

      {toast ? (
        <div className="fixed inset-x-4 bottom-5 z-40 mx-auto flex max-w-[398px] items-center gap-2 rounded-lg bg-brand-ink px-4 py-3 text-sm font-medium text-white shadow-soft">
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-citrus" aria-hidden="true" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-brand-citrus" aria-hidden="true" />
          )}
          <span>{toast.text}</span>
        </div>
      ) : null}
    </main>
  );
}

function TaobaoAiCampaignPageWithSearchParams() {
  const searchParams = useSearchParams();
  return <TaobaoAiCampaignPageContent searchParamsString={searchParams.toString()} />;
}

export default function TaobaoAiCampaignPage() {
  return (
    <Suspense fallback={<TaobaoAiCampaignPageContent searchParamsString="" />}>
      <TaobaoAiCampaignPageWithSearchParams />
    </Suspense>
  );
}
