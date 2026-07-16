# 金豆芽 × 千问 AI 购物中转页

移动端优先的 H5 活动页，用于承接二维码扫码流量。用户进入活动页后，可以复制渠道购物口令并打开千问 App；未安装时会显示对应系统的下载入口。

## 本地启动

```bash
npm install
npm run dev
```

浏览器打开：

```text
http://localhost:3000/tb-ai/?scene=juice01&channel=poster&campaignId=tb-ai-2026
```

## 当前部署形态

项目已配置为纯静态导出：

```ts
output: "export"
```

因此当前版本没有内置 Next.js API Routes，可直接部署到静态托管、OSS、CDN、GitHub Pages、Nginx 静态目录等环境。

## 图片资源

当前移动端页面以 4:5 海报作为主视觉背景：

- 页面背景海报：`public/assets/jindouya-poster-summer.webp`

Logo、16:9 Hero 和产品组合图仍保留在配置里，后续如果需要做更多模块可以继续使用。也可以修改 [lib/campaigns.ts](./lib/campaigns.ts) 里的 `posterImage` 指向其他 CDN 地址。

## 主要功能

- 活动页路径：`/tb-ai/`
- 支持 `scene`、`channel`、`campaignId`、`storeId`、`sku` URL 参数
- 点击“复制口令并打开千问”后，先复制提示词，再尝试唤起千问 App
- Android/iOS 使用通用千问 Scheme，鸿蒙使用千问首页 Scheme
- 如果千问 App 未成功唤起，会显示对应系统的下载入口和重新打开按钮
- 微信内置浏览器会显示“请用浏览器打开”指引，避免微信内无法稳定跳转千问 App
- 页面隐藏提示词文本，但仍会正常复制 `promptText`
- 友盟 A+ 埋点已接入
- 如需自定义埋点接收地址，可配置 `NEXT_PUBLIC_TRACKING_ENDPOINT`

## 修改默认 promptText

编辑 [lib/campaigns.ts](./lib/campaigns.ts)，修改 `defaultCampaignConfig.promptText`：

```ts
promptText: "帮我在淘宝闪购买一提金豆芽金银花柚子汁",
```

如需按投放渠道复制专属口令，可在 `channelPromptTexts` 增加渠道配置，并在二维码链接中传入 `channel`：

```text
/tb-ai/?channel=kidswant
```

## 修改千问链接

编辑 [lib/qianwen.ts](./lib/qianwen.ts)，可修改千问 App Scheme：

```ts
QIANWEN_DEEP_LINK = "tongyi://page/h5?...";
QIANWEN_HARMONY_DEEP_LINK = "tongyi://?source_type=scheme";
```

以及 iOS、Android 和通用下载地址：

```ts
QIANWEN_DOWNLOAD_URLS
```

## 新增 scene

在 [lib/campaigns.ts](./lib/campaigns.ts) 的 `campaignConfigs` 中新增配置：

```ts
const campaignConfigs: Record<string, CampaignConfig> = {
  juice01: defaultCampaignConfig,
  juice02: {
    ...defaultCampaignConfig,
    scene: "juice02",
    campaignId: "tb-ai-juice02-2026",
    promptText: "帮我买金豆芽新品饮品",
    posterImage: "/assets/jindouya-poster-summer.webp",
  },
};
```

访问：

```text
http://localhost:3000/tb-ai/?scene=juice02
```

## 埋点

当前支持以下事件：

- `page_view`
- `config_load_success`
- `invalid_scene`
- `copy_click`
- `copy_success`
- `copy_fail`
- `open_qianwen`
- `qianwen_fallback`
- `download_qianwen`
- `retry_qianwen`

友盟相关配置在 [lib/umeng.ts](./lib/umeng.ts)。

如果设置 `NEXT_PUBLIC_TRACKING_ENDPOINT`，页面还会把事件发送到该外部地址；如果不设置，则只使用友盟埋点。

## 构建

```bash
npm run build
```

静态产物会输出到 `out/`。
