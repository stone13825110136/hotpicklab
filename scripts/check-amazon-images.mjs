#!/usr/bin/env node
/** Check which ASINs return real Amazon product photos vs 1x1 placeholder GIF. */

import { getTrendAmazonAsins } from './lib/amazon-catalog.mjs';

for (const asin of getTrendAmazonAsins()) {
  const url = `https://m.media-amazon.com/images/P/${asin}.01._SL500_.jpg`;
  const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
  const len = Number(res.headers.get('content-length') || 0);
  const type = res.headers.get('content-type') || '';
  const ok = res.ok && type.includes('jpeg') && len > 1000;
  console.log(JSON.stringify({ asin, ok, len, type }));
}
