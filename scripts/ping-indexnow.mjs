#!/usr/bin/env node
/** Ping IndexNow (Bing/Yandex) after new pages go live. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HOST = 'hotpicklab.com';
const KEY = '8f3a2b1c9d4e5f60718293a4b5c6d7e8';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const trends = JSON.parse(readFileSync(join(root, 'src/data/trends.json'), 'utf8'));
const tools = JSON.parse(readFileSync(join(root, 'src/data/tools.json'), 'utf8'));

const staticPaths = ['', '/trends', '/tools', '/about', '/methodology', '/how-we-find-trends', '/spot-a-trend', '/privacy', '/disclosure'];
const URLS = [
  ...staticPaths.map((p) => `https://${HOST}${p || '/'}`),
  ...trends.map((t) => `https://${HOST}/trends/${t.slug}`),
  ...tools.map((t) => `https://${HOST}/tools/${t.slug}`),
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
