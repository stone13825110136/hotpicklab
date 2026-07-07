#!/usr/bin/env node
/** Scrape hiRes image URLs for every Amazon ASIN in trends.json → amazon-product-images.json */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTrendAmazonAsins } from './lib/amazon-catalog.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/amazon-product-images.json');
const UA = 'Mozilla/5.0 (compatible; HotPickLab-LinkCheck/1.0)';

const existing = JSON.parse(readFileSync(OUT, 'utf8'));
const asins = getTrendAmazonAsins();
const out = { _note: existing._note ?? 'Real Amazon hiRes photos for every ASIN in trends.json. Refresh: npm run scrape-images' };

let failed = 0;
for (const asin of asins) {
  if (existing[asin] && process.argv.includes('--missing-only')) {
    out[asin] = existing[asin];
    continue;
  }

  let html = '';
  let status = 0;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(`https://www.amazon.com/dp/${asin}`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US' },
    });
    status = res.status;
    html = await res.text();
    if (html.length > 20_000) break;
    await new Promise((r) => setTimeout(r, attempt * 2000));
  }

  const url =
    html.match(/"hiRes":"(https:[^"]+)"/)?.[1] ??
    html.match(/"large":"(https:[^"]+)"/)?.[1] ??
    html.match(/property="og:image" content="([^"]+)"/)?.[1];

  if (!url) {
    console.error(`✗ ${asin} — no image found (HTTP ${status})`);
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
