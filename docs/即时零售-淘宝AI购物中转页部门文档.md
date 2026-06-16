# 即时零售项目：金豆芽 × 淘宝 AI 购物中转页

## 1. 项目概述

本项目是面向即时零售投放场景的移动端 H5 中转页，用于承接二维码扫码流量，引导用户复制淘宝 AI 购物口令，并尝试唤起淘宝 App 的 AI 购物页面。

当前活动主体为“金豆芽 × 淘宝 AI 购物”。用户通过线下物料、渠道海报或其他投放入口扫码进入活动页后，页面会根据 URL 渠道参数匹配对应购物口令。用户点击按钮后，系统先复制口令，再优先打开淘宝 App；如果 App 唤起失败，则回退到淘宝 H5 页面。

项目已配置为纯静态导出，可部署到静态托管、OSS、CDN、Nginx 静态目录等环境。

## 2. 业务目标

- 承接即时零售投放二维码流量，降低用户从扫码到淘宝 AI 购物的跳转成本。
- 支持不同投放渠道配置不同购物口令，便于按渠道追踪和优化转化。
- 通过友盟 A+ 和可选外部埋点，记录页面访问、复制、跳转等关键行为。
- 通过静态化部署降低服务维护成本，适合活动页快速上线和迭代。

## 3. 用户链路

1. 用户扫描渠道二维码。
2. 进入 H5 活动页：`/tb-ai/`。
3. 页面读取 URL 参数，例如 `channel=kidswant`、`scene=juice01`。
4. 系统加载活动配置，并按渠道匹配购物口令。
5. 用户点击“复制口令并打开淘宝”。
6. 页面复制口令，并尝试唤起淘宝 App。
7. 如果淘宝 App 唤起失败，自动回退到淘宝 H5 链接。
8. 微信内置浏览器中会显示“请用浏览器打开”指引，避免微信环境下跳转淘宝不稳定。

## 4. 当前线上入口

正式服务域名：

```text
https://jdyqwen.zirancuishipin.com
```

活动页路径：

```text
https://jdyqwen.zirancuishipin.com/tb-ai/
```

示例链接：

```text
https://jdyqwen.zirancuishipin.com/tb-ai/?channel=supermarket
https://jdyqwen.zirancuishipin.com/tb-ai/?channel=kidswant
https://jdyqwen.zirancuishipin.com/tb-ai/?channel=jiadefu
https://jdyqwen.zirancuishipin.com/tb-ai/?channel=metro
```

## 5. 渠道口令配置

当前通过 `channel` 参数区分投放渠道。不同渠道会复制不同的淘宝 AI 购物口令。

| 渠道参数 | 渠道名称 | 复制口令 |
| --- | --- | --- |
| `supermarket` | 商超渠道 | 帮我在淘宝闪购买一提金豆芽金银花柚子汁 |
| `kidswant` | 孩子王渠道 | 用闪购帮我在孩子王购买金豆芽金银花柚子汁礼盒装100ml*13袋 |
| `jiadefu` | 家得福渠道 | 帮我在家得福买一提金豆芽金银花柚子汁 |
| `metro` | 麦德龙渠道 | 用闪购帮我在麦德龙购买金豆芽金银花柚子汁 |

渠道二维码文件存放在：

```text
QR_code/production/
QR_code/local/
```

正式二维码文件：

| 文件 | 渠道 |
| --- | --- |
| `tb-ai-supermarket-production-qr.png` | 商超渠道 |
| `tb-ai-kidswant-production-qr.png` | 孩子王渠道 |
| `tb-ai-jiadefu-production-qr.png` | 家得福渠道 |
| `tb-ai-metro-production-qr.png` | 麦德龙渠道 |

## 6. 支持的 URL 参数

| 参数 | 用途 |
| --- | --- |
| `scene` | 活动场景标识，默认 `juice01` |
| `channel` | 投放渠道标识，用于匹配口令和埋点分组 |
| `campaignId` | 活动 ID，可用于投放侧自定义活动归因 |
| `storeId` | 门店 ID，可用于门店维度追踪 |
| `sku` | 商品 SKU，可用于商品维度追踪 |

示例：

```text
/tb-ai/?scene=juice01&channel=kidswant&campaignId=tb-ai-juice-2026&storeId=001&sku=juice-100ml
```

## 7. 核心功能

### 7.1 活动配置加载

活动配置集中维护在：

```text
lib/campaigns.ts
```

主要配置项包括：

| 配置项 | 说明 |
| --- | --- |
| `scene` | 活动场景 |
| `campaignId` | 活动 ID |
| `brandName` | 品牌名称 |
| `posterImage` | 页面主视觉海报 |
| `promptText` | 默认购物口令 |
| `targetUrl` | 淘宝 H5 兜底链接 |
| `targetAppUrl` | 淘宝 App 唤起链接 |
| `buttonText` | 主按钮文案 |
| `enabled` | 活动是否启用 |

