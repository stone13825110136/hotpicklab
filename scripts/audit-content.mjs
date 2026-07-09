#!/usr/bin/env node
/** Quick content sanity checks before deploy. Exit 1 on hard failures. */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const trends = JSON.parse(readFileSync(join(root, 'src/data/trends.json'), 'utf8'));
const faqs = JSON.parse(readFileSync(join(root, 'src/data/trend-faqs.json'), 'utf8'));

const stalePatterns = [
  /Prime Day ran June/i,
  /ended June 26/i,
  /missed it, avoid paying full price/i,
  /post-event/i,
];

let failed = 0;

for (const trend of trends) {
  if (!trend.title || !trend.summary || !trend.slug) {
    console.error(`✗ trend missing title/summary/slug`);
    failed += 1;
  }
  for (const p of trend.products ?? []) {
    if (p.affiliateUrl?.includes('amazon.com') && !p.affiliateUrl.includes('tag=hotpicklab20-20')) {
      console.error(`✗ missing tag: ${trend.slug} → ${p.name}`);
      failed += 1;
    }
  }
  const blob = JSON.stringify({ s: trend.summary, v: trend.verdict?.summary });
  for (const re of stalePatterns) {
    if (re.test(blob) && trend.slug.includes('prime-day')) {
      console.error(`✗ stale Prime Day copy in ${trend.slug}: ${re}`);
      failed += 1;
    }
  }
}

for (const [slug, items] of Object.entries(faqs)) {
  if (slug.startsWith('_')) continue;
  if (!trends.some((t) => t.slug === slug)) {
    console.error(`✗ FAQ orphan slug (no trend): ${slug}`);
    failed += 1;
  }
  for (const item of items) {
    for (const re of stalePatterns) {
      if (re.test(item.answer ?? '')) {
        console.error(`✗ stale FAQ (${slug}): ${item.question}`);
        failed += 1;
      }
    }
  }
}

if (failed > 0) {
  console.error(`\n${failed} content audit issue(s).`);
  process.exit(1);
}

console.log(`Content audit OK — ${trends.length} trends, ${Object.keys(faqs).filter((k) => !k.startsWith('_')).length} FAQ groups.`);
