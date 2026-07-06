# 转化优化改版 — 待你审核（2026-07-06）

> **未 push。** 本地 build 已通过。你确认后再 `git push`。

---

## 改了什么（4 项）

| 项 | 改动 |
|----|------|
| **P0 Prime Day** | Verdict 从 **Wait → Buy**；文案改为「Prime Day 当周（约 7/14–16）价格到位就买」 |
| **P1 星级/评论** | 16 个 Amazon 产品均显示 **★ 评分 + 评论数**（2026-07-06 从 Amazon 页抓取） |
| **P2 商品图** | 优先用 **Amazon 官方商品图**（CDN）；加载失败则回退 SVG |
| **P3 按钮文案** | `View pricing →` 改为 `Check Echo Pop price on Amazon →` 等场景句 |

---

## 本地预览（请先审这 3 页）

```powershell
cd d:\做网站挣钱\trendpulse
npm run dev
```

浏览器打开：

1. **Prime Day（重点）**  
   http://localhost:4321/trends/amazon-prime-day-deals-worth-it-2026/

2. **手持风扇（Buy 范例）**  
   http://localhost:4321/trends/portable-handheld-fans-amazon-2026/

3. **Stanley vs Owala**  
   http://localhost:4321/trends/stanley-owala-water-bottles-worth-it-2026/

---

## Prime Day 文案变化

**Before — Verdict: Wait**
> Wait to buy until Prime Day week — but start now: pick one or two items…

**After — Verdict: Buy**
> Buy during Prime Day week (~July 14–16) when the price hits your target — Echo Pop and Instant Pot are our watchlist picks. Use the savings calculator before checkout…

---

## 产品块新增示例（Echo Pop）

```
★★★★★ 4.7 · 43k Amazon ratings
Typical price: Often ~$20–35 on sale
[ Check Echo Pop price on Amazon → ]
```

+ 商品图为 Amazon 实拍风（非 SVG 图标）

---

## 新增/修改文件

| 文件 | 作用 |
|------|------|
| `src/lib/amazon-product-meta.ts` | ASIN → 评分、评论数、CTA 短名 |
| `src/components/ProductSocialProof.astro` | 星级展示组件 |
| `src/lib/product-images.ts` | Amazon 图优先 + SVG 回退 |
| `src/pages/trends/[slug].astro` | 接入评分 + 新 CTA |
| `src/data/trends.json` | Prime Day 文案/verdict |
| `scripts/fetch-amazon-meta.mjs` | 以后可重跑更新评分 |

---

## 审核清单

- [ ] Prime Day 页 Verdict 显示 **Buy**（蓝色标签）
- [ ] Echo Pop / Instant Pot 有 **Amazon 商品图**（不是彩色 SVG）
- [ ] 每个 Amazon 产品有 **星级 + 评论数**
- [ ] 按钮是 **Check … price on Amazon →**
- [ ] 语气仍然诚实（没有假 urgency）

---

## 你确认后

回复「可以 push」，我会：

1. `git push origin main`
2. `npm run indexnow`
3. 可选：Bing 再提交 Prime Day URL

---

## 备注

- **BlendJet** 当前 ASIN 页仅 **82 条评论**（Amazon 返回数据，可能是新变体页）
- **NewAir 制冰机** 评论数页面未完整返回，暂用 **3.2k（approx.）**
- 国内预览 Amazon 图片可能空白 → 回退 SVG；**美国访客正常显示**
