# HotPick Lab — 热点趋势 + 高佣金站

> **核心：热点 + 赚钱** | 域名：**hotpicklab.com** | GitHub：**stone13825110136/hotpicklab**

## 新电脑 / 新对话必读

1. **[项目总纲（完整方案）](docs/PROJECT_HANDOFF.md)** ← AI 和你都先读这个
2. **[执行清单（打勾干活）](docs/EXECUTION_CHECKLIST.md)**
3. **[微信雷达设置](docs/RADAR_WECHAT_SETUP.md)** ← 每日热点推微信

在 Cursor 新对话里说：

```
接着 hotpicklab 项目，核心原则「热点+赚钱」，请先读 docs/PROJECT_HANDOFF.md
```

---

## 模式

```
Google Trends / Amazon 飙升 / Reddit 热帖
  → 48h 内改 trends.json 发页
  → 当天 Reddit/X 推广
  → 高佣金（AI SaaS > Amazon > AdSense）
```

## 本地运行

```bash
npm install
npm run dev
```

## 你每周只做 3 件事

1. **雷达找热点**（30 分钟/天）→ Trends / Amazon / Reddit
2. **改 `src/data/trends.json`** → git push 自动部署
3. **当天推广** → 文案在 `src/data/promote-copy.json`

## 部署（Cloudflare Pages）

- Build: `npm run build`
- Output: `dist`
- 域名: `hotpicklab.com`

详见 [docs/PROJECT_HANDOFF.md](docs/PROJECT_HANDOFF.md) 第八节。

## 关键文件

| 文件 | 用途 |
|------|------|
| `src/data/trends.json` | 热点页 + 联盟链接 |
| `src/data/promote-copy.json` | Reddit/X 文案 |
| `src/data/affiliate-checklist.json` | 联盟申请步骤 |
