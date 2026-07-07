import type { APIRoute } from 'astro';
import trends from '../data/trends.json';
import tools from '../data/tools.json';
import { SITE } from '../lib/site';

/** Static file at build time — Bing/Google must not hit a failing server route. */
export const prerender = true;

type SitemapEntry = { path: string; lastmod?: string };

export const GET: APIRoute = () => {
  const today = '2026-07-07';
  const staticPaths: SitemapEntry[] = [
    { path: '', lastmod: today },
    { path: '/trends', lastmod: today },
    { path: '/tools', lastmod: today },
    { path: '/about', lastmod: today },
    { path: '/methodology', lastmod: today },
    { path: '/how-we-find-trends', lastmod: today },
    { path: '/spot-a-trend', lastmod: today },
    { path: '/privacy' },
    { path: '/disclosure' },
  ];
  const trendPaths: SitemapEntry[] = trends.map((t) => ({
    path: `/trends/${t.slug}`,
    lastmod: t.updated,
  }));
  const toolPaths: SitemapEntry[] = tools.map((t) => ({ path: `/tools/${t.slug}` }));
  const allEntries = [...staticPaths, ...trendPaths, ...toolPaths];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map((entry) => {
    const loc = new URL(entry.path, SITE.url).href;
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
