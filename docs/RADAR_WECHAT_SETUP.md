# 每日热点雷达 + 微信推送

> **流程：每天自动扫热点 → 推送到你的微信 → 你确认 → 自动发布到 hotpicklab.com**

---

## 整体流程

```
每天 08:00（北京时间）
  → GitHub Action 自动扫描 Google Trends + Reddit
  → 推送到你的微信（PushPlus）
  → 同时创建 GitHub Issue 待确认

你确认（二选一）：
  A. 在 Cursor 对我说：「发布雷达 2026-07-03 第1,3条」
  B. 在 GitHub Radar Issue 评论：approve 1,3

确认后：
  → 自动写入 trends.json → 部署 hotpicklab.com
```

---

## 第一步：注册 PushPlus（微信推送）

1. 打开 https://www.pushplus.plus
2. 微信扫码登录
3. 首页复制你的 **token**（一串字符）
4. 关注「PushPlus 推送加」公众号（按网站提示），才能收到微信消息

---

## 第二步：把 Token 加到 GitHub

1. 打开 https://github.com/stone13825110136/hotpicklab/settings/secrets/actions
2. **New repository secret**
3. Name: `PUSHPLUS_TOKEN`
4. Value: 粘贴你的 PushPlus token
5. Save

---

## 第三步：启用 GitHub Actions

1. 仓库 **Actions** 标签页
2. 若提示启用 workflows，点 **I understand, enable**
3. 左侧选 **Daily Hotspot Radar** → **Run workflow** 可手动试跑一次

---

## 你每天会收到什么

微信消息示例：

```
🔥 HotPick Lab 每日热点雷达
日期：2026-07-03

1. [88分] viral portable blender ...
   来源：reddit-AmazonFinds
   ...

✅ 确认发布：
1. Cursor：发布雷达 2026-07-03 第1,3条
2. GitHub Issue 评论 approve 1,3
```

---

## 你怎么确认

### 方式 A：在 Cursor 对我说（推荐）

```
发布雷达 2026-07-03 第1,3条
```

我会读取 `radar/pending/2026-07-03.json`，更新网站并推送。

### 方式 B：GitHub Issue 评论

每天会自动创建一个标题类似 `Radar 2026-07-03 — confirm picks` 的 Issue。

评论：

```
approve 1,3
```

GitHub Action 会自动发布并部署（需 Issue 带 `radar` 标签）。

---

## 本地手动测试

```bash
# 扫描（不推微信）
node scripts/scan-trends.mjs

# 推送到微信（需设置环境变量）
set PUSHPLUS_TOKEN=你的token
node scripts/daily-radar.mjs

# 手动发布第 1、3 条
node scripts/publish-radar.mjs 2026-07-03 1,3
npm run build
```

---

## 扫什么数据源

| 来源 | 内容 |
|------|------|
| Google Trends US | 当日美国热搜 |
| Reddit r/AmazonFinds | 热门 Amazon 发现帖 |
| Reddit r/ArtificialInteligence | AI 工具热帖 |

---

## 注意

1. **确认后才发布** — 不会未经你同意自动改网站
2. **首版发布页是模板** — 确认后我会/你需要把 Amazon 链接换成具体 `/dp/ASIN?tag=hotpicklab20-20`
3. **PushPlus 免费版** 有每日条数限制，一般够用
4. **微信不能回复机器人** — 所以用 Cursor 或 GitHub 确认，不是在微信里回复

---

## 文件位置

| 文件 | 用途 |
|------|------|
| `scripts/scan-trends.mjs` | 扫描逻辑 |
| `scripts/send-pushplus.mjs` | 微信推送 |
| `scripts/publish-radar.mjs` | 确认后写入 trends.json |
| `radar/latest.json` | 最新一次扫描结果 |
| `.github/workflows/daily-radar.yml` | 每日定时任务 |
