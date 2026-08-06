import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';
import { allNamingSeoPaths } from '../lib/naming/seo-pages';

/** Static file at build time — Bing/Google must not hit a failing server route. */
export const prerender = true;

type SitemapEntry = { path: string; lastmod?: string };

/** Canonical live URLs use trailing slashes (host 308s bare paths). */
function canonicalLoc(path: string): string {
  if (!path || path === '/') return `${SITE.url}/`;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean.endsWith('/') ? clean : `${clean}/`}`;
}

export const GET: APIRoute = () => {
  const today = '2026-08-06';
  const core: SitemapEntry[] = [
    { path: '/', lastmod: today },
    { path: '/tools/', lastmod: today },
    { path: '/tools/pet-name-lab/', lastmod: today },
    { path: '/disclosure/', lastmod: today },
    { path: '/privacy/', lastmod: today },
  ];
  const naming: SitemapEntry[] = allNamingSeoPaths().map((path) => ({
    path: path.endsWith('/') ? path : `${path}/`,
    lastmod: today,
  }));
  const entries = [...core, ...naming];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((entry) => {
    const loc = canonicalLoc(entry.path);
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
