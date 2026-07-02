# 执行清单（打印贴桌上版）

## 核心记住一句话

**热点 + 赚钱 = 雷达找热点 → 改 JSON 发页 → 当天 Reddit/X 推广 → 挂高佣金链接**

---

## 今日/本周必做

### 阶段 A：让网站能访问（域名下来后立刻做）

- [x] Cloudflare 注册并连接 / wrangler 部署
- [x] Pages 部署：build=`npm run build`，output=`dist`
- [x] 绑定 `hotpicklab.com`
- [x] 浏览器打开 https://hotpicklab.com 确认改版后页面
- [ ] Google Search Console 添加站点 + 提交 sitemap

### 阶段 B：能赚钱（部署后 48 小时内）

- [ ] 申请 Amazon Associates：https://affiliate-program.amazon.com
- [ ] 把 `src/data/trends.json` 里的链接换成你的 amzn.to 联盟链
- [ ] `git push` 触发自动部署
- [ ] Reddit 发 3 帖（文案：`src/data/promote-copy.json`）
- [ ] 申请 AI 工具联盟（Runway 等，见 affiliate-checklist.json）

### 阶段 C：稳定增收（第 2 周起）

- [ ] 申请 Google AdSense
- [ ] 每周新增 2-3 个热点（改 trends.json）
- [ ] 每周看 Search Console：哪个词有展示就加码
- [ ] 砍掉没数据的页，复制有效页结构

---

## 每日 30 分钟雷达

```
1. Google Trends 美国 Rising → 记 3 个词
2. Amazon Movers & Shakers → 看飙升商品
3. Reddit 热帖 → 看评论在讨论什么
4. 有符合条件的 → 当天加进 trends.json + 推广
```

---

## 3 个已做好热点（上线就推广）

| # | 页面 | Reddit 版块 |
|---|------|-------------|
| 1 | /trends/ai-video-generators-2026 | r/ArtificialInteligence |
| 2 | /trends/portable-blenders-amazon-trending | r/AmazonFinds |
| 3 | /trends/nintendo-switch-2-accessories | r/NintendoSwitch |

---

## 换电脑第一件事

```powershell
git clone https://github.com/stone13825110136/hotpicklab.git
cd hotpicklab
npm install
```

然后让 Cursor 读：

1. `docs/SESSION_HANDOFF_2026-07-02.md`（今晚交接）
2. `docs/PROJECT_HANDOFF.md`
3. `docs/archive/cursor-chat-2026-07-02-deploy-reposition.jsonl`（完整对话，已脱敏）

---

## 账号信息

| 项目 | 值 |
|------|-----|
| GitHub | stone13825110136 / hotpicklab |
| 域名 | hotpicklab.com |
| 联系邮箱（站里） | contact@hotpicklab.com（可改） |
