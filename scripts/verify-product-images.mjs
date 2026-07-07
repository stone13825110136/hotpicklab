#!/usr/bin/env node
/** Fail build when any trends.json Amazon ASIN lacks a real hiRes product photo. */

import { getTrendAmazonAsins, loadAmazonProductImages, loadLocalImageFallbackAsins } from './lib/amazon-catalog.mjs';

const MIN_BYTES = 1000;
const asins = getTrendAmazonAsins();
const images = loadAmazonProductImages();
const svgFallbackAsins = loadLocalImageFallbackAsins();

console.log(`Checking ${asins.length} Amazon product images...\n`);

let failed = 0;
for (const asin of asins) {
  const url = images[asin];
  if (!url) {
    if (svgFallbackAsins.has(asin)) {
      console.log(`⚠ ${asin} — no hiRes yet; SVG fallback (run scrape-images on VPN or deploy via Cloudflare)`);
      continue;
    }
    console.error(`✗ ${asin} — missing in amazon-product-images.json (run: npm run scrape-images)`);
    failed++;
    continue;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0', Range: 'bytes=0-2047' },
      redirect: 'follow',
    });
    const buf = Buffer.from(await res.arrayBuffer());
    const type = res.headers.get('content-type') ?? '';
    const ok = res.ok && type.includes('image') && buf.length >= MIN_BYTES;
    if (ok) {
      console.log(`✓ ${asin}`);
    } else {
      console.error(`✗ ${asin} — bad image (${res.status}, ${type}, ${buf.length} bytes)`);
      failed++;
    }
  } catch (err) {
    console.error(`✗ ${asin} — ${err.message ?? err}`);
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} product image(s) failed. US shoppers see blank boxes — fix before deploy.`);
  process.exit(1);
}

console.log('\nAll product images are real and reachable.');
