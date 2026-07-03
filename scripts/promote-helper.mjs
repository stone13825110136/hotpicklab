#!/usr/bin/env node
/**
 * HotPick Lab promotion helper — no VPN required for most tasks.
 * Usage:
 *   npm run promote              weekly checklist + site stats
 *   npm run promote checklist
 *   npm run promote quora [0|1|2|3]
 *   npm run promote reddit [0|1|2|3]
 *   npm run promote medium
 *   npm run promote bing           Bing / IndexNow URL list
 *   npm run promote indexnow       ping IndexNow (needs network)
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const copy = JSON.parse(readFileSync(join(root, 'src/data/promote-copy.json'), 'utf8'));
const trends = JSON.parse(readFileSync(join(root, 'src/data/trends.json'), 'utf8'));

const cmd = process.argv[2] ?? 'help';
const arg = process.argv[3];

function hr(title) {
  console.log('\n' + '─'.repeat(56));
  console.log(title);
  console.log('─'.repeat(56));
}

function copyToClipboard(text) {
  if (process.platform === 'win32') {
    try {
      execSync('clip', { input: text });
      console.log('\n✓ Copied to clipboard (Windows)\n');
      return;
    } catch {
      /* fall through */
    }
  }
  console.log('\n(Copy the block above manually)\n');
}

const WEEKLY_CHECKLIST = `
HotPick Lab — 每周推广清单（无 VPN 版）
============================================

每天
  □ 08:00 看微信雷达推送
  □ 有好热点 → 告诉 Cursor「发布雷达 日期 第N条」

每周一（20 分钟）
  □ npm run promote bing → 在 Bing Webmaster 提交新 URL
  □ 或 npm run promote indexnow

每周二（30 分钟）
  □ 试打开 https://medium.com → 能开就 npm run promote medium

每周三
  □ 确认 Amazon Associates 后台有无 clicks

每周四
  □ 加 1 篇指南（雷达 或 让我写 Amazon 热点）

每周五
  □ Cloudflare Analytics 看本周访问量

有 VPN 后额外做
  □ Google Search Console 提交 sitemap
  □ npm run promote reddit 0 → 发 r/AmazonFinds
  □ npm run promote quora 0 → 粘贴回答

Bing 站长（国内一般能开）
  https://www.bing.com/webmasters

Amazon 后台
  https://affiliate-program.amazon.com

站点
  https://hotpicklab.com
`;

function showChecklist() {
  hr('Weekly checklist (no VPN)');
  console.log(WEEKLY_CHECKLIST);
  console.log(`Live guides: ${trends.length}`);
  trends.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.title}`);
    console.log(`     https://hotpicklab.com/trends/${t.slug}/`);
  });
}

function showQuora(index = 0) {
  const items = copy.quora ?? [];
  const i = Number(index);
  const item = items[i];
  if (!item) {
    console.error(`No quora item at index ${i}. Available: 0-${items.length - 1}`);
    process.exit(1);
  }
  hr(`Quora — search: "${item.searchQuery}"`);
  console.log('1. Open https://www.quora.com (needs VPN in China)');
  console.log(`2. Search: ${item.searchQuery}`);
  console.log('3. Pick a question with many answers → Answer');
  console.log('4. Paste this:\n');
  console.log(item.answer);
  copyToClipboard(item.answer);
}

function showReddit(index = 0) {
  const items = copy.posts ?? [];
  const i = Number(index);
  const post = items[i];
  if (!post) {
    console.error(`No reddit post at index ${i}. Available: 0-${items.length - 1}`);
    process.exit(1);
  }
  hr(`Reddit — ${post.subreddits.join(', ')}`);
  console.log('1. Connect VPN → https://www.reddit.com');
  console.log(`2. Post to ONE subreddit: ${post.subreddits[0]}`);
  console.log(`3. Title:\n${post.title}\n`);
  console.log(`4. Body:\n${post.body}`);
  copyToClipboard(`${post.title}\n\n${post.body}`);
}

function showMedium() {
  const m = copy.medium;
  if (!m) {
    console.error('No medium copy in promote-copy.json');
    process.exit(1);
  }
  hr('Medium article (try without VPN)');
  console.log('1. Open https://medium.com/new-story');
  console.log(`2. Title:\n${m.title}\n`);
  console.log(`3. Body:\n${m.body}`);
  copyToClipboard(`${m.title}\n\n${m.body}`);
}

function showBing() {
  const urls = copy.bingUrlSubmission ?? [];
  hr('Bing URL submission list');
  console.log('Bing Webmaster → URL Submission → Submit URLs\n');
  console.log('Or run: npm run promote indexnow\n');
  urls.forEach((u) => console.log(u));
}

async function runIndexnow() {
  hr('IndexNow ping');
  await import('./ping-indexnow.mjs');
}

function showHelp() {
  showChecklist();
  hr('Commands');
  console.log(`
  npm run promote checklist
  npm run promote quora [0-${(copy.quora?.length ?? 1) - 1}]
  npm run promote reddit [0-${(copy.posts?.length ?? 1) - 1}]
  npm run promote medium
  npm run promote bing
  npm run promote indexnow
`);
}

switch (cmd) {
  case 'checklist':
    showChecklist();
    break;
  case 'quora':
    showQuora(arg ?? 0);
    break;
  case 'reddit':
    showReddit(arg ?? 0);
    break;
  case 'medium':
    showMedium();
    break;
  case 'bing':
    showBing();
    break;
  case 'indexnow':
    await runIndexnow();
    break;
  case 'help':
  default:
    showHelp();
}
