#!/usr/bin/env node
/** Check which ASINs return real Amazon product photos vs 1x1 placeholder GIF. */

const ASINS = [
  'B0D3VQ2YLG', 'B0017XHSC2', 'B0DRCKDWD1', 'B0DRV6H6VM',
  'B0CR3JJJTS', 'B0865ZR8DB', 'B09B8V1LZ3', 'B00FLYWNYQ',
  'B0CRMYT2WC', 'B085DVNHHK', 'B08M8VFJ2Z', 'B09HWD3FZN',
  'B0BNTL3Q2C', 'B07GVDXW5D', 'B088ZN47V8', 'B0BYSKX3BX',
];

for (const asin of ASINS) {
  const url = `https://m.media-amazon.com/images/P/${asin}.01._SL500_.jpg`;
  const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
  const len = Number(res.headers.get('content-length') || 0);
  const type = res.headers.get('content-type') || '';
  const ok = res.ok && type.includes('jpeg') && len > 1000;
  console.log(JSON.stringify({ asin, ok, len, type }));
}
