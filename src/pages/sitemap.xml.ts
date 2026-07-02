import type { APIRoute } from 'astro';
import trends from '../data/trends.json';
import tools from '../data/tools.json';
import { SITE } from '../lib/site';

export const GET: APIRoute = () => {
  const staticPaths = ['', '/trends', '/tools', '/about', '/how-we-find-trends', '/privacy', '/disclosure'];
  const trendPaths = trends.map((t) => `/trends/${t.slug}`);
  const toolPaths = tools.map((t) => `/tools/${t.slug}`);
  const allPaths = [...staticPaths, ...trendPaths, ...toolPaths];
  const pages = allPaths.map((path) => new URL(path, SITE.url).href);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
