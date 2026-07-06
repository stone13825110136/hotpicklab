#!/usr/bin/env node
/** Scrape hiRes image URLs for every Amazon ASIN in trends.json → amazon-product-images.json */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTrendAmazonAsins } from './lib/amazon-catalog.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/amazon-product-images.json');

const existing = JSON.parse(readFileSync(OUT, 'utf8'));
const asins = getTrendAmazonAsins();
const out = { _note: existing._note ?? 'Real Amazon hiRes photos for every ASIN in trends.json. Refresh: npm run scrape-images' };

let failed = 0;
for (const asin of asins) {
  if (existing[asin] && process.argv.includes('--missing-only')) {
    out[asin] = existing[asin];
    continue;
  }

  const res = await fetch(`https://www.amazon.com/dp/${asin}`, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US' },
  });
  const html = await res.text();
  const url =
    html.match(/"hiRes":"(https:[^"]+)"/)?.[1] ??
    html.match(/"large":"(https:[^"]+)"/)?.[1] ??
    html.match(/property="og:image" content="([^"]+)"/)?.[1];

  if (!url) {
    console.error(`✗ ${asin} — no image found (HTTP ${res.status})`);
    failed++;
    if (existing[asin]) {
      out[asin] = existing[asin];
      console.log(`  kept previous URL for ${asin}`);
    }
    continue;
  }

  out[asin] = url.replace(/\\u0026/g, '&');
  console.log(`✓ ${asin}`);
}

writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
console.log(`\nWrote ${asins.length} ASINs to src/data/amazon-product-images.json`);
if (failed) process.exit(1);
