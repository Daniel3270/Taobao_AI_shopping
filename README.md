# 金豆芽 × 淘宝 AI 购物中转页

这是一个移动端优先的 H5 活动页，用于承接二维码扫码流量。用户进入金豆芽官方活动页后，可以一键复制购物提示词，并跳转到淘宝 AI 购物页面。

## 本地启动

```bash
npm install
npm run dev
```

浏览器打开：

```text
http://localhost:3000/tb-ai?scene=juice01&channel=poster&campaignId=tb-ai-2026
```

## 图片资源

当前移动端页面以 4:5 海报作为主视觉背景：

- 页面背景海报：`public/assets/jindouya-poster-4x5.png`

Logo、16:9 Hero 和产品组合图仍保留在配置里，后续如果需要做更多模块可以继续使用。当前页面只展示海报背景和底部操作区。也可以修改 [lib/campaigns.ts](./lib/campaigns.ts) 里的 `posterImage` 指向其他 CDN 地址。

## 主要功能

- 活动页路径：`/tb-ai`
- 配置接口：`GET /api/campaign-config?scene=juice01`
- 埋点接口：`POST /api/track`
- 支持 `scene`、`channel`、`campaignId`、`storeId`、`sku` URL 参数
- 点击“复制口令并打开淘宝”后，先复制提示词，再跳转到配置中的淘宝链接
- 复制失败时显示手动复制提示，并继续允许跳转
- 配置加载失败或 `scene` 无效时使用默认兜底配置
- 微信内置浏览器会弹出“请用浏览器打开”指引，避免微信内无法跳转淘宝 App 的问题

## 修改默认 promptText

编辑 [lib/campaigns.ts](./lib/campaigns.ts)，修改 `defaultCampaignConfig.promptText`：

```ts
promptText: "帮我买一提金豆芽金银花柚子汁",
```

## 修改 targetUrl

编辑 [lib/campaigns.ts](./lib/campaigns.ts)，修改对应活动配置里的 `targetUrl`：

```ts
targetUrl: "https://pages-fast.m.taobao.com/wow/z/app/taowise/aiassistant/home?assistantOpenFrom=wb",
```

前端页面会通过 `/api/campaign-config` 获取该地址，二维码无需直接指向淘宝链接。

## 替换 Hero 图

编辑 [lib/campaigns.ts](./lib/campaigns.ts)，给对应配置填入 `heroImage`：

```ts
heroImage: "https://cdn.example.com/jindouya/hero-juice01.jpg",
```

如果 `heroImage` 对应图片加载失败，页面会显示内置活动主视觉占位。

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
    logoImage: "/assets/jindouya-logo.png",
    heroImage: "/assets/jindouya-hero-16x9.png",
    productImage: "/assets/jindouya-products.png",
    posterImage: "/assets/jindouya-poster-4x5.png",
  },
};
```

访问：

```text
http://localhost:3000/tb-ai?scene=juice02
```

## 埋点事件

当前支持以下事件：

- `page_view`
- `config_load_success`
- `config_load_fail`
- `invalid_scene`
- `copy_click`
- `copy_success`
- `copy_fail`
- `open_taobao`

开发环境中，埋点记录会输出到服务端控制台。后续接入数据库、日志平台或第三方分析服务时，可替换 [app/api/track/route.ts](./app/api/track/route.ts) 中的存储逻辑。