当传入未知 `scene` 时，系统会回退到默认活动配置，并上报 `invalid_scene` 事件。

### 7.2 渠道口令匹配

渠道口令通过 `channelPromptTexts` 维护。页面读取 URL 中的 `channel` 参数后，会优先使用渠道专属口令；没有匹配到渠道时，使用默认 `promptText`。

### 7.3 淘宝跳转

点击主按钮后，页面执行以下逻辑：

1. 调用浏览器剪贴板能力复制购物口令。
2. 上报复制点击和复制结果。
3. 如果当前已经在淘宝 App 内，不再重复跳转。
4. 如果不在淘宝 App 内，优先跳转 `targetAppUrl`。
5. 如果页面仍处于可见状态，说明 App 唤起可能失败，再回退到 `targetUrl`。

### 7.4 微信浏览器处理

微信内置浏览器对外部 App 跳转限制较多。页面会识别微信环境，并显示“请用浏览器打开”指引，避免用户在微信内反复点击但无法稳定打开淘宝。

## 8. 数据埋点

### 8.1 友盟 A+ 埋点

友盟相关配置位于：

```text
lib/umeng.ts
```

当前配置：

| 项 | 值 |
| --- | --- |
| `UMENG_APP_KEY` | `69fbe4d69a7f376488d5a10d` |
| `UMENG_SDK_ID` | `203467608` |

页面采用手动 PV 上报，避免自动 PV 与自定义页面参数不一致。

### 8.2 事件清单

| 事件 | 说明 |
| --- | --- |
| `page_view` | 页面访问 |
| `config_load_success` | 活动配置加载成功 |
| `invalid_scene` | 传入未知活动场景并触发默认配置回退 |
| `copy_click` | 用户点击复制相关按钮 |
| `copy_success` | 口令复制成功 |
| `copy_fail` | 口令复制失败 |
| `open_taobao` | 页面尝试打开淘宝 |

友盟点击事件：

| 事件码 | 说明 |
| --- | --- |
| `click_copy_and_open` | 点击“复制口令并打开淘宝” |
| `click_copy_only` | 点击“仅复制口令” |

### 8.3 渠道统计口径

链接参数继续使用 `channel` 区分投放渠道。上报友盟时，页面使用 `biz_channel` 作为渠道字段，避免与友盟保留字段 `channel` 冲突。

建议在友盟后台按以下字段查看：

| 字段 | 用途 |
| --- | --- |
| `scene` | 活动场景 |
| `campaignId` | 活动 ID |
| `biz_channel` | 投放渠道 |
| `storeId` | 门店 |
| `sku` | 商品 |

### 8.4 可选外部埋点

如果配置环境变量：

```text
NEXT_PUBLIC_TRACKING_ENDPOINT
```

页面会额外将事件通过 `navigator.sendBeacon` 或 `fetch keepalive` 发送到该地址。未配置时，仅使用友盟 A+ 埋点。

## 9. 技术架构

### 9.1 技术栈

| 类型 | 技术 |
| --- | --- |
| 前端框架 | Next.js 16 |
| UI 框架 | React 19 |
| 样式 | Tailwind CSS |
| 图标 | lucide-react |
| 语言 | TypeScript |
| 测试 | Vitest |
| 部署形态 | Next.js static export |

### 9.2 静态导出配置

项目配置文件：

```text
next.config.ts
```

关键配置：

```ts
output: "export"
trailingSlash: true
```

构建后产物输出到：

```text
out/
```

### 9.3 目录说明

| 路径 | 说明 |
| --- | --- |
| `app/tb-ai/page.tsx` | 活动页主页面 |
| `app/layout.tsx` | 全局布局、页面元信息、友盟初始化脚本 |
| `app/globals.css` | 全局样式和主按钮动效 |
| `lib/campaigns.ts` | 活动配置、渠道口令配置 |
| `lib/query.ts` | URL 参数解析和标准化 |
| `lib/tracking.ts` | 可选外部埋点发送 |
| `lib/umeng.ts` | 友盟 A+ 初始化、PV 和点击事件 |
| `public/assets/` | 活动图片素材 |
| `QR_code/` | 正式和本地二维码 |
| `tests/` | 单元测试 |

## 10. 本地开发

安装依赖：

```bash
npm install
```

启动本地服务：

```bash
npm run dev
```

本地访问：

```text
http://localhost:3000/tb-ai/?scene=juice01&channel=poster&campaignId=tb-ai-2026
```

