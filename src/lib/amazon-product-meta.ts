/**
 * Amazon product social proof — fetched 2026-07-06 from amazon.com/dp pages.
 * Re-run: node scripts/fetch-amazon-meta.mjs
 */
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

export function amazonProductPhotoUrl(asin: string): string {
  return `https://m.media-amazon.com/images/P/${asin}.01._SL500_.jpg`;
}
