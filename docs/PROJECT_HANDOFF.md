# HotPick Lab 项目总纲（必读）

> **核心原则：热点 + 赚钱**（运营侧）  
> **公开站原则：面向客户价值** — 热点选购靠谱指南 + 精品免费工具；佣金怎么赚只在内部沟通，不上网站。

---

## 一、项目定位

| 项目 | 内容 |
|------|------|
| 站名 | **HotPick Lab** |
| 域名 | **hotpicklab.com** |
| 市场 | 英文全球，优先美国搜索意图 |
| 模式 | 热点导购页 + 配套小工具 + 联盟佣金 |
| 部署 | Cloudflare Pages（免备案） |
| GitHub | https://github.com/stone13825110136/hotpicklab |
| GitHub 用户 | `stone13825110136` |

**一人公司公式：**

```
Google Trends / Amazon 飙升 / Reddit 热帖（雷达）
  → 48 小时内改 trends.json 上线新页
  → 同一天 Reddit / X 推广（比 SEO 重要 10 倍）
  → 挂高佣金链接（AI SaaS > Amazon > AdSense）
  → 看数据，砍掉无效页，加码有效页
```

---

## 二、为什么选这条路（沟通结论）

### 国内 vs 国外 → 选国外

- 免备案，域名 + Cloudflare **当天上线**
- Google AdSense、Amazon Associates 成熟
- 个人可收款（AdSense 达门槛打银行卡）

### 工具站 vs Amazon 导购 → 热点导购站

用户明确要：**追热点、佣金高、推广热点**，不是研究国外常青需求。

最终方案：**热点雷达站**（TrendPulse / HotPick Lab）

| 对比 | 纯工具站 | 纯 Amazon 导购 | **热点站（当前）** |
|------|----------|----------------|-------------------|
| 跟热点 | 弱 | 中 | **强** |
| 佣金 | 低（广告） | 中 | **高（AI 联盟 20-40%）** |
| 上手 | 易 | 难（长文） | **改 JSON 即可** |
| 来钱速度 | SEO 慢 | SEO 慢 | **社媒当天可引流** |

### 关键认知（别忘）

1. **热点靠社媒抢首发，不靠等 Google**（SEO 是长尾补充）
2. **佣金优先级**：AI SaaS 联盟 > Amazon > AdSense
3. **国外需求不用懂**，用 Trends / Amazon / Reddit 当雷达
4. **有大量时间** → 每周铺 3-5 个热点页，比憋 1 个完美页更赚钱

---

## 三、当前已上线的 3 个示例热点

| 热点 | 页面路径 | 变现 | 推广渠道 |
|------|----------|------|----------|
| AI 视频生成器 | `/trends/ai-video-generators-2026` | SaaS 高佣 20-40% | r/ArtificialInteligence, X #AItools |
| TikTok 爆款榨汁机 | `/trends/portable-blenders-amazon-trending` | Amazon 3-8% | r/AmazonFinds, Pinterest |
| Switch 2 配件 | `/trends/nintendo-switch-2-accessories` | Amazon 4-10% | r/NintendoSwitch, Discord |

**配套工具页：**

- `/tools/video-aspect-ratio-calculator`（配 AI 视频热点）
- `/tools/gaming-session-timer`（配 Switch 热点）
- `/tools/amazon-prime-day-savings-calculator`（大促季节用）

---

## 四、佣金赚钱优先级

| 优先级 | 类型 | 佣金 | 申请地址 |
|--------|------|------|----------|
| 1 | AI / SaaS 联盟 | 20-40% recurring | 各 AI 工具官网 Affiliate |
| 2 | Amazon Associates | 3-8% | affiliate-program.amazon.com |
| 3 | 游戏外设/Key | 5-15% | Humble, GMG 等 |
| 4 | Google AdSense | 按展示 | google.com/adsense |

**同一页可叠加**：导购链接 + 底部相关 Amazon 配件 + 流量稳了加 AdSense。

---

## 五、每周执行 SOP（你只做这 3 件事）

### 1. 找热点（每天 30 分钟）

| 雷达 | 网址 | 看什么 |
|------|------|--------|
| Google Trends | trends.google.com | 美国 · 近 7 天 · **Rising** |
| Amazon 飙升 | amazon.com/gp/movers-and-shakers | 突然上榜商品 |
| Reddit | r/AmazonFinds, r/ArtificialInteligence | 当天高 upvote |
| X 搜索 | "tiktok made me buy", "viral amazon" | 爆款帖 |

**筛选标准（4 条全满足才做）：**

- [ ] 搜索量在涨（不是一日游）
- [ ] 能挂联盟链接（Amazon 或 SaaS）
- [ ] 4 小时内能发页
- [ ] 词带购买意图（best / worth it / vs / alternatives）

### 2. 发页（改 JSON，不用写代码）

编辑 **`src/data/trends.json`**，复制一条改：

- `title` — 含年份 + 热点词
- `products` — 2-4 个产品 + **你的联盟链接**
- `commissionType` — `saas-affiliate` 或 `amazon-associates`
- `promoteOn` — 推广渠道

可选：在 **`src/data/tools.json`** 加配套小工具。

```powershell
git add .
git commit -m "Add trend: xxx"
git push
# Cloudflare 自动重新部署
```

### 3. 推广（上线当天，必做）

