# 渠道二维码说明

以下二维码均指向同一个活动页，只通过 `channel` 参数区分复制口令。

## 正式服务二维码

正式服务域名：`https://jdyqwen.zirancuishipin.com`

| 文件 | 渠道 | 正式链接 | 复制口令 |
| --- | --- | --- | --- |
| `production/tb-ai-huangshang-production-qr.png` | 黄商超市渠道 | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=huangshang` | `帮我在淘宝闪购买一提金豆芽金银花柚子汁` |
| `production/tb-ai-kidswant-production-qr.png` | 孩子王渠道 | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=kidswant` | `用闪购帮我在孩子王购买金豆芽金银花柚子汁礼盒装100ml` |
| `production/tb-ai-jiadefu-production-qr.png` | 家得福渠道 | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=jiadefu` | `用闪购帮我在家得福购买【不怕上火】金豆芽金银花柚子汁100ml` |
| `production/tb-ai-metro-production-qr.png` | 麦德龙渠道 | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=metro` | `用闪购帮我在麦德龙购买金豆芽金银花柚子汁` |
| `production/tb-ai-yingbeier-production-qr.png` | 婴贝儿渠道 | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=yingbeier` | `帮我用闪购在婴贝儿（领秀城贵和店）购买金豆芽金银花柚子汁宝宝饮品礼盒` |
| `production/tb-ai-yinzuo-production-qr.png` | 银座超市渠道 | `https://jdyqwen.zirancuishipin.com/tb-ai/?channel=yinzuo` | `用闪购帮我在银座商城(济南和谐广场店)买金豆芽金银花苹果汁礼盒装100ml` |

## 本地测试二维码

本地测试地址：`http://192.168.5.9:3000`

| 文件 | 渠道 | 本地链接 | 复制口令 |
| --- | --- | --- | --- |
| `local/tb-ai-huangshang-local-qr.png` | 黄商超市渠道 | `http://192.168.5.9:3000/tb-ai/?channel=huangshang` | `帮我在淘宝闪购买一提金豆芽金银花柚子汁` |
| `local/tb-ai-kidswant-local-qr.png` | 孩子王渠道 | `http://192.168.5.9:3000/tb-ai/?channel=kidswant` | `用闪购帮我在孩子王购买金豆芽金银花柚子汁礼盒装100ml` |
| `local/tb-ai-jiadefu-local-qr.png` | 家得福渠道 | `http://192.168.5.9:3000/tb-ai/?channel=jiadefu` | `用闪购帮我在家得福购买【不怕上火】金豆芽金银花柚子汁100ml` |
| `local/tb-ai-metro-local-qr.png` | 麦德龙渠道 | `http://192.168.5.9:3000/tb-ai/?channel=metro` | `用闪购帮我在麦德龙购买金豆芽金银花柚子汁` |
| `local/tb-ai-yingbeier-local-qr.png` | 婴贝儿渠道 | `http://192.168.5.9:3000/tb-ai/?channel=yingbeier` | `帮我用闪购在婴贝儿（领秀城贵和店）购买金豆芽金银花柚子汁宝宝饮品礼盒` |
| `local/tb-ai-yinzuo-local-qr.png` | 银座超市渠道 | `http://192.168.5.9:3000/tb-ai/?channel=yinzuo` | `用闪购帮我在银座商城(济南和谐广场店)买金豆芽金银花苹果汁礼盒装100ml` |

## 友盟统计口径

- 链接参数继续使用 `channel` 区分投放渠道。
- 页面上报到友盟时使用 `biz_channel` 作为事件参数（避免使用友盟保留字段 `channel`）。
- 在友盟后台查看自定义事件时，请按 `biz_channel` 做筛选和分组。
