import { describe, expect, it } from "vitest";
import {
  UMENG_APP_KEY,
  UMENG_SDK_ID,
  createAplusInitCommands,
  getAplusScriptUrl,
  recordAplusClick,
  sendManualPageView,
} from "../lib/umeng";

describe("友盟初始化配置", () => {
  it("包含 appKey 和手动 PV 配置", () => {
    expect(createAplusInitCommands()).toEqual([
      {
        action: "aplus.setMetaInfo",
        arguments: ["appKey", UMENG_APP_KEY],
      },
      {
        action: "aplus.setMetaInfo",
        arguments: ["aplus-waiting", "MAN"],
      },
    ]);
  });

  it("返回正确的 SDK 地址", () => {
    expect(getAplusScriptUrl()).toBe(`https://d.alicdn.com/alilog/mlog/aplus/${UMENG_SDK_ID}.js`);
  });
});

describe("友盟事件上报", () => {
  it("发送手动 PV", () => {
    const queue: Array<{ action: string; arguments: unknown[] }> = [];

    sendManualPageView({ scene: "juice01", campaignId: "tb-ai-juice-2026" }, queue);

    expect(queue).toEqual([
      {
        action: "aplus.sendPV",
        arguments: [
          {
            is_auto: false,
          },
          {
            scene: "juice01",
            campaignId: "tb-ai-juice-2026",
          },
        ],
      },
    ]);
  });

  it("发送复制打开淘宝点击事件", () => {
    const queue: Array<{ action: string; arguments: unknown[] }> = [];

    recordAplusClick("click_copy_and_open", { scene: "juice01" }, queue);

    expect(queue).toEqual([
      {
        action: "aplus.record",
        arguments: ["click_copy_and_open", "CLK", { scene: "juice01" }],
      },
    ]);
  });

  it("发送仅复制口令点击事件", () => {
    const queue: Array<{ action: string; arguments: unknown[] }> = [];

    recordAplusClick("click_copy_only", { scene: "juice01" }, queue);

    expect(queue).toEqual([
      {
        action: "aplus.record",
        arguments: ["click_copy_only", "CLK", { scene: "juice01" }],
      },
    ]);
  });
});
