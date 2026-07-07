/**
 * Amazon product social proof — fetched 2026-07-06 from amazon.com/dp pages.
 * Re-run: node scripts/fetch-amazon-meta.mjs
 */
import amazonProductImages from '../data/amazon-product-images.json';

export type AmazonProductMeta = {
  shortName: string;
  rating: number;
  reviewCount?: number;
  ratingNote?: string;
};

export const AMAZON_PRODUCT_META: Record<string, AmazonProductMeta> = {
  B0D3VQ2YLG: { shortName: 'BlendJet 2', rating: 4.7, reviewCount: 82 },
  B0017XHSC2: { shortName: 'Hamilton Beach blender', rating: 4.1, reviewCount: 2220 },
  B0DRCKDWD1: { shortName: 'Switch 2 screen protector', rating: 4.3, reviewCount: 3159 },
  B0DRV6H6VM: { shortName: 'Switch 2 carrying case', rating: 4.7, reviewCount: 15518 },
  B0CR3JJJTS: { shortName: 'JISULIFE handheld fan', rating: 4.6, reviewCount: 5073 },
  B0865ZR8DB: { shortName: 'COMLIFE desk fan', rating: 4.4, reviewCount: 28829 },
  B09B8V1LZ3: { shortName: 'Echo Pop', rating: 4.7, reviewCount: 43335 },
  B00FLYWNYQ: { shortName: 'Instant Pot Duo', rating: 4.4, reviewCount: 52870 },
  B0CRMYT2WC: { shortName: 'Stanley Quencher', rating: 4.7, reviewCount: 435 },
  B085DVNHHK: { shortName: 'Owala FreeSip', rating: 4.7, reviewCount: 128396 },
  B08M8VFJ2Z: { shortName: 'Frigidaire nugget ice maker', rating: 4.3, reviewCount: 5016 },
  B09HWD3FZN: { shortName: 'NewAir nugget ice maker', rating: 4.3, reviewCount: 3200, ratingNote: 'approx. count' },
  B0BNTL3Q2C: { shortName: 'VINSGUIR paddle set', rating: 4.7, reviewCount: 2894 },
  B07GVDXW5D: { shortName: 'Niupipo paddle set', rating: 4.6, reviewCount: 9211 },
  B088ZN47V8: { shortName: 'JISULIFE neck fan', rating: 4.1, reviewCount: 12267 },
  B0BYSKX3BX: { shortName: 'JISULIFE Neck Fan Pro', rating: 4.1, reviewCount: 12983 },
  B08QXB9BH5: { shortName: 'Ninja CREAMi', rating: 4.4, reviewCount: 28500, ratingNote: 'approx. count' },
  B0D2LZYQ2M: { shortName: 'Ninja SLUSHi', rating: 4.5, reviewCount: 2100, ratingNote: 'approx. count' },
  B0BFB1P1JM: { shortName: 'amFilm Steam Deck protector', rating: 4.5, reviewCount: 4200, ratingNote: 'approx. count' },
  B0BYD5VTNM: { shortName: 'Spigen Steam Deck case', rating: 4.6, reviewCount: 1800, ratingNote: 'approx. count' },
  B08FC6Y4VG: { shortName: 'DualSense charging station', rating: 4.8, reviewCount: 52000, ratingNote: 'approx. count' },
  B08FC5R4KV: { shortName: 'PS5 media remote', rating: 4.6, reviewCount: 14000, ratingNote: 'approx. count' },
  B08F7PT9CS: { shortName: 'HyperX Cloud II Wireless', rating: 4.5, reviewCount: 18500, ratingNote: 'approx. count' },
  B086PKZ4KK: { shortName: 'HyperX Cloud Stinger 2', rating: 4.4, reviewCount: 9200, ratingNote: 'approx. count' },
};

export function getAmazonProductMeta(affiliateUrl: string): AmazonProductMeta | null {
  const match = affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/i);
  if (!match) return null;
  return AMAZON_PRODUCT_META[match[1].toUpperCase()] ?? null;
}

export function formatReviewCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (count >= 10_000) return `${Math.round(count / 1000)}k`;
  if (count >= 1_000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return count.toLocaleString('en-US');
}

export function amazonCtaLabel(shortName: string): string {
  return `Check ${shortName} price on Amazon →`;
}

/**
 * Per-ASIN Amazon product photo URLs (hiRes from product pages).
 * Source: src/data/amazon-product-images.json — refresh with npm run scrape-images
 */
export const AMAZON_PRODUCT_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(amazonProductImages).filter(
    ([key, value]) => !key.startsWith('_') && typeof value === 'string',
  ),
) as Record<string, string>;

export function getAmazonProductImageUrl(asin: string): string | null {
  return AMAZON_PRODUCT_IMAGES[asin.toUpperCase()] ?? null;
}
