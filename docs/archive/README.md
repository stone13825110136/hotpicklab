# 沟通记录归档说明

本目录保存与本项目相关的 Cursor 对话原始记录（**已脱敏，不含密码/API Token**）。

## 文件

| 文件 | 说明 |
|------|------|
| `cursor-chat-2026-07-02-deploy-reposition.jsonl` | 7-02 会话原始 JSONL（部署 + 改版） |
| `cursor-chat-2026-07-03-session.md` | 7-03 白天会话摘要 |
| `cursor-chat-2026-07-03-evening-onward.jsonl` | **7-03 晚～7-06 原始 JSONL**（新热点 / 雷达 / 收录 / 国内线） |
| `cursor-chat-2026-07-03-evening-onward-session.md` | 同上时段可读摘要 |
| `CONVERSATION_LOG.md` | 全项目关键决策可读摘要 |
| `../SESSION_HANDOFF_2026-07-06.md` | **最新交接** — 换电脑先看 |
| `../SESSION_HANDOFF_2026-07-02.md` | 7-02 交接（历史） |

## 如何阅读 JSONL

每行一条 JSON，包含 `role`（user/assistant）和 `message`。

- 用 VS Code / Cursor 打开即可
- 搜索 `"user_query"` 快速定位你的提问
- 结构化摘要见 `../PROJECT_HANDOFF.md` 和 `../SESSION_HANDOFF_2026-07-02.md`

## 给 AI 的提示（换电脑复制）

```
请先阅读：
docs/SESSION_HANDOFF_2026-07-02.md
docs/PROJECT_HANDOFF.md
docs/archive/cursor-chat-2026-07-02-deploy-reposition.jsonl

项目：HotPick Lab (hotpicklab.com)
公开站面向客户（热点选购指南 + 免费工具），佣金策略只在 trends-ops.json，不上网站。
```
