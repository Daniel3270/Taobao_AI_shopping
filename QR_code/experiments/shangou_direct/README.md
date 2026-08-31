# 淘宝闪购 App 无落地页直达实验

该目录验证“固定 HTTP 活码 → 后端 302 → 淘宝闪购 AI 点外卖”的无落地页链路，不修改现有三条正式链路。

## 黄商测试二维码

- 二维码：`shangou-302-huangshang-local-qr.png`
- 载荷：`http://10.10.10.27:3010/shangou-direct/huangshang`
- Prompt 配置：`config/qianwen-direct-prompts.json`

```text
扫码测试活码
→ 后端读取黄商 Prompt
→ 移除 Prompt 中的“淘宝闪购/闪购”平台前缀
→ 将 Prompt 写入 AI 点外卖 voiceQuery
→ 返回 302，Location 指向 eleme://web
→ 尝试打开淘宝闪购 App 并自动发送
```

微信扫码会显示“在浏览器打开”引导。支付宝使用自身的“离开支付宝/继续访问”安全确认，不再叠加第二层引导；确认后直接进入淘宝闪购唤醒中继。其他入口先显示极短的打开状态并尝试唤起 App；如果约 1.8 秒后页面仍可见，则推断 App 未安装或唤醒失败，显示下载引导并尝试打开应用商店。

下载兜底：

- iOS：App Store
- 鸿蒙、华为、荣耀：华为应用市场
- 小米、OPPO、vivo、三星：对应厂商应用商店
- 其他 Android：系统通用 `market://`
- 所有平台均保留淘宝闪购官方下载入口

事件记录在 `logs/qianwen-direct-events.jsonl`：

- `shangou_wechat_guide`
- `shangou_launch_page`
- `shangou_app_opened_inferred`
- `shangou_download_fallback`

修改渠道 Prompt 不需要更换二维码。
