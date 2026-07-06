# 执行清单（打印贴桌上版）

## 核心记住一句话

**热点 + 赚钱 = 雷达找热点 → 改 JSON 发页 → Bing/IndexNow → 挂高佣金链接**

> **推广现状（2026-07-06）：** Quora / Reddit 国内进不去 → 主线 **Bing Webmaster + IndexNow + 内容**。

---

## 今日/本周必做

### 阶段 A：收录与可见性

- [x] Cloudflare 部署 + 绑定 `hotpicklab.com`
- [x] **10 篇**指南 + **3 个**工具页上线（shopper-proof 改版）
- [x] 风扇页死链修复（`77b1ea6`）
- [x] Bing Webmaster 已添加站点 + 已提交 sitemap
- [x] Bing 已能搜到品牌词 `hotpicklab`（约 2026-07-06）
- [x] `hotpicklab.com prime day` 指南排 Bing 第一条
- [x] `npm run indexnow` — 19 URL，200 OK（2026-07-06）
- [ ] **`site:hotpicklab.com` 从 1 条涨到 10+**（等 1–2 周，每周查一次）
- [ ] **Bing Webmaster 手动提交重点 URL**（见下方步骤，需你登录操作）
- [ ] Google Search Console（需稳定翻墙，非紧急）

### 阶段 B：能赚钱（进行中）

- [x] Amazon Associates 已批 — tag `hotpicklab20-20`
- [x] trends.json 联盟链接已换真实 tag
- [x] `npm run verify-links` 全部 Amazon 链接 200
- [ ] **Prime Day 窗口（7 月中旬）** — 内容已就绪，盯收录与展示
- [ ] Quora — **跳过**（国内打不开）
- [ ] Reddit — **跳过**（自由门 / 代理 IP 被屏蔽）
- [ ] CapCut Impact — 流量起来再申（曾被 marketplace 拒）

### 阶段 C：稳定增收（第 2 周起）

- [ ] 申请 Google AdSense（流量稳了再申）
- [ ] 每周新增 0–1 个热点（**先收齐现有 10 篇索引，再考虑加**）
- [ ] 每周看 Bing Webmaster：展示 / 点击 / 收录页数
- [ ] 有展示的词 → 加码对应指南
- [ ] 砍掉没数据的页，复制有效页结构

---

## Bing Webmaster 手动提交 URL（5 分钟，需你登录）

1. 打开 https://www.bing.com/webmasters
2. 选中站点 **hotpicklab.com**
3. 左侧 **URL 提交**（或 URL Submission）
4. 逐条粘贴提交（优先 Prime Day，再补高流量潜力页）：

```
https://hotpicklab.com/trends/amazon-prime-day-deals-worth-it-2026/
https://hotpicklab.com/trends/stanley-owala-water-bottles-worth-it-2026/
https://hotpicklab.com/trends/portable-handheld-fans-amazon-2026/
https://hotpicklab.com/trends/portable-blenders-amazon-trending/
https://hotpicklab.com/trends/countertop-nugget-ice-makers-2026/
https://hotpicklab.com/tools/amazon-prime-day-savings-calculator/
```

5. 提交后 3–7 天再搜 `site:hotpicklab.com` 看条数

**有改动上线后：** `git push` → `npm run indexnow`

---

## 每日 30 分钟雷达

```
1. 微信雷达 PushPlus 推送 → 看 candidates
2. Bing 搜 site:hotpicklab.com → 记收录条数
3. （可选，需翻墙）Google Trends 美国 Rising
4. 有符合条件且未重复的 → 改 trends.json → push → indexnow
```

---

## 10 个已上线热点

| # | 页面 | 变现 | 备注 |
|---|------|------|------|
| 1 | /trends/ai-video-generators-2026 | SaaS | CapCut 待 Impact |
| 2 | /trends/portable-blenders-amazon-trending | Amazon | |
| 3 | /trends/nintendo-switch-2-accessories | Amazon | |
| 4 | /trends/portable-handheld-fans-amazon-2026 | Amazon | ASIN 已修 |
| 5 | /trends/amazon-prime-day-deals-worth-it-2026 | Amazon | **Prime Day 主推** |
| 6 | /trends/stanley-owala-water-bottles-worth-it-2026 | Amazon | |
| 7 | /trends/countertop-nugget-ice-makers-2026 | Amazon | |
| 8 | /trends/pickleball-paddles-beginners-2026 | Amazon | |
| 9 | /trends/cooling-neck-fans-amazon-2026 | Amazon | |
| 10 | /trends/ai-photo-enhancers-2026 | SaaS | |

**配套工具：** `video-aspect-ratio-calculator` · `gaming-session-timer` · `amazon-prime-day-savings-calculator`

---

## 换电脑第一件事

```powershell
git clone https://github.com/stone13825110136/hotpicklab.git
cd hotpicklab
npm install
npm run dev
```

然后让 Cursor 读：

1. **`docs/SESSION_HANDOFF_2026-07-06.md`**（最新交接）
2. `docs/PROJECT_HANDOFF.md`
3. `docs/archive/cursor-chat-2026-07-03-evening-onward-session.md`

---

## 常用命令

```powershell
npm run indexnow      # Bing/Yandex 通知抓取（19 URL）
npm run verify-links  # 校验 Amazon 联盟链接
npm run promote       # 推广文案（Quora 国内不可用，略过）
npm run radar:scan    # 本地跑雷达扫描
```

---

## 账号信息

| 项目 | 值 |
|------|-----|
| GitHub | stone13825110136 / hotpicklab |
| 域名 | hotpicklab.com |
| Amazon tag | hotpicklab20-20 |
| Bing Webmaster | https://www.bing.com/webmasters |
| 联系邮箱（站里） | contact@hotpicklab.com（可改） |

---

*最后更新：2026-07-06*