本地二维码默认指向：

```text
http://192.168.5.9:3000
```

如果本机 IP 变化，需要重新生成或调整二维码链接。

## 11. 构建与发布

构建命令：

```bash
npm run build
```

构建产物：

```text
out/
```

发布方式：

1. 执行 `npm run build`。
2. 将 `out/` 目录发布到静态托管环境。
3. 确认域名可访问 `/tb-ai/`。
4. 使用正式二维码扫码验证页面、复制口令、淘宝跳转和友盟数据。

## 12. 测试与验收

### 12.1 自动化测试

运行：

```bash
npm run test
```

当前测试覆盖：

| 测试项 | 说明 |
| --- | --- |
| 活动配置回退 | 未知 `scene` 回退到默认配置 |
| 渠道口令匹配 | `kidswant`、`jiadefu`、`metro`、默认渠道 |
| URL 参数标准化 | 渠道小写、参数去空格 |
| 外部埋点地址 | 环境变量读取和去空格 |
| 友盟初始化 | appKey、手动 PV 配置 |
| 友盟事件 | PV、复制打开、仅复制 |

### 12.2 上线验收清单

| 检查项 | 验收方式 |
| --- | --- |
| 页面可访问 | 手机浏览器打开正式链接 |
| 海报展示正常 | 检查首屏图片是否完整加载 |
| 商超口令 | 扫商超二维码后复制并粘贴确认 |
| 孩子王口令 | 扫孩子王二维码后复制并粘贴确认 |
| 家得福口令 | 扫家得福二维码后复制并粘贴确认 |
| 麦德龙口令 | 扫麦德龙二维码后复制并粘贴确认 |
| 淘宝 App 唤起 | 非微信浏览器点击主按钮验证 |
| H5 兜底 | 未安装淘宝或唤起失败时验证回退链接 |
| 微信提示 | 微信内扫码确认显示浏览器打开指引 |
| 友盟 PV | 友盟后台确认访问数据 |
| 友盟点击 | 友盟后台确认按钮点击事件 |

## 13. 常见变更方式

### 13.1 修改默认口令

修改：

```text
lib/campaigns.ts
```

更新：

```ts
defaultCampaignConfig.promptText
```

### 13.2 新增渠道口令

在 `channelPromptTexts` 中增加一项：

```ts
const channelPromptTexts: Record<string, string> = {
  newchannel: "新的渠道口令",
};
```

二维码链接增加：

```text
/tb-ai/?channel=newchannel
```

### 13.3 新增活动场景

在 `campaignConfigs` 中增加新场景：

```ts
const campaignConfigs: Record<string, CampaignConfig> = {
  juice01: defaultCampaignConfig,
  juice02: {
    ...defaultCampaignConfig,
    scene: "juice02",
    campaignId: "tb-ai-juice02-2026",
    promptText: "新的活动口令",
    posterImage: "/assets/jindouya-poster-childrens-day.webp",
  },
};
```

访问：

```text
/tb-ai/?scene=juice02
```

### 13.4 更换活动海报

1. 将新图片放入 `public/assets/`。
2. 修改 `lib/campaigns.ts` 中的 `posterImage`。
3. 本地启动确认移动端展示效果。
4. 重新构建并发布。

### 13.5 修改淘宝目标页

修改：

```text
lib/campaigns.ts
```

更新：

```ts
targetUrl
targetAppUrl
```

其中 `targetAppUrl` 用于淘宝 App 唤起，`targetUrl` 用于 H5 兜底。

## 14. 风险与注意事项

- 微信内置浏览器对淘宝 App 跳转限制较多，当前策略是引导用户使用外部浏览器打开。
- 浏览器剪贴板能力受系统、浏览器和用户授权影响，可能出现复制失败，因此页面保留“仅复制口令”和失败提示。
- 当前项目是静态站点，没有服务端接口；如果后续需要动态配置活动，需要引入远程配置或服务端能力。
- 二维码与渠道口令强绑定，修改渠道口令后需要确认是否需要重新生成二维码或同步投放物料。
- 友盟后台分析时建议使用 `biz_channel` 分组，不建议直接使用 `channel` 字段。

## 15. 后续优化建议

- 增加远程活动配置能力，减少每次调整口令或海报都需要重新发版的问题。
- 增加渠道维度的转化漏斗看板，包括访问、复制成功、打开淘宝、H5 兜底等指标。
- 为二维码生成流程增加脚本化能力，减少手工维护不同渠道二维码的出错概率。
- 增加移动端真机回归记录，沉淀不同浏览器和 App 环境下的跳转表现。
- 如业务后续扩展到更多品牌，可将 `campaignConfigs` 抽象为多品牌、多活动配置。