- Reddit 相关 sub 发帖（像分享整理，不像硬广）
- X 带话题标签
- 文案见 **`src/data/promote-copy.json`**

---

## 六、4 类永久可抄的热点类型

1. **TikTok → Amazon 小商品**（搅拌杯、收纳、小家电）
2. **每月新 AI 工具**（SaaS 佣金最高）
3. **游戏机/大作发布配件**（发售后 60-90 天窗口）
4. **大促季节**（Prime Day、黑五，提前 2 周发计算器+清单）

---

## 七、待办清单（按顺序打勾）

### 已完成

- [x] 选定模式：热点 + 高佣金 + 国外市场
- [x] 选定域名：hotpicklab.com
- [x] 搭建 Astro 静态站
- [x] 3 个热点导购页 + 3 个工具页
- [x] 推广文案 promote-copy.json
- [x] 联盟申请清单 affiliate-checklist.json
- [x] **Cloudflare 部署上线**（wrangler 直传 dist）
- [x] **域名绑定** hotpicklab.com 可访问
- [x] **网站改版**：面向客户（About 页、选购指南结构、工具独立页+弹层）
- [x] 运营数据分离：trends-ops.json（内部，不上站）
- [x] 沟通记录归档：docs/archive/ + SESSION_HANDOFF_2026-07-02.md

### 待完成（下一步）

- [ ] **确认 GitHub 已同步最新代码**（含 f20b248 改版 commit）
- [ ] **Google Search Console**
  - 验证域名 → 提交 sitemap: https://hotpicklab.com/sitemap.xml
- [ ] **Amazon Associates 申请**
  - 通过后替换 trends.json 里的 affiliateUrl
- [ ] **AI 工具联盟申请**（Runway 等）
- [ ] **上线当天发 3 条 Reddit 帖**（文案在 promote-copy.json）
- [ ] **热点指南自动化**（每周雷达 + 草稿，讨论过未实现）
- [ ] **第 2 周申请 Google AdSense**
- [ ] **privacy.astro 联系邮箱改成你的真实邮箱**
- [ ] **轮换** GitHub 密码 / Cloudflare API Token（曾在对话中出现）

---

## 八、Cloudflare 部署步骤（详细）

1. 登录 https://dash.cloudflare.com
2. 左侧 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 授权 GitHub，选择仓库 **`stone13825110136/hotpicklab`**
4. 构建设置：
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. **Save and Deploy**，等 2-3 分钟
6. 得到临时地址 `https://hotpicklab.pages.dev`
7. **添加自定义域名**：项目 → Custom domains → `hotpicklab.com`
8. 若域名在阿里云/Namecheap 买的，把 NS 记录改到 Cloudflare

---

## 九、另一台电脑怎么继续

```powershell
git clone https://github.com/stone13825110136/hotpicklab.git
cd hotpicklab
npm install
npm run dev
```

**在 Cursor 新对话里告诉 AI：**

```
项目：hotpicklab.com — 面向客户的热点选购指南 + 免费工具
GitHub：stone13825110136/hotpicklab
请先读：
  docs/SESSION_HANDOFF_2026-07-02.md
  docs/PROJECT_HANDOFF.md
  docs/archive/cursor-chat-2026-07-02-deploy-reposition.jsonl
运营侧仍遵循「热点+赚钱」，但公开站不写佣金教程。
```

**改代码后重新部署：**

```powershell
npm run build
npx wrangler pages deploy dist --project-name=hotpicklab --branch=main
```

---

## 十、关键文件索引

| 文件 | 用途 |
|------|------|
| `src/data/trends.json` | **公开热点选购指南（最常改）** |
| `src/data/trends-ops.json` | **内部**佣金/推广策略（不上站） |
| `src/data/tools.json` | 配套小工具 |
| `src/data/promote-copy.json` | Reddit/X 推广文案 |
| `src/data/affiliate-checklist.json` | 联盟申请步骤 |
| `src/lib/site.ts` | 站名、域名、邮箱 |
| `docs/PROJECT_HANDOFF.md` | 本文档 |
| `docs/EXECUTION_CHECKLIST.md` | 执行清单 |
| `docs/SESSION_HANDOFF_2026-07-02.md` | 今晚会话交接（换电脑先看） |
| `docs/archive/` | 沟通记录归档（含 JSONL） |

---

## 十一、避坑（合规红线）

| 严禁 | 原因 |
|------|------|
| 影视/小说/破解盗版 | 关站 + 法律风险 |
| 去水印/破解工具 | 联盟拒收 |
| 刷流量/诱导点击 | 永久封联盟号 |
| 未授权素材 | 版权投诉 |
| 同时做 5 个方向 | 分散，1 个垂直铺透再复制 |

---

## 十二、收入预期（务实）

| 时间 | 目标 |
|------|------|
| 第 1 月 | 站上线、3 帖推广、联盟申下来 |
| 第 2-3 月 | 每周 2-3 个新热点页，日 UV 20-100 |
| 第 3-4 月 | 第一笔 AdSense / 联盟收入（$1-50/月） |
| 第 6-12 月 | 50-100 页，日 UV 500+，$100-500/月 有可能 |

**热点站更快见到流量的方式：Reddit/X 当天推，不是等 SEO。**

---

*最后更新：2026-07-02 晚（部署完成 + 客户向改版 + 聊天记录归档）*  
*项目所有者：stone13825110136*
