# 会话交接（2026-07-03）

> 换电脑继续时：**先读本文 + `PROJECT_HANDOFF.md`**。  
> 原始 Cursor 对话摘要见 `docs/archive/cursor-chat-2026-07-03-session.md`。

---

## 一句话状态

**站点 live，Amazon 联盟已批，风扇页死链已修并 push。**  
**Reddit 用自由门进不去（网络安全屏蔽），改走 Bing + Quora + Medium。**

| 项目 | 状态 |
|------|------|
| 线上站 | https://hotpicklab.com |
| GitHub | https://github.com/stone13825110136/hotpicklab |
| 最新 commit | `77b1ea6` — 修复风扇 ASIN + 构建前链接校验 |
| Amazon tag | `hotpicklab20-20`（Payoneer + W-8BEN 已配） |
| CapCut Impact | 申请暂停（新站低流量被拒），以后流量起来再申 |

---

## 本会话完成了什么

### 1. 推送链接修复（已部署）

- Commit `77b1ea6` 已 push 到 `main`，Cloudflare 自动部署
- 修复 ASIN：
  - JISULIFE：`B09TBD2P46` → `B0CR3JJJTS`
  - COMLIFE：`B01LL8NE28` → `B0865ZR8DB`
- 新增 `scripts/verify-affiliate-links.mjs`，`npm run build` 前自动校验
- 本地 `npm run verify-links`：6 个 Amazon 链接全部 200

### 2. Amazon 联盟规则（已沟通，供复习）

- 用户点带 `tag=hotpicklab20-20` 的链接 → **24 小时归因窗口**
- 买链接里**同款** → 有佣金
- 买**相似款 / 文内另一款 / 顺手其他 Eligible 商品** → 通常也有佣金
- 佣金按**实际成交 SKU 的品类**算，不是按链接里那一个 ASIN
- `/disclosure` 和页脚已有披露，**不必**每篇指南底部再加（用户明确不要）

### 3. 搜狐文「97年奶爸 300 工具站」解读

- 那是 **AI 批量英文工具站矩阵**（订阅 + AdSense + 联盟）
- HotPick Lab 是 **单品牌站 + 热点选购指南 + 小工具**，路径更稳
- **可借鉴**：每周稳定产出、海外美元、高佣 SaaS 优先、流程标准化
- **别照搬**：300 个站、工具订阅 $9.9、纯 SEO 躺赚、AdSense 当主线

### 4. 国内能不能做

- **人在国内做英文海外站** → 可行（当前架构：Cloudflare 免备案、Payoneer 收款）
- **同一模式做给国内用户** → 要换赛道（淘客/备案/中文），不是 HotPick Lab 延长线
- **没 VPN 也能做**：改代码、push、Bing、Medium（有时）、Amazon 后台

### 5. 自由门 fg805p.zip

- 路径：`C:\Users\1\xwechat_files\stone845533858_6b56\msg\file\2026-07\fg805p.zip`
- 内容：**Freegate 自由门 8.05**（`fg805p.exe`，签名 Valid）
- 用途：Google / Quora / Amazon 后台等；**Reddit 极不稳定**

### 6. Reddit 失败（重要）

- 现象：「你被网络安全屏蔽了」，登录也进不去
- 原因：自由门是**共享代理 IP**，Reddit 整段封
- 已试：登录 → 仍不行
- **替代方案**：
  1. 手机 4G/5G 注册 Reddit（不用自由门）
  2. 或**暂时放弃 Reddit**，用 Bing + Quora + Medium
- 推广文案仍在 `src/data/promote-copy.json`（Quora/Medium 可直接用）

---

## 当前 4 篇指南

| Slug | 变现 | 备注 |
|------|------|------|
| `ai-video-generators-2026` | SaaS（CapCut 待 Impact） | 无现金联盟：Runway/Pika |
| `portable-blenders-amazon-trending` | Amazon | |
| `nintendo-switch-2-accessories` | Amazon | |
| `portable-handheld-fans-amazon-2026` | Amazon | ASIN 已修 |

配套工具：`video-aspect-ratio-calculator`、`gaming-session-timer`、`amazon-prime-day-savings-calculator`

---

## 回家另一台电脑：第一步

```powershell
git clone https://github.com/stone13825110136/hotpicklab.git
cd hotpicklab
npm install
npm run dev
```

**在 Cursor 新对话粘贴：**

```
项目：HotPick Lab — hotpicklab.com
GitHub：stone13825110136/hotpicklab
请先读：
  docs/SESSION_HANDOFF_2026-07-03.md
  docs/PROJECT_HANDOFF.md
  docs/archive/cursor-chat-2026-07-03-session.md
Amazon tag：hotpicklab20-20
Reddit 用自由门进不去，优先 Bing + Quora。
```

---

## 回家优先做（按顺序）

1. **Bing Webmaster**（不用翻墙）  
   https://www.bing.com/webmasters  
   添加 `hotpicklab.com`，提交 sitemap：`https://hotpicklab.com/sitemap.xml`

2. **Quora 发 1 条**（自由门一般可以）  
   文案：`src/data/promote-copy.json` → `quora` 数组  
   运行：`npm run promote quora`

3. **Google Search Console**（需翻墙）  
   https://search.google.com/search-console  
   DNS TXT 验证 + 提交 sitemap

4. **手机流量试 Reddit**（可选）  
   关 WiFi 用 4G 注册；不行就跳过

5. **每周 1–2 新热点**  
   改 `src/data/trends.json` → `git push`

---

## 常用命令

```powershell
npm run dev              # 本地预览
npm run verify-links     # 校验 Amazon 链接
npm run promote          # 推广清单 + 文案
npm run build            # 构建（含链接校验）
git push origin main     # 触发 Cloudflare 部署
```

---

## 关键文件

| 文件 | 用途 |
|------|------|
| `src/data/trends.json` | 热点指南（最常改） |
| `src/data/promote-copy.json` | Reddit/Quora/Medium/X 文案 |
| `src/data/affiliate-checklist.json` | 联盟申请步骤 |
| `scripts/promote-helper.mjs` | `npm run promote` |
| `scripts/verify-affiliate-links.mjs` | 链接 404 检测 |

---

## 待办（仍未做）

- [ ] Bing Webmaster 提交 sitemap
- [ ] GSC 验证 + sitemap（需翻墙）
- [ ] Quora 至少 1 条回答
- [ ] Medium 发 1 篇（可选）
- [ ] CapCut Impact 等流量起来再申
- [ ] privacy.astro 联系邮箱改成真实邮箱
- [ ] 第 2 周再考虑 AdSense

---

*最后更新：2026-07-03 晚*  
*项目所有者：stone13825110136*
