# 沟通记录归档说明

本目录保存与本项目相关的 Cursor 对话原始记录。

## 文件

| 文件 | 说明 |
|------|------|
| `cursor-chat-hotpicklab-project.jsonl` | （可选）Cursor 原始 JSONL，未纳入仓库 |
| `CONVERSATION_LOG.md` | **完整沟通记录可读版（推荐）** |

## 如何阅读 JSONL

每行一条 JSON，包含 `role`（user/assistant）和 `message`。

- 用 VS Code / Cursor 打开即可
- 或搜索 `"user_query"` 快速定位你的提问
- 结构化摘要见上级目录 `PROJECT_HANDOFF.md`

## 对话涵盖的关键决策

1. 一人公司做流量站是否可行 → 可行，要垂直+差异化
2. 国内 vs 国外 → 选国外（免备案，AdSense/Amazon）
3. 工具站 vs 导购站 vs 热点站 → **热点+高佣金站**
4. 域名选定 → **hotpicklab.com**
5. 建站脚手架 → Astro 静态站 TrendPulse/HotPick Lab
6. 3 个示例热点页 + 推广文案
7. GitHub 上传 → stone13825110136/hotpicklab

## 给 AI 的提示

在新 Cursor 对话中：

```
请先阅读 docs/PROJECT_HANDOFF.md 和 docs/archive/cursor-chat-hotpicklab-project.jsonl
项目核心原则：热点 + 赚钱
```
