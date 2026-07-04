#!/usr/bin/env node
/**
 * Daily hotspot radar — Google Trends US + Reddit hot posts.
 * Output: radar/pending/YYYY-MM-DD.json
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const UA = 'HotPickLab-Radar/1.0 (contact@hotpicklab.com)';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 48);
}

async function fetchGoogleTrendsUS() {
  const url = 'https://trends.google.com/trendingsearches/daily/rss?geo=US';
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Google Trends RSS ${res.status}`);
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  return items.slice(0, 8).map((m, i) => {
    const block = m[1];
    const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() ?? 'Unknown';
    const traffic = block.match(/<ht:approx_traffic>([^<]+)/)?.[1]?.trim() ?? '';
    const isProductish = /amazon|buy|deal|price|best|vs|review|tool|ai|game|switch|iphone|blender|tiktok/i.test(title);
    return {
      id: i + 1,
      source: 'google-trends-us',
      title,
      keyword: title,
      suggestedSlug: `${slugify(title)}-${new Date().getFullYear()}`,
      category: /ai|chatgpt|video|tool/i.test(title) ? 'ai-tools' : isProductish ? 'amazon-trending' : 'amazon-trending',
      reason: `Google Trends US daily${traffic ? ` · ~${traffic} searches` : ''}`,
      score: Math.max(60, 95 - i * 4),
      commissionHint: /ai|tool|saas/i.test(title) ? 'saas-affiliate (high)' : 'amazon-associates',
    };
  });
}

async function fetchReddit(subreddit, limit = 4) {
  const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    console.warn(`Reddit r/${subreddit} failed: ${res.status}`);
    return [];
  }
  const json = await res.json();
  return (json?.data?.children ?? []).map((c, i) => {
    const d = c.data;
    const title = d.title ?? '';
    return {
      id: 100 + i,
      source: `reddit-${subreddit}`,
      title,
      keyword: title.slice(0, 80),
      suggestedSlug: `${slugify(title).slice(0, 40)}-${new Date().getFullYear()}`,
      category: subreddit.toLowerCase().includes('artificial') ? 'ai-tools' : 'amazon-trending',
      reason: `Reddit r/${subreddit} hot · ${d.score ?? 0} upvotes`,
      score: Math.min(92, 70 + Math.floor((d.score ?? 0) / 100)),
      url: `https://reddit.com${d.permalink}`,
      commissionHint: subreddit.toLowerCase().includes('artificial') ? 'saas-affiliate' : 'amazon-associates',
    };
  });
}

function dedupe(candidates) {
  const seen = new Set();
  return candidates.filter((c) => {
    const key = c.title.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** When Google/Reddit are blocked, still send pickable seasonal items. */
function getSeasonalFallbackCandidates() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const items = [];

  if (month >= 6 && month <= 7) {
    items.push({
      source: 'seasonal-calendar',
      title: 'Amazon Prime Day deals worth buying',
      keyword: 'Prime Day 2026 deals',
      suggestedSlug: `amazon-prime-day-deals-worth-it-${year}`,
      category: 'amazon-trending',
      reason: 'Prime Day mid-July — update existing guide + Bing resubmit',
      score: 94,
      commissionHint: 'amazon-associates',
    });
  }

  items.push(
    {
      source: 'seasonal-calendar',
      title: 'Stanley vs Owala water bottles — worth the hype?',
      keyword: 'Stanley vs Owala',
      suggestedSlug: `stanley-owala-water-bottles-worth-it-${year}`,
      category: 'amazon-trending',
      reason: 'Evergreen Amazon trending — strong Bing long-tail',
      score: 88,
      commissionHint: 'amazon-associates',
    },
    {
      source: 'seasonal-calendar',
      title: 'Portable handheld fans — TikTok hype check',
      keyword: 'JISULIFE handheld fan worth it',
      suggestedSlug: `portable-handheld-fans-amazon-${year}`,
      category: 'amazon-trending',
      reason: 'Summer seasonal — matches live guide on site',
      score: 82,
      commissionHint: 'amazon-associates',
    },
  );

  return items.map((c, i) => ({ ...c, id: i + 1 }));
}

export async function runRadarScan() {
  const [trends, amazonFinds, aiSubs] = await Promise.all([
    fetchGoogleTrendsUS().catch((e) => {
      console.warn('Google Trends failed:', e.message);
      return [];
    }),
    fetchReddit('AmazonFinds', 4).catch(() => []),
    fetchReddit('ArtificialInteligence', 3).catch(() => []),
  ]);

  let candidates = dedupe([...amazonFinds, ...aiSubs, ...trends])
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((c, i) => ({ ...c, id: i + 1 }));

  if (candidates.length === 0) {
    console.warn('Live sources empty — using seasonal fallback picks');
    candidates = getSeasonalFallbackCandidates();
  }

  const date = new Date().toISOString().slice(0, 10);
  const payload = {
    date,
    scannedAt: new Date().toISOString(),
    site: 'https://hotpicklab.com',
    affiliateTag: 'hotpicklab20-20',
    candidates,
    confirmInstructions: {
      cursor: `在 Cursor 对我说：「发布雷达 ${date} 第1,3条」`,
      github: '或回复 GitHub 自动创建的 Radar Issue 评论：approve 1,3',
    },
  };

  const dir = join(process.cwd(), 'radar', 'pending');
  await mkdir(dir, { recursive: true });
  const file = join(dir, `${date}.json`);
  await writeFile(file, JSON.stringify(payload, null, 2), 'utf8');
  await writeFile(join(process.cwd(), 'radar', 'latest.json'), JSON.stringify(payload, null, 2), 'utf8');

  console.log(`Radar: ${candidates.length} candidates → ${file}`);
  return payload;
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  runRadarScan().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
