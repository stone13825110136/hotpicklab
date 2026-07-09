#!/usr/bin/env node
/** Verify affiliate URLs in trends.json before deploy. Exit 1 if any fail. */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const trends = JSON.parse(readFileSync(join(__dirname, '../src/data/trends.json'), 'utf8'));

const TIMEOUT_MS = 20_000;
const UA = 'Mozilla/5.0 (compatible; HotPickLab-LinkCheck/1.0)';
const AMAZON_TAG = 'hotpicklab20-20';

/** Verify product page only — never fetch tagged URLs (counts as affiliate clicks). */
function amazonVerifyUrl(affiliateUrl) {
  const asin = affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/i)?.[1];
  if (!asin) return null;
  return `https://www.amazon.com/dp/${asin}`;
}

function hasAffiliateTag(affiliateUrl) {
  try {
    const u = new URL(affiliateUrl);
    return u.searchParams.get('tag') === AMAZON_TAG;
  } catch {
    return affiliateUrl.includes(`tag=${AMAZON_TAG}`);
  }
}

async function checkUrl(name, url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': UA },
    });
    clearTimeout(timer);
    const html = await res.text();
    const dead =
      html.includes('Page Not Found') ||
      html.includes('dogs of Amazon') ||
      html.includes('Sorry! We couldn');
    const ok = res.status >= 200 && res.status < 400 && !dead;
    return { name, url, status: res.status, ok, finalUrl: res.url, deadPage: dead };
  } catch (err) {
    clearTimeout(timer);
    return { name, url, status: 0, ok: false, error: String(err.message ?? err) };
  }
}

const jobs = [];
let tagMissing = 0;
for (const trend of trends) {
  for (const product of trend.products) {
    const affiliateUrl = product.affiliateUrl;
    if (!affiliateUrl?.includes('amazon.com/dp/')) continue;

    if (!hasAffiliateTag(affiliateUrl)) {
      tagMissing += 1;
      console.log(`✗ MISSING TAG  ${trend.slug} → ${product.name}`);
      console.log(`        ${affiliateUrl}`);
      continue;
    }

    const verifyUrl = amazonVerifyUrl(affiliateUrl);
    if (!verifyUrl) {
      tagMissing += 1;
      console.log(`✗ BAD ASIN  ${trend.slug} → ${product.name}`);
      console.log(`        ${affiliateUrl}`);
      continue;
    }

    jobs.push(checkUrl(`${trend.slug} → ${product.name}`, verifyUrl));
  }
}

if (tagMissing > 0) {
  console.error(`\n${tagMissing} Amazon link(s) missing tag=${AMAZON_TAG} or ASIN.`);
  process.exit(1);
}

console.log(`Checking ${jobs.length} Amazon product pages (tag stripped — no click tracking)...\n`);
const results = await Promise.all(jobs);

let failed = 0;
for (const r of results) {
  if (r.ok) {
    console.log(`✓ ${r.status}  ${r.name}`);
  } else {
    failed += 1;
    console.log(`✗ FAIL  ${r.name}`);
    console.log(`        ${r.url}`);
    if (r.error) console.log(`        ${r.error}`);
    else if (r.deadPage) console.log(`        Amazon 404 / product not found`);
    else console.log(`        HTTP ${r.status}`);
  }
}

console.log('');
if (failed > 0) {
  console.error(`${failed} link(s) failed. Fix trends.json before push.`);
  process.exit(1);
}
console.log('All Amazon product pages reachable from this network.');
console.log('Note: verified without affiliate tag to avoid inflating Associates clicks.');
console.log('Note: amazon.com may still be blocked inside China — links target US shoppers.');
