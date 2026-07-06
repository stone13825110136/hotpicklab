#!/usr/bin/env node
const fail = ['B0D3VQ2YLG', 'B0DRCKDWD1', 'B0DRV6H6VM', 'B0BNTL3Q2C', 'B07GVDXW5D', 'B088ZN47V8', 'B0BYSKX3BX'];

for (const asin of fail) {
  const res = await fetch(`https://www.amazon.com/dp/${asin}`, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US' },
  });
  const html = await res.text();
  const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  const hiRes = html.match(/"hiRes":"(https:[^"]+)"/)?.[1];
  const large = html.match(/"large":"(https:[^"]+)"/)?.[1];
  console.log(JSON.stringify({ asin, og, hiRes: hiRes ?? large }));
}
