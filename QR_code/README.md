# 渠道二维码说明

二维码按购物链路分为 `taobao/`、`qianwen/` 和 `shangou/` 三套目录。三套二维码都进入同一个 `/tb-ai/` 落地页，通过 URL 参数决定最终打开淘宝、千问或淘宝闪购。

## 目录结构

```text
QR_code/
├─ taobao/
│  ├─ production/             正式服务二维码
│  ├─ local_10.10.10.27/      当前 Wi-Fi 测试二维码
│  └─ local_192.168.5.9/      旧局域网测试二维码
├─ qianwen/
│  ├─ production/             全渠道正式服务二维码
│  └─ local_10.10.10.27/      全渠道当前 Wi-Fi 测试二维码
└─ shangou/
   ├─ production/             全渠道淘宝闪购 AI 点外卖正式二维码
   └─ local_10.10.10.27/      全渠道淘宝闪购 AI 点外卖本地二维码
```

## 淘宝链路

淘宝是默认链路。二维码 URL 只需要 `channel` 参数，不添加 `target`：

```text
https://jdyqwen.zirancuishipin.com/tb-ai/?channel=huangshang
```

正式二维码位于 `taobao/production/`，当前网络测试二维码位于 `taobao/local_10.10.10.27/`。两批目录中的渠道文件名保持一致。

| 文件 | 渠道 | 复制口令 |
| --- | --- | --- |
| `tb-ai-huangshang-*-qr.png` | 黄商超市 | `帮我用淘宝闪购在黄商超市买一提金豆芽金银花柚子汁` |
| `tb-ai-changshen-*-qr.png` | 长申超市 | `帮我用淘宝闪购在长申超市买一提金豆芽金银花柚子汁100ml` |
| `tb-ai-dazhangshengdemei-*-qr.png` | 大张盛德美 | `帮我用淘宝闪购在大张盛德美买一提金豆芽金银花柚子汁100ml` |
| `tb-ai-jiadefu-*-qr.png` | 家得福 | `帮我用淘宝闪购在家得福购买一提【不怕上火】金豆芽金银花柚子汁100ml` |
| `tb-ai-jiajiali-*-qr.png` | 家家利超市 | `帮我用淘宝闪购在家家利超市买一提金豆芽金银花柚子果汁饮料100ml` |
| `tb-ai-jiajiayue-*-qr.png` | 家家悦 | `帮我用淘宝闪购在家家悦买一提金豆芽金银花柚子汁` |
| `tb-ai-jiarong-*-qr.png` | 嘉荣 | `帮我用淘宝闪购在嘉荣买一提金豆芽金银花柚子汁` |
| `tb-ai-kidswant-*-qr.png` | 孩子王 | `用闪购帮我在孩子王购买金豆芽金银花柚子汁礼盒装100ml` |
| `tb-ai-huayubaijia-*-qr.png` | 华豫佰佳超市 | `帮我用淘宝闪购在华豫佰佳超市买一提金豆芽金银花柚子汁100ml` |
| `tb-ai-metro-*-qr.png` | 麦德龙 | `用闪购帮我在麦德龙购买金豆芽金银花柚子汁` |
| `tb-ai-miaoduoke-*-qr.png` | 妙多客超市 | `帮我用淘宝闪购在妙多客超市买一提金豆芽金银花柚子汁100ml` |
| `tb-ai-ouya-*-qr.png` | 欧亚超市 | `帮我用淘宝闪购在欧亚超市买一提金豆芽金银花柚子汁` |
| `tb-ai-rtmart-*-qr.png` | 大润发 | `帮我用淘宝闪购在大润发买一提金豆芽金银花柚子汁` |
| `tb-ai-xingqin-*-qr.png` | 兴勤超市 | `帮我用淘宝闪购在兴勤超市买一提金豆芽金银花柚子汁` |
| `tb-ai-yasi-*-qr.png` | 雅斯超市 | `帮我用淘宝闪购在雅斯超市买一提金豆芽金银花柚子汁复合果汁饮品100ml` |
| `tb-ai-yingbeier-*-qr.png` | 婴贝儿 | `帮我用闪购在婴贝儿（领秀城贵和店）购买金豆芽金银花柚子汁宝宝饮品礼盒` |
| `tb-ai-yinzuo-*-qr.png` | 银座超市 | `用闪购帮我在银座买金豆芽金银花苹果汁礼盒装100ml` |

## 千问链路

千问链路支持上表中的全部渠道，URL 需要同时传入对应的 `channel` 和 `target=qianwen`。正式与测试目录各有 17 张二维码，渠道提示词与淘宝链路共用同一份配置。

| 环境 | 文件命名 | URL 示例 |
| --- | --- | --- |
| 正式 | `qianwen/production/tb-ai-{channel}-qianwen-production-qr.png` | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=huangshang&target=qianwen` |
| 测试 | `qianwen/local_10.10.10.27/tb-ai-{channel}-qianwen-local-qr.png` | `http://10.10.10.27:3000/tb-ai/?channel=huangshang&target=qianwen` |

## 淘宝闪购 AI 点外卖链路

淘宝闪购链路使用 `target=shangou`，支持上表中的全部渠道。正式与测试目录各有 17 张二维码，渠道提示词与淘宝、千问链路共用同一份配置。

| 环境 | 文件命名 | URL 示例 |
| --- | --- | --- |
| 正式 | `shangou/production/tb-ai-{channel}-shangou-production-qr.png` | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=huangshang&target=shangou` |
| 测试 | `shangou/local_10.10.10.27/tb-ai-{channel}-shangou-local-qr.png` | `http://10.10.10.27:3000/tb-ai/?channel=huangshang&target=shangou` |

该链路会先复制对应渠道口令，再通过淘宝闪购 `eleme://web` Scheme 打开“AI点外卖”页面，并将同一条口令作为 `voiceQuery` 携带。外部深链已通过 Android 和 HarmonyOS 真机验证，iOS 正式投放前仍需单独验证。

## 友盟统计口径

- `biz_channel` 区分渠道。
- `target` 区分实际执行的 `taobao`、`qianwen` 或 `shangou` 链路。
