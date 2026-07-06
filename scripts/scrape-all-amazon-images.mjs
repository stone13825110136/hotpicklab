#!/usr/bin/env node
/** Scrape hiRes image URLs for all Amazon ASINs in trends.json */

const ASINS = [
  'B0D3VQ2YLG', 'B0017XHSC2', 'B0DRCKDWD1', 'B0DRV6H6VM',
  'B0CR3JJJTS', 'B0865ZR8DB', 'B09B8V1LZ3', 'B00FLYWNYQ',
  'B0CRMYT2WC', 'B085DVNHHK', 'B08M8VFJ2Z', 'B09HWD3FZN',
  'B0BNTL3Q2C', 'B07GVDXW5D', 'B088ZN47V8', 'B0BYSKX3BX',
];

const out = {};
for (const asin of ASINS) {
  const res = await fetch(`https://www.amazon.com/dp/${asin}`, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US' },
  });
  const html = await res.text();
  const url =
    html.match(/"hiRes":"(https:[^"]+)"/)?.[1] ??
    html.match(/"large":"(https:[^"]+)"/)?.[1] ??
    html.match(/property="og:image" content="([^"]+)"/)?.[1];
  if (url) out[asin] = url.replace(/\\u0026/g, '&');
  else console.error('missing', asin);
}
console.log(JSON.stringify(out, null, 2));
