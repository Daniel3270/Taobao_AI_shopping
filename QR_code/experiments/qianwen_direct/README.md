# 千问 App 无中转页直达实验

该目录用于验证“用户扫码后直接拉起千问、自动发送渠道提示词并进入淘宝闪购 Agent”的最短链路。

这是独立实验资产，不修改 `/tb-ai/` 页面、不修改 `target` 分流，也不覆盖 `taobao/`、`qianwen/`、`shangou/` 现有二维码。

## 实验二维码 A：自定义 Scheme

- 文件：`qianwen-direct-huangshang-test-qr.png`
- 渠道：黄商超市
- 提示词：`帮我用淘宝闪购在黄商超市买一提金豆芽金银花柚子汁`
- 原始载荷：见 `qianwen-direct-huangshang-test-payload.txt`

## 预期链路

```text
扫码
→ 识别 tongyi:// 自定义 Scheme
→ 拉起千问 App
→ 千问内部打开生活帮手链接
→ 自动发送黄商渠道提示词
→ 命中淘宝闪购 Agent
```

二维码携带的关键参数：

- `direct_send="true"`
- `contextScene="qwen_banshi"`
- `entry=life_assistant`
- `qk_biz=ai_qwen`
- `qk_module=home`

## 实验 A 测试记录

| 扫码入口 | 识别二维码 | 拉起千问 | 自动发送 | 命中闪购 Agent | 备注 |
| --- | --- | --- | --- | --- | --- |
| iOS 系统相机 | 待测 | 待测 | 待测 | 待测 | |
| Android 系统相机 | 待测 | 待测 | 待测 | 待测 | |
| 鸿蒙系统相机 | 是 | 否 | 否 | 否 | 将 `tongyi://` 载荷显示为普通文本 |
| 微信扫码（Android） | 是 | 否 | 否 | 否 | WebView 报 `ERR_UNKNOWN_URL_SCHEME` |
| 支付宝扫码（Android） | 是 | 否 | 否 | 否 | 识别为非支付宝内容，仅提供复制 |
| 淘宝扫码 | 待测 | 待测 | 待测 | 待测 | |

用户补充反馈：鸿蒙系统中的微信、支付宝扫码也无法打开该自定义 Scheme。

结论：二维码内容正确，但扫码入口不会统一放行 `tongyi://`。该方案不能作为跨平台的无中转页链路。

## 实验二维码 B：官方 HTTPS Universal Link

- 文件：`qianwen-universal-link-huangshang-test-qr.png`
- 渠道：黄商超市
- 提示词：`帮我用淘宝闪购在黄商超市买一提金豆芽金银花柚子汁`
- 原始载荷：见 `qianwen-universal-link-huangshang-test-payload.txt`

该二维码直接编码 `https://u.qianwen.com/`，保留与实验 A 相同的 `qk_params`，不再外包一层 `tongyi://page/h5`。

```text
扫码
→ 打开千问官方 HTTPS Universal Link
→ 尝试由系统关联拉起千问 App
→ 自动发送黄商渠道提示词
→ 尝试命中淘宝闪购 Agent
```

## 实验 B 测试记录

| 扫码入口 | 打开 HTTPS | 拉起千问 | 自动发送 | 命中闪购 Agent | 备注 |
| --- | --- | --- | --- | --- | --- |
| iOS 系统相机 | 待测 | 待测 | 待测 | 待测 | 建议优先测试 |
| Android 系统相机 | 待测 | 待测 | 待测 | 待测 | 建议优先测试 |
| 鸿蒙系统相机 | 待测 | 待测 | 待测 | 待测 | 建议优先测试 |
| 微信扫码 | 待测 | 待测 | 待测 | 待测 | 可能在内置浏览器打开 |
| 支付宝扫码 | 待测 | 待测 | 待测 | 待测 | 可能在内置浏览器打开 |
| 淘宝扫码 | 待测 | 待测 | 待测 | 待测 | |

2026-08-18 实测结果：二维码能够打开 `u.qianwen.com`，但最终进入千问官方下载页面，没有拉起已安装的千问 App，也没有自动发送提示词。该方案不能替代现有中转页。

## 实验二维码 C：HTTPS 活码后端 302

- 文件：`qianwen-302-huangshang-local-qr.png`
- 二维码载荷：`http://10.10.10.27:3010/qianwen-direct/huangshang`
- 渠道：黄商超市
- 提示词：`帮我用淘宝闪购在黄商超市买一提金豆芽金银花柚子汁`
- 实验服务：`scripts/qianwen-direct-server.mjs`

```text
扫码我们的 HTTP 测试活码
→ Node 实验服务立即返回 HTTP 302
→ Location 指向携带提示词的 tongyi://page/h5
→ 尝试由扫码器或系统拉起千问 App
→ 自动发送提示词并尝试命中淘宝闪购 Agent
```

启动命令：

```bash
npm run experiment:qianwen-direct
```

该服务不返回中转 HTML，不修改 Next.js 静态导出配置，也不影响现有三个正式链路。

微信扫码会根据 `MicroMessenger` UA 返回轻量引导页，提示用户通过右上角菜单在系统浏览器打开。支付宝不再叠加第二层引导，确认离开支付宝后继续执行直达链路；其他浏览器仍立即返回 302。

渠道名称和 Prompt 维护在：

```text
config/qianwen-direct-prompts.json
```

服务会在每次请求时重新读取配置，因此修改 Prompt 后无需重启服务，也无需更换二维码。二维码只绑定稳定的渠道路径。

基础事件日志写入：

```text
logs/qianwen-direct-events.jsonl
```

当前记录 `qianwen_wechat_guide` 和 `qianwen_redirect`，包含时间、渠道、系统、浏览器类型、脱敏 IP 哈希和 UA。由于千问没有向该服务回传结果，目前无法确认 App 是否真正打开、是否命中 Agent 或是否完成下单。

## 实验 C 测试记录

| 扫码入口 | 访问活码 | 收到 302 | 拉起千问 | 自动发送 | 命中闪购 Agent | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| iOS 系统相机 | 待测 | 待测 | 待测 | 待测 | 待测 | |
| Android 系统相机 | 待测 | 待测 | 待测 | 待测 | 待测 | |
| 鸿蒙系统相机 | 待测 | 待测 | 待测 | 待测 | 待测 | |
| 微信扫码 | 待测 | 待测 | 待测 | 待测 | 待测 | |
| 支付宝扫码 | 待测 | 待测 | 待测 | 待测 | 待测 | |

## 实验边界

- 不经过落地页，因此没有友盟扫码访问与点击埋点。
- 不提供复制提示词、下载千问和重新打开等兜底。
- 提示词硬编码在二维码内，修改提示词后必须重新生成二维码。
- 实验 A 已确认会被多个扫码入口拦截或当作普通文本。
- 实验 B 是否能直接拉起千问取决于系统、扫码器与千问官方 Universal Link 的关联策略。
- 当前设备实测中，实验 B 已回落到官方下载页，判定为失败方案。
- 仅用于小范围技术验证，不替换现有正式二维码。
