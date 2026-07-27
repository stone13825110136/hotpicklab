# HotPickLab — Naming Lab 策划文案

**站点：** hotpicklab.com  
**品牌含义：** HotPick Lab = 热点选择实验室（选名 / 选出 Hot Pick）  
**更新日期：** 2026-07-25  

> 本文只服务 **HotPickLab**。卖家图片工具、压缩、HEIC、格式转换等归 **MiniTool HQ**（minitoolhq.com），不在本站做。

---

## 1. 产品定位

**一句话：** 英文命名选择实验室——不是再堆 100 个名字，而是用对比 + 娱乐塔牌，给出 **Hot Pick**。

| 项目 | 决策 |
|------|------|
| 市场 | **美式英文为主**（覆盖 US + 印度英文搜索 + UK） |
| 变现 | **广告优先 + 域名联盟（公司名阶段）** |
| 不做 | Logo SaaS、订阅墙优先、真算命承诺、日/中/欧本地语（后期再说） |
| 差异化 | Compare → Fortune Draw（娱乐塔牌）→ Hot Pick |

叙事：

> **HotPick Lab — name it, draw it, pick it.**  
> Pets → People → Brands

---

## 2. 建设路径（已定）

| 阶段 | 工具 | 说明 |
|------|------|------|
| **Phase 1** | **Pet Name Lab** | 狗/猫；塔牌默认开；广告；长尾 SEO |
| **Phase 2** | **People Name Lab** | 英文 baby / first name；同骨架 |
| **Phase 3** | **Business Name Lab** | Practical 分加重；Fortune **可关**；域名联盟 |

理由：塔牌与宠物/人名最搭；公司名理性要求高、工程更多（.com），放最后最稳。

---

## 3. 竞品结论（挑剔版摘要）

行业四种生意：Logo 漏斗（Namelix/Brandmark）、建站/域名漏斗（Shopify/GoDaddy）、广告+域名联盟（NameSnack）、溢价域名市场（Atom）。

**共同空洞：** 只生成、不帮选。ChatGPT 在吃「生成」；「选出更好的那一个」更难替代。

| 竞品类型 | 我们怎么错开 |
|----------|--------------|
| Namelix | 不做 Logo 卖货；做选择 Lab + 广告 |
| Shopify 等 | 独立完成选名，不导开店 |
| 宠物列表站 | Lab 工具 + 长尾页，不是纯目录 |
| ChatGPT | 结构化对比 + Hot Pick |

详细拆解见会话结论；本站不复制 Brandmark 变现路径。

---

## 4. 核心体验（三工具共用骨架）

```
输入
  ↓
立刻出 12–24 个候选（少而精）
  ↓
勾选 2–5 个进入 Compare
  ↓
翻牌（Fortune Draw）+ Practical 分（好叫 / 流行度 / 长度等）
  ↓
标出 1 个 Hot Pick + 一句话理由
  ↓
旁路：广告（不挡主流程）；公司名阶段加域名联盟
```

成功标准：

- 约 **30 秒**看到候选，约 **2 分钟**得到 Hot Pick  
- 跳出前尽量完成一次 Compare  

---

## 5. Fortune Draw（娱乐塔牌）

| 项 | 决策 |
|----|------|
| 性质 | **娱乐 / Inspiration**，非预测发财或命运 |
| 费用 | **不付费第三方 API**；数据本地化 |
| 数据 | 可用开源牌意（如 Tarotoo，CC BY 需署名）或自写短牌意词库 |
| 机制 | 名字 → **稳定哈希**映射到牌/牌意（同一名字结果稳定） |
| 宠物 / 人名 | 默认开 |
| 公司名 | 默认关或弱显示，标 Fun |

文案必须诚实：Fun reading · Not a prediction。

---

## 6. Phase 1 — Pet Name Lab（MVP）

**意向 URL：** `/tools/pet-name-lab`（最终以站点路由为准）

**输入**

- Species：Dog / Cat  
- Gender：Boy / Girl / Neutral  
- Vibe：Cute / Strong / Unique / Classic  
- **Starts with**：Any / A–Z（硬过滤）  
- **Breed**：热门品种（软亲和；狗优先 NYC 开放数据名×品种；见 `docs/COMPETITOR-PARITY-PET-LAB.md`）  
- （后续）Breed 长尾 SEO 深链 `/dog-names/labrador` 等（R1b 一次定稿后再建）  

**输出**

- 候选名 + 标签  
- Compare → 翻牌 → Hot Pick  

**SEO 第二层**

- 长尾页模板：`/dog-names/...`、`/cat-names/...`（品种 / 风格），页内嵌同一 Lab  

**变现**

- 结果区下方 / Compare 侧栏展示广告  
- 不挡生成与翻牌  

---

## 7. Phase 2 — People Name Lab

- 范围 v1：英文 **baby / first names**（Boy / Girl / Neutral）  
- 数据主源：美国 SSA（见 [DATA-SOURCES.md](./DATA-SOURCES.md)）  
- UK：ONS 作风格包（后期）  
- 同一套 Compare + Fortune + Hot Pick  

---

## 8. Phase 3 — Business Name Lab

**输入：** Keywords；Style（Brandable / Compound / Real words / Evocative）；Market US（默认）/ UK  

**输出：** 名字 + Practical 分 + .com 状态（尽力）+ Compare；Fortune 可关  

**刻意不做（v1）**

- Logo 生成  
- 真商标查询（仅免责 + 外链自行查）  
- 登录墙 / 次数墙  
- 长设置向导（设置收侧栏，默认一键出结果）  

**变现：** 广告 + 域名联盟次要按钮  

---

## 9. 市场与国家策略

| 优先级 | 内容 |
|--------|------|
| P0 | 美式英文命名风格 |
| P1 | 英式英文轻调 |
| 以后 | 日 / 中 / 德 / 法等本地语 |

「按国家取名」可以保留 UI，但 v1 实质是 US / UK / Global English，不做全文化词库。

---

## 10. 分期交付

| 阶段 | 交付 |
|------|------|
| MVP | Pet Name Lab 主流程 + Fortune Draw + 广告位 |
| +1 | People Name Lab |
| +2 | 宠物长尾 SEO 页模板 |
| +3 | Business Name Lab + 域名联盟 |
| 以后 | 本地语包；商标 API；外链 Logo 合作 |

---

## 11. 明确不做（本站）

- MiniTool HQ 已定工具：批量压缩、格式转换、HEIC→JPG、卖家修图等  
- 彩票类工具（广告政策风险）  
- 价格历史 / 跨店比价（无可靠 API）  
- 把 HotPickLab 做成通用 utility 站  

---

## 12. 相关文档

- 开源与公开数据：[DATA-SOURCES.md](./DATA-SOURCES.md)  
- 与 MiniTool HQ 边界：见该站 `docs/BRAND-BOUNDARY.md`（本站不托管其工具）  
