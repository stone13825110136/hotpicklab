# TrendPulse — 热点趋势 + 高佣金站

> 代码已搭好。你负责：**每周找热点 → 改 JSON → 推广**。不用懂国外需求，按雷达流程抄作业。

## 这种模式是什么？

不是等 SEO 的纯工具站，而是：

```
Google Trends / Amazon 飙升榜 / Reddit 热帖
  → 48 小时内上线「热点导购页」
  → 同一天发 Reddit / X 引流
  → 挂高佣金链接（AI SaaS > Amazon > AdSense）
```

**热点不靠猜，靠雷达；热点不靠 SEO 抢首发，靠社媒当天推。**

## 本地运行

```bash
cd trendpulse
npm install
npm run dev
```

浏览器打开 http://localhost:4321

## 部署（免备案，买完域名就上线）

1. 代码推送到 GitHub
2. [Cloudflare Pages](https://pages.cloudflare.com/) 连接仓库
3. Build command: `npm run build`
4. Output directory: `dist`
5. 绑定你的 `.com` 域名

改 `astro.config.mjs` 和 `src/lib/site.ts` 里的 `your-domain.com`。

## 你每周只做 3 件事

### 1. 找热点（30 分钟/天）

| 雷达 | 网址 | 看什么 |
|------|------|--------|
| Google Trends | trends.google.com | 美国 · 近 7 天 · Rising |
| Amazon 飙升 | amazon.com/gp/movers-and-shakers | 突然上榜的小玩意 |
| Reddit | r/AmazonFinds, r/ArtificialInteligence | 当天高 upvote 帖 |
| X 搜索 | "tiktok made me buy", "viral amazon" | 带图带链接的爆款 |

**筛选标准：** 能挂联盟链接 + 你能 4 小时内发页 + 搜索词带购买意图（best / worth it / vs）

### 2. 加一页（改 JSON，不用写代码）

编辑 `src/data/trends.json`，复制一条改：

- `title` — 含年份和热点词
- `products` — 2–4 个产品 + 你的联盟链接
- `commissionType` — `saas-affiliate`（高佣）或 `amazon-associates`
- `promoteOn` — 推广渠道清单

可选：在 `src/data/tools.json` 加配套小工具（更容易被搜到）。

然后：

```bash
npm run build
```

推送到 GitHub，Cloudflare 自动更新。

### 3. 推广（同一天，比 SEO 重要 10 倍）

热点 SEO 来不及，**必须当天发**：

- Reddit 相关 sub 发「我整理了个对比页」（别像硬广）
- X 带话题标签
- 可选：TikTok 评论区、Facebook deal 群

## 佣金优先级（你要的「佣金多」）

| 优先级 | 类型 | 佣金 | 申请 |
|--------|------|------|------|
| 1 | AI / SaaS 联盟 | 20–40%  recurring | 各产品官网 Affiliate / Partner |
| 2 | Amazon Associates | 3–8% | affiliate-program.amazon.com |
| 3 | 游戏 key / 外设 | 5–15% | Humble, GMG 等 |
| 4 | Google AdSense | 按展示 | 有内容后申请 |

**同一页可叠加：** AI 导购文底部 + 相关 Amazon 配件 + 流量稳了加 AdSense。

## 国外需求不用懂 — 抄这 4 类热点

1. **TikTok 带火的 Amazon 小商品**（搅拌杯、收纳、小家电）
2. **新 AI 工具**（每月都有新品，SaaS 佣金高）
3. **游戏机/大作发布配件窗口**（发售后 60–90 天）
4. **大促季节**（Prime Day、Black Friday — 提前 2 周发计算器+清单）

## 联盟申请顺序

1. Amazon Associates（amazon.com 美国站）
2. 你 JSON 里写的 AI 工具官网联盟
3. Google AdSense（有 15–20 页内容 + Privacy 页）
4. 按热点补专项联盟

## 文件结构

```
src/data/trends.json   ← 你主要改这个（热点导购）
src/data/tools.json    ← 配套小工具
src/pages/trends/      ← 自动生成导购页
src/pages/tools/       ← 自动生成工具页
```

## 免责声明

- 联盟链接记得换成你自己的
- `privacy.astro` 里填真实联系邮箱
- 别做侵权、假货、医疗夸大宣传
