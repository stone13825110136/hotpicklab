import { getAmazonProductImageUrl } from './amazon-product-meta';

/** Extract ASIN from amazon.com/dp/... affiliate URLs */
export function extractAmazonAsin(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/i);
  return match ? match[1].toUpperCase() : null;
}

export const PRODUCT_IMAGE_PLACEHOLDER = '/images/products/placeholder.svg';

/** Self-hosted product images — avoids Amazon CDN / widget hotlink blocks */
const LOCAL_ASIN_IMAGES: Record<string, string> = {
  B0D3VQ2YLG: '/images/products/blendjet-2.svg',
  B0D3VNPS6C: '/images/products/blendjet-2.svg',
  B0017XHSC2: '/images/products/hamilton-beach.svg',
  B0DRCKDWD1: '/images/products/switch-protector.svg',
  B0DRV6H6VM: '/images/products/switch-case.svg',
  B09TBD2P46: '/images/products/jisulife-fan.svg',
  B0CR3JJJTS: '/images/products/jisulife-fan.svg',
  B01LL8NE28: '/images/products/mini-usb-fan.svg',
  B0865ZR8DB: '/images/products/mini-usb-fan.svg',
  B09B8V1LZ3: '/images/products/echo-pop.svg',
  B00FLYWNYQ: '/images/products/instant-pot.svg',
  B0CRMYT2WC: '/images/products/stanley-quencher.svg',
  B085DVNHHK: '/images/products/owala-freesip.svg',
  B08M8VFJ2Z: '/images/products/nugget-ice-frigidaire.svg',
  B09HWD3FZN: '/images/products/nugget-ice-newair.svg',
  B0BNTL3Q2C: '/images/products/pickleball-set.svg',
  B07GVDXW5D: '/images/products/pickleball-set.svg',
  B088ZN47V8: '/images/products/neck-fan.svg',
  B0BYSKX3BX: '/images/products/neck-fan-pro.svg',
  B08QXB9BH5: '/images/products/ninja-creami.svg',
  B0D2LZYQ2M: '/images/products/ninja-slushi.svg',
  B0BFB1P1JM: '/images/products/steam-deck-protector.svg',
  B0BYD5VTNM: '/images/products/steam-deck-case.svg',
  B08FC6Y4VG: '/images/products/ps5-charging-station.svg',
  B08FC5R4KV: '/images/products/ps5-media-remote.svg',
  B08F7PT9CS: '/images/products/hyperx-cloud-iii.svg',
  B086PKZ4KK: '/images/products/hyperx-stinger-2.svg',
};

function isLocalImage(url: string): boolean {
  return url.startsWith('/');
}

function isBrokenRemoteImage(url: string): boolean {
  return (
    url.includes('logo.clearbit.com') ||
    url.includes('amazon-adsystem.com') ||
    url.includes('media-amazon.com')
  );
}

/** Local SVG fallback when Amazon CDN image fails to load. */
export function resolveProductImageFallback(affiliateUrl: string, image?: string): string {
  const asin = extractAmazonAsin(affiliateUrl);
  if (asin && LOCAL_ASIN_IMAGES[asin]) {
    return LOCAL_ASIN_IMAGES[asin];
  }
  if (image && isLocalImage(image) && !isBrokenRemoteImage(image)) {
    return image;
  }
  return PRODUCT_IMAGE_PLACEHOLDER;
}

/** Per-ASIN Amazon hiRes photo when known; else self-hosted SVG. */
export function resolveProductImage(
  affiliateUrl: string,
  image?: string,
): string {
  const asin = extractAmazonAsin(affiliateUrl);
  const amazonPhoto = asin ? getAmazonProductImageUrl(asin) : null;
  if (amazonPhoto) {
    return amazonPhoto;
  }

  if (asin && LOCAL_ASIN_IMAGES[asin]) {
    return LOCAL_ASIN_IMAGES[asin];
  }

  if (image && isLocalImage(image) && !isBrokenRemoteImage(image)) {
    return image;
  }

  if (image && !isBrokenRemoteImage(image)) {
    return image;
  }

  return PRODUCT_IMAGE_PLACEHOLDER;
}
