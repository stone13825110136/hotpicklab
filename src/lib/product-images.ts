/** Extract ASIN from amazon.com/dp/... affiliate URLs */
export function extractAmazonAsin(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/i);
  return match ? match[1].toUpperCase() : null;
}

/** Amazon Associates product image (official widget — works for US visitors) */
export function amazonProductImageUrl(asin: string, size = 400): string {
  return `https://ws-na.amazon-adsystem.com/widgets/q?_Encoding=UTF8&MarketPlace=US&ASIN=${asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL${size}_`;
}

/** Optional manual overrides — faster load than widget redirect */
const AMAZON_IMAGE_OVERRIDES: Record<string, string> = {
  B0D3VQ2YLG: 'https://m.media-amazon.com/images/I/71PHH2ehHfL._AC_SL500_.jpg',
  B0D3VNPS6C: 'https://m.media-amazon.com/images/I/71PHH2ehHfL._AC_SL500_.jpg',
  B0017XHSC2: 'https://m.media-amazon.com/images/I/71Qt0PLbFZL._AC_SL500_.jpg',
};

export function resolveProductImage(
  affiliateUrl: string,
  image?: string,
): string | null {
  if (image) return image;

  const asin = extractAmazonAsin(affiliateUrl);
  if (!asin) return null;

  return AMAZON_IMAGE_OVERRIDES[asin] ?? amazonProductImageUrl(asin);
}
