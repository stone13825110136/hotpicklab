/** Client-safe Identity Card drawing (Stories-friendly). No server upload. */

export type PhotoCrop = {
  /** 0–1, image X of the circle center (default 0.5) */
  focusX?: number;
  /** 0–1, image Y of the circle center (default ~0.38 — faces sit higher) */
  focusY?: number;
  /** 1 = cover fill, up to 3 */
  zoom?: number;
};

export type NameCardOptions = {
  name: string;
  /** Optional object URL or data URL — drawn locally only */
  photoUrl?: string | null;
  /** Pan/zoom inside the circular photo */
  photoCrop?: PhotoCrop | null;
  /** Supporting line under the name */
  blurb?: string;
  /** Small meta, e.g. "Cute · Dog" */
  meta?: string;
  width?: number;
  height?: number;
};

const DEFAULT_W = 1080;
const DEFAULT_H = 1350;
const DEFAULT_FOCUS_Y = 0.38;

/** Small line under the name: vibe/why — not product marketing, not "Our dog." */
function whyBlurb(meta?: string): string {
  const m = (meta || '').toLowerCase();
  if (m.includes('cute')) return 'Cute · easy to call.';
  if (m.includes('strong')) return 'Strong · easy to shout.';
  if (m.includes('unique')) return 'Unique · still easy to use.';
  if (m.includes('classic')) return 'Classic · familiar to say.';
  return 'Short, sweet, easy to call.';
}

export function normalizePhotoCrop(
  imgW: number,
  imgH: number,
  crop: PhotoCrop | null | undefined,
  radius: number,
): Required<PhotoCrop> {
  const zoom = Math.min(3, Math.max(1, crop?.zoom ?? 1));
  const diameter = radius * 2;
  const scale = (diameter / Math.min(imgW, imgH)) * zoom;
  const dw = imgW * scale;
  const dh = imgH * scale;
  const minFX = Math.min(0.5, radius / dw);
  const maxFX = Math.max(0.5, 1 - radius / dw);
  const minFY = Math.min(0.5, radius / dh);
  const maxFY = Math.max(0.5, 1 - radius / dh);
  const focusX = Math.min(maxFX, Math.max(minFX, crop?.focusX ?? 0.5));
  const focusY = Math.min(maxFY, Math.max(minFY, crop?.focusY ?? DEFAULT_FOCUS_Y));
  return { focusX, focusY, zoom };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fillGradient(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#d9efe8');
  g.addColorStop(0.55, '#f3efe6');
  g.addColorStop(1, '#f7f1e8');
  ctx.fillStyle = g;
  roundRect(ctx, 0, 0, w, h, 48);
  ctx.fill();
}

function fitNameFont(ctx: CanvasRenderingContext2D, name: string, maxWidth: number): number {
  let size = 120;
  ctx.font = `700 ${size}px Georgia, "Times New Roman", serif`;
  while (size > 56 && ctx.measureText(name).width > maxWidth) {
    size -= 4;
    ctx.font = `700 ${size}px Georgia, "Times New Roman", serif`;
  }
  return size;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Photo failed to load'));
    img.src = url;
  });
}

function drawCoverCircle(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  radius: number,
  crop?: PhotoCrop | null,
) {
  const { focusX, focusY, zoom } = normalizePhotoCrop(img.width, img.height, crop, radius);
  const diameter = radius * 2;
  const scale = (diameter / Math.min(img.width, img.height)) * zoom;
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = cx - focusX * dw;
  const dy = cy - focusY * dh;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(31, 111, 99, 0.28)';
  ctx.lineWidth = 6;
  ctx.stroke();
}

/** Draw a HotPick Lab name Identity Card onto an existing canvas. */
export async function drawNameIdentityCard(
  canvas: HTMLCanvasElement,
  opts: NameCardOptions,
): Promise<void> {
  const w = opts.width ?? DEFAULT_W;
  const h = opts.height ?? DEFAULT_H;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  fillGradient(ctx, w, h);

  const name = (opts.name || 'Name').trim() || 'Name';
  const hasPhoto = Boolean(opts.photoUrl);
  const photoRadius = 210;
  const photoCy = 360;

  if (hasPhoto && opts.photoUrl) {
    try {
      const img = await loadImage(opts.photoUrl);
      drawCoverCircle(ctx, img, w / 2, photoCy, photoRadius, opts.photoCrop);
    } catch {
      // Keep card usable without photo if load fails
    }
  }

  ctx.fillStyle = '#2f7a6d';
  ctx.font = '700 28px "IBM Plex Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('HOTPICK LAB', w / 2, hasPhoto ? 120 : 180);

  ctx.fillStyle = '#4a5f5a';
  ctx.font = '500 30px "IBM Plex Sans", system-ui, sans-serif';
  ctx.letterSpacing = '0';
  // Announce voice for sharing — not product marketing
  ctx.fillText('Meet', w / 2, hasPhoto ? 170 : 250);

  const nameY = hasPhoto ? 680 : 560;
  const nameSize = fitNameFont(ctx, name, w - 140);
  ctx.fillStyle = '#1f6f63';
  ctx.font = `700 ${nameSize}px Georgia, "Times New Roman", serif`;
  ctx.fillText(name, w / 2, nameY);

  const blurb = (opts.blurb || whyBlurb(opts.meta)).trim();
  ctx.fillStyle = '#4a5f5a';
  ctx.font = '400 34px "IBM Plex Sans", system-ui, sans-serif';
  wrapCentered(ctx, blurb, w / 2, nameY + 70, w - 180, 44);

  ctx.strokeStyle = 'rgba(36, 87, 79, 0.22)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.22, h - 260);
  ctx.lineTo(w * 0.78, h - 260);
  ctx.stroke();

  // Species/meta stays small under the why line (e.g. Dog) — not competing with the name
  if (opts.meta) {
    const speciesOnly = opts.meta.includes('·')
      ? opts.meta.split('·').pop()!.trim()
      : opts.meta;
    ctx.fillStyle = '#24574f';
    ctx.font = '600 28px "IBM Plex Sans", system-ui, sans-serif';
    ctx.fillText(speciesOnly, w / 2, h - 200);
  }

  ctx.fillStyle = '#2f7a6d';
  ctx.font = '500 26px "IBM Plex Sans", system-ui, sans-serif';
  ctx.fillText('hotpicklab.com · Free name card', w / 2, h - 130);
}

function wrapCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines.slice(0, 3).forEach((l, i) => {
    ctx.fillText(l, cx, y + i * lineHeight);
  });
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  a.click();
}
