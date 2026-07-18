import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

/** Static file at build time — Bing/Google must not hit a failing server route. */
export const prerender = true;

type SitemapEntry = { path: string; lastmod?: string };

export const GET: APIRoute = () => {
  const today = '2026-07-18';
  const entries: SitemapEntry[] = [
    { path: '', lastmod: today },
    { path: '/privacy', lastmod: today },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
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
