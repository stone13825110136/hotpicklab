import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

export function getTrendAmazonAsins() {
  const trends = JSON.parse(readFileSync(join(ROOT, 'src/data/trends.json'), 'utf8'));
  const asins = new Set();
  for (const trend of trends) {
    for (const product of trend.products ?? []) {
      const match = product.affiliateUrl?.match(/\/dp\/([A-Z0-9]{10})/i);
      if (match) asins.add(match[1].toUpperCase());
    }
  }
  return [...asins].sort();
}

export function loadAmazonProductImages() {
  const raw = JSON.parse(readFileSync(join(ROOT, 'src/data/amazon-product-images.json'), 'utf8'));
  const images = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith('_')) continue;
    if (typeof value === 'string' && value.startsWith('http')) {
      images[key.toUpperCase()] = value;
    }
  }
  return images;
}

export function loadLocalImageFallbackAsins() {
  const raw = JSON.parse(readFileSync(join(ROOT, 'src/data/amazon-local-image-fallbacks.json'), 'utf8'));
  return new Set((raw.asins ?? []).map((a) => a.toUpperCase()));
}
