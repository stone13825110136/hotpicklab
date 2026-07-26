#!/usr/bin/env node
/** Ping IndexNow (Bing/Yandex) after new pages go live. */

const HOST = 'hotpicklab.com';
const KEY = '8f3a2b1c9d4e5f60718293a4b5c6d7e8';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/tools/`,
  `https://${HOST}/tools/pet-name-lab/`,
  `https://${HOST}/disclosure/`,
  `https://${HOST}/privacy/`,
  `https://${HOST}/sitemap.xml`,
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
