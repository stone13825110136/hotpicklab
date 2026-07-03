# Cursor 对话摘要归档（2026-07-03）

> 脱敏摘要，便于换电脑后 AI 续接上下文。非逐字 transcript。

---

## 用户背景

- 国内一人运营，Cursor + 微信雷达
- 项目路径：`d:\做网站挣钱\trendpulse`
- GitHub：`stone13825110136/hotpicklab`
- 域名：https://hotpicklab.com

---

## 对话 1：推送链接修复

**用户：** HotPick Lab 若还没 push 链接修复，push 一下。

**结果：**
- 本地领先 origin 1 commit：`77b1ea6`
- 已 push 到 `main`
- `npm run verify-links` 6/6 通过
- 修复风扇页死 ASIN（JISULIFE、COMLIFE）

---

## 对话 2：Amazon 佣金规则

**用户问：** 客户打开链接进 Amazon，点同款买，有佣金吗？

**答：** 有。24 小时归因窗口内，通过 tag 进来的 Eligible 购买通常计佣。

**用户问：** 买了相似款算不算？

**答：** 通常算。链接是「进门钥匙」，不是锁死 ASIN。佣金按实际 SKU 品类算。

**用户要：** 按三篇 Amazon 指南举例说明 → 已按风扇/榨汁机/Switch 三篇场景说明。

---

## 对话 3：Affiliate Disclosure

**用户问：** 是什么意思？

**答：** 联盟链接声明，告知读者链接可能带来佣金。站已有 `/disclosure` 和页脚链接。

**助手曾提议：** 每篇指南底部再加一句 → **用户拒绝：「不用搞，没有价值」**。

---

## 对话 4：搜狐文解读

**链接：** sohu.com 文章 — 97年奶爸 AI 批量 300 英文工具站

**解读要点：**
- 模式：程序化 SEO + 工具站矩阵 + 订阅/AdSense/联盟
- HotPick Lab 差异：单站、热点指南+工具、联盟优先
- 国内：人在国内做海外站可行；做国内用户要换淘客赛道
- 不学 300 站、不学订阅、Reddit/SEO 不能单靠

---

## 对话 5：自由门 fg805p.zip

**用户：** C 盘微信文件 `fg805p.zip` 能否访问推广站？

**结论：**
- 文件 = Freegate 8.05（`fg805p.exe`，签名 Valid）
- 连上后可访问 Google/Quora/Amazon 后台等
- 已整理翻墙站点清单（Reddit/Quora/X/GSC/Amazon/Impact 等）

---

## 对话 6：Reddit 进不去

**现象：** Reddit 页「你被网络安全屏蔽了」，登录也不行。

**原因：** 自由门共享代理 IP，Reddit 整段封。

**建议：**
- 手机 4G 注册 Reddit（不用自由门）
- 或放弃 Reddit，改 Bing + Quora + Medium
- 建站/push/Amazon 不依赖 Reddit

**用户：** 还是登录不进去 → 确认 Freegate+Reddit 组合基本不可行。

---

## 对话 7：打包 GitHub 换电脑

**用户：** 把文件和聊天记录打包到 GitHub，回家另一台电脑继续。

**动作：** 本归档 + SESSION_HANDOFF_2026-07-03.md + 更新 PROJECT_HANDOFF / EXECUTION_CHECKLIST → commit push。

---

## 技术状态快照

```
main @ 77b1ea6
Amazon Associates: active, tag hotpicklab20-20
CapCut Impact: paused (marketplace rejected low traffic)
4 guides live, 3 tools
verify-links: 6 Amazon URLs OK
Reddit: blocked via Freegate — use alternatives
```

---

## 下一会话建议开场

见 `docs/SESSION_HANDOFF_2026-07-03.md` 中「在 Cursor 新对话粘贴」块。
