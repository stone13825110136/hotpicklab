# HotPickLab — Naming Lab 数据来源

**站点：** hotpicklab.com  
**配套策划：** [NAMING-LAB-PLAN.md](./NAMING-LAB-PLAN.md)  
**更新日期：** 2026-07-25  

原则：**不闭门造车**；优先公开/开源数据；注明许可与署名；不把竞品专有库当开源。

---

## Phase 1｜宠物名

| 来源 | 类型 | 许可/性质 | 用法 |
|------|------|-----------|------|
| [NYC Dog Licensing Dataset](https://data.cityofnewyork.us/Health/NYC-Dog-Licensing-Dataset/nu7n-tubp) | 市政开放数据（名/性别/品种） | 政府开放数据 | **主库**：频率 → popularity / gender / breed |
| [sindresorhus/dog-names](https://github.com/sindresorhus/dog-names) | Top 流行狗名 JSON | MIT | 种子 + 流行对照 |
| [sindresorhus/cat-names](https://github.com/sindresorhus/cat-names) | 流行猫名 JSON | MIT | 猫名 v1 主种子（市政猫数据少） |
| [jgolbeck/petnames](https://github.com/jgolbeck/petnames) | 众包脏数据 | 研究可用（保留原 README） | 补充怪名，不当主源 |
| AKC / Rover 年度 Top | 新闻稿级榜单 | **非完整开源库** | 少量「trending」标签；**禁止整站扒库** |

**勿用错：** `fregante/pet-names` = 情侣昵称，不是动物名。

**清洗：** 去掉 `UNKNOWN` / `NAME NOT PROVIDED`、脏话、异常超长串。

---

## Phase 2｜人名

| 来源 | 内容 | 许可 | 用法 |
|------|------|------|------|
| [SSA names.zip](https://www.ssa.gov/oact/babynames/names.zip) | 美国姓名/性别/次数（1880–） | 公有领域倾向（data.gov 标 CC0） | **美式人名主库** |
| [hackerb9/ssa-baby-names](https://github.com/hackerb9/ssa-baby-names) | 下载与处理脚本 | 开源脚本 | 更新流水线 |
| [ONS Baby names (E&W)](https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths/datasets/babynamesinenglandandwalesfrom1996) | 英式排名与计数 | 官方统计（遵守引用条款） | UK 风格包 |

---

## Phase 3｜公司名

| 来源 | 用途 | 限制 |
|------|------|------|
| [s-celles/unique-names-data](https://github.com/s-celles/unique-names-data) | 形容词/颜色/动物等词表 | 生成积木，不是成品公司名列表 |
| [osmlab/name-suggestion-index](https://github.com/osmlab/name-suggestion-index) | 真实品牌索引 | **仅避撞黑名单**，不输出为可起名 |
| [Namera](https://github.com/siddmax/Namera) | 域名/商标筛选与打分思路 | 学 Practical 分；不必整套搬 |
| Unique Domains GitHub extract | 可售域名样本 | 营销摘录，不当词库 |

公司名 **没有**「Namelix 开源词库」→ 词表组合 + 避撞 + 域名检查。

---

## Fortune Draw｜塔牌（免费，不接付费 API）

| 来源 | 内容 | 许可 | 费用 |
|------|------|------|------|
| [Tarotoo tarot dataset](https://github.com/Tarotoo-com/tarotoo-tarot-dataset) / npm `tarotoo-tarot` | 78 牌 JSON 牌意 | **MIT**（以当前 npm 包为准；商用保留署名链接） | **免费** |
| npm/PyPI `tarotoo-tarot` | 同上封装 | 包装许可以仓库为准 | **免费** |
| 自写短牌意词库 | 自有文案 | 自有 | **免费**，无署名义务 |
| 第三方付费塔牌 API | — | — | **不做** |

用法：名字稳定哈希 → 映射牌意 → 改写为 naming vibe；页脚若用 Tarotoo 则署名。

---

## 推荐数据栈

```
Pet Lab     → NYC freq + dog/cat-names (MIT) + Tarotoo/自写牌意
People Lab  → SSA (+ ONS UK) + 同一 Fortune 层
Business Lab→ unique-names-data 组合 + NSI 避撞 + .com；Fortune 可关
```

---

## 合规清单

- [x] 开源库保留 LICENSE / 署名（`src/data/naming/ATTRIBUTION.md` + `licenses/`）
- [x] Tarotoo：页脚 / Attribution 署名（MIT 包 `tarotoo-tarot`；页内链到 open-data）
- [ ] AKC/Rover：仅公开 Top 作趋势，不镜像其库（Phase 1 未用）
- [ ] 公司名输出过滤知名品牌（NSI）（Phase 3）
- [x] Fortune 文案标明 entertainment only

## 构建命令

```bash
npm run build-naming-data   # 从 node_modules 开源包 +（可选）NYC API 生成 JSON
```

依赖：`dog-names`、`cat-names`、`tarotoo-tarot`（见 `package.json`）。
