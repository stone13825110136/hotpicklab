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
  B01LL8NE28: '/images/products/mini-usb-fan.svg',
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

export function resolveProductImage(
  affiliateUrl: string,
  image?: string,
): string {
  if (image && isLocalImage(image) && !isBrokenRemoteImage(image)) {
    return image;
  }

  const asin = extractAmazonAsin(affiliateUrl);
  if (asin && LOCAL_ASIN_IMAGES[asin]) {
    return LOCAL_ASIN_IMAGES[asin];
  }

  if (image && !isBrokenRemoteImage(image)) {
    return image;
  }

  return PRODUCT_IMAGE_PLACEHOLDER;
}
