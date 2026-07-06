#!/usr/bin/env node
/** One-off: scrape rating/review count from Amazon product pages (en-US). */

const ASINS = [
  'B0D3VQ2YLG', 'B0017XHSC2', 'B0DRCKDWD1', 'B0DRV6H6VM',
  'B0CR3JJJTS', 'B0865ZR8DB', 'B09B8V1LZ3', 'B00FLYWNYQ',
  'B0CRMYT2WC', 'B085DVNHHK', 'B08M8VFJ2Z', 'B09HWD3FZN',
  'B0BNTL3Q2C', 'B07GVDXW5D', 'B088ZN47V8', 'B0BYSKX3BX',
];

for (const asin of ASINS) {
  const res = await fetch(`https://www.amazon.com/dp/${asin}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  const html = await res.text();
  const rating =
    html.match(/"ratingValue":"([\d.]+)"/)?.[1] ??
    html.match(/([\d.]+) out of 5 stars/i)?.[1];
  const reviewCount =
    html.match(/"ratingCount":"([\d,]+)"/)?.[1]?.replace(/,/g, '') ??
    html.match(/([\d,]+)\s+ratings/i)?.[1]?.replace(/,/g, '');
  console.log(JSON.stringify({ asin, status: res.status, rating, reviewCount }));
}
