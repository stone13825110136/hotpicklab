#!/usr/bin/env node
/** Ping IndexNow (Bing/Yandex) after new pages go live. */

const HOST = 'hotpicklab.com';
const KEY = '8f3a2b1c9d4e5f60718293a4b5c6d7e8';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/trends/ai-video-generators-2026`,
  `https://${HOST}/trends/portable-blenders-amazon-trending`,
  `https://${HOST}/trends/nintendo-switch-2-accessories`,
  `https://${HOST}/trends/portable-handheld-fans-amazon-2026`,
  `https://${HOST}/tools/video-aspect-ratio-calculator`,
  `https://${HOST}/tools/gaming-session-timer`,
  `https://${HOST}/tools/amazon-prime-day-savings-calculator`,
];

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  }),
});

console.log('IndexNow status:', res.status, res.statusText);
if (!res.ok) {
  const text = await res.text().catch(() => '');
  console.error(text);
  process.exit(1);
}
console.log('Pinged', URLS.length, 'URLs');
