#!/usr/bin/env node
/**
 * Merge approved radar candidates into trends.json (draft fields).
 * Usage: node scripts/publish-radar.mjs 2026-07-03 1,3,5
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const date = process.argv[2];
const idsArg = process.argv[3];

if (!date || !idsArg) {
  console.error('Usage: node scripts/publish-radar.mjs YYYY-MM-DD 1,3,5');
  process.exit(1);
}

const ids = new Set(idsArg.split(/[,\s]+/).map((n) => Number(n.trim())));
const radarPath = join(process.cwd(), 'radar', 'pending', `${date}.json`);
const trendsPath = join(process.cwd(), 'src', 'data', 'trends.json');

const radar = JSON.parse(await readFile(radarPath, 'utf8'));
const trends = JSON.parse(await readFile(trendsPath, 'utf8'));

const picked = radar.candidates.filter((c) => ids.has(c.id));
if (picked.length === 0) {
  console.error('No matching candidates for ids:', [...ids]);
  process.exit(1);
}

for (const c of picked) {
  const exists = trends.some((t) => t.slug === c.suggestedSlug);
  if (exists) {
    console.warn(`Skip duplicate slug: ${c.suggestedSlug}`);
    continue;
  }

  trends.push({
    slug: c.suggestedSlug,
    title: `${c.title} — Hot Pick (${new Date().getFullYear()})`,
    category: c.category,
    trendScore: c.score,
    searchVolume: 'rising',
    updated: date,
    summary: `Trending now: ${c.title}. Quick guide with pros, cons, and top picks.`,
    whyHot: c.reason,
    commissionType: c.commissionHint?.includes('saas') ? 'saas-affiliate' : 'amazon-associates',
    commissionNote: c.commissionHint,
    whoItsFor: ['US shoppers comparing options before buying', 'Readers who want a fast answer, not a long review'],
    whoShouldSkip: ['You need in-depth lab testing — this is a quick trend guide'],
    buyerPitfalls: ['Trend hype fades fast — double-check current price and reviews on Amazon'],
    keywords: [c.keyword, `${c.keyword} 2026`, `best ${c.keyword}`].slice(0, 3),
    products: [
      {
        name: 'Top pick — update after Amazon search',
        tag: 'Trending',
        price: 'See Amazon',
        pros: ['Currently trending', 'Check latest reviews'],
        cons: ['Verify fit for your needs'],
        affiliateUrl: `https://www.amazon.com/s?k=${encodeURIComponent(c.keyword)}&tag=hotpicklab20-20`,
        affiliateNote: 'Replace with direct /dp/ link from Associates',
      },
    ],
    relatedTool: null,
    promoteOn: c.source.includes('reddit') ? ['Reddit', 'X'] : ['Reddit r/AmazonFinds', 'X'],
    status: 'hot',
  });
}

await writeFile(trendsPath, JSON.stringify(trends, null, 2) + '\n', 'utf8');
console.log(`Published ${picked.length} trend(s) to trends.json`);
