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
| `tb-ai-lejiachaohui-*-qr.png` | 乐家超惠生鲜超市 | `帮我用淘宝闪购在乐家超惠生鲜超市买一提金豆芽金银花柚子汁` |
| `tb-ai-lida-*-qr.png` | 丽达超市 | `帮我用淘宝闪购在丽达超市买一提金豆芽金银花柚子汁` |
| `tb-ai-kidswant-*-qr.png` | 孩子王 | `用闪购帮我在孩子王购买金豆芽金银花柚子汁礼盒装100ml` |
| `tb-ai-huayubaijia-*-qr.png` | 华豫佰佳超市 | `帮我用淘宝闪购在华豫佰佳超市买一提金豆芽金银花柚子汁100ml` |
| `tb-ai-gaojimeirui-pingxilu-*-qr.png` | 美锐大药房（平西路店） | `帮我用淘宝闪购在美锐大药房（平西路店）买一盒金豆芽水乐檬电解质饮品` |
| `tb-ai-gaojimeirui-xiyaheme-*-qr.png` | 美锐健康城（西亚和美店） | `帮我用淘宝闪购在美锐健康城西亚和美店买一盒金豆芽水乐檬电解质饮品` |
| `tb-ai-gaojimeirui-yiyaodalou-*-qr.png` | 同和堂大药店(医药大楼店) | `帮我用淘宝闪购在同和堂大药店(医药大楼店)买一盒金豆芽水乐檬电解质饮品` |
| `tb-ai-gaojimeirui-baijiahaoyisheng-*-qr.png` | 百家好一生医药健康城 | `帮我用淘宝闪购在百家好一生医药健康城买一盒金豆芽水乐檬电解质饮品` |
| `tb-ai-metro-*-qr.png` | 麦德龙 | `用闪购帮我在麦德龙购买金豆芽金银花柚子汁` |
| `tb-ai-miaoduoke-*-qr.png` | 妙多客超市 | `帮我用淘宝闪购在妙多客超市买一提金豆芽金银花柚子汁100ml` |
| `tb-ai-ouya-*-qr.png` | 欧亚超市 | `帮我用淘宝闪购在欧亚超市买一提金豆芽金银花柚子汁` |
| `tb-ai-rtmart-*-qr.png` | 大润发 | `帮我用淘宝闪购在大润发买一提金豆芽金银花柚子汁` |
| `tb-ai-xingqin-*-qr.png` | 兴勤超市 | `帮我用淘宝闪购在兴勤超市买一提金豆芽金银花柚子汁` |
| `tb-ai-xianfengshenghuo-*-qr.png` | 鲜风生活超市 | `帮我用淘宝闪购在鲜风生活超市买一提金豆芽金银花柚子汁` |
| `tb-ai-yasi-*-qr.png` | 雅斯超市 | `帮我用淘宝闪购在雅斯超市买一提金豆芽金银花柚子汁复合果汁饮品100ml` |
| `tb-ai-yingbeier-*-qr.png` | 婴贝儿 | `帮我用闪购在婴贝儿（领秀城贵和店）购买金豆芽金银花柚子汁宝宝饮品礼盒` |
| `tb-ai-yinzuo-*-qr.png` | 银座超市 | `用闪购帮我在银座买金豆芽金银花苹果汁礼盒装100ml` |

## 千问链路

千问链路支持上表中的全部投放项，URL 需要同时传入对应的 `channel` 和 `target=qianwen`。正式与测试目录各有 24 张当前投放二维码，渠道与门店提示词和淘宝链路共用同一份配置。

| 环境 | 文件命名 | URL 示例 |
| --- | --- | --- |
| 正式 | `qianwen/production/tb-ai-{channel}-qianwen-production-qr.png` | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=huangshang&target=qianwen` |
| 测试 | `qianwen/local_10.10.10.27/tb-ai-{channel}-qianwen-local-qr.png` | `http://10.10.10.27:3000/tb-ai/?channel=huangshang&target=qianwen` |

## 淘宝闪购 AI 点外卖链路

淘宝闪购链路使用 `target=shangou`，支持上表中的全部投放项。正式与测试目录各有 24 张当前投放二维码，渠道与门店提示词和淘宝、千问链路共用同一份配置。

| 环境 | 文件命名 | URL 示例 |
| --- | --- | --- |
| 正式 | `shangou/production/tb-ai-{channel}-shangou-production-qr.png` | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=huangshang&target=shangou` |
| 测试 | `shangou/local_10.10.10.27/tb-ai-{channel}-shangou-local-qr.png` | `http://10.10.10.27:3000/tb-ai/?channel=huangshang&target=shangou` |

该链路会先移除渠道口令中的“淘宝闪购/闪购”平台前缀并复制自然语句，再通过淘宝闪购 `eleme://web` Scheme 打开“AI点外卖”页面，并将同一条口令作为 `voiceQuery` 携带。外部深链已通过 Android 和 HarmonyOS 真机验证，iOS 正式投放前仍需单独验证。

原 `tb-ai-gaojimeirui-*-qr.png` 渠道级二维码已删除。高济美锐物料必须使用带门店 `storeId` 的四张门店二维码。

## 友盟统计口径

- `biz_channel` 区分渠道。
- 高济美锐四家门店的 `biz_channel` 均为 `gaojimeirui`，在友盟中汇总为同一渠道。
- `storeId` 区分同一渠道下的具体门店：`pingxilu`、`xiyaheme`、`yiyaodalou`、`baijiahaoyisheng`。
- `target` 区分实际执行的 `taobao`、`qianwen` 或 `shangou` 链路。
