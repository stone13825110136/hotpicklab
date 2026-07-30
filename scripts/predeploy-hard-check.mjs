#!/usr/bin/env node
/**
 * Pre-deploy hard checks (R2): build artifacts + critical page HTML/CSS contracts.
 * Run after `npm run build`. Optional: ASTRO_PREVIEW_URL for live server checks.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
  else console.log('OK:', msg);
}

function read(rel) {
  const p = join(dist, rel);
  assert(existsSync(p), `exists ${rel}`);
  return existsSync(p) ? readFileSync(p, 'utf8') : '';
}

function findCss() {
  const dir = join(dist, '_astro');
  if (!existsSync(dir)) return '';
  return readdirSync(dir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n');
}

console.log('=== Pre-deploy hard checks ===\n');

assert(existsSync(dist), 'dist/ exists (run npm run build first)');

// Homepage: sample name card
const home = read('index.html');
assert(home.includes('/images/naming/sample-name-card.png'), 'homepage shows sample name card image');
assert(home.includes('What you get'), 'homepage has "What you get" kicker');
assert(existsSync(join(dist, 'images/naming/sample-name-card.png')), 'sample-name-card.png in dist');
assert(existsSync(join(dist, 'images/naming/sample-dog.png')), 'sample-dog.png in dist');

// Lab tool page
const lab = read('tools/pet-name-lab/index.html');
assert(lab.includes('id="pet-name-lab"'), 'Lab page has #pet-name-lab');
assert(lab.includes('pnl-generate-row'), 'Generate button is in its own row (not jammed in filter grid)');
assert(lab.includes('id="pnl-generate"'), 'Generate button present');
assert(lab.includes('id="pnl-compare-btn"'), 'Compare button present');
assert(lab.includes('id="pnl-your-name"'), 'Your pick name slot present');
assert(lab.includes('id="pnl-make-card"'), 'Make name card link present');

// SEO longtail embed
const strong = read('dog-names/strong/index.html');
assert(strong.includes('id="pet-name-lab"'), 'SEO strong page embeds Lab');
assert(strong.includes('pnl-generate-row'), 'SEO Lab uses generate row layout');
assert(strong.includes('sample-list'), 'SEO page has top scored sample list');

// Name card page
const card = read('tools/pet-name-card/index.html');
assert(card.includes('id="pnc-crop"'), 'name card has crop UI');
assert(card.includes('id="pnc-crop-canvas"'), 'name card has crop canvas');
assert(card.includes('id="pnc-zoom"'), 'name card has zoom control');
assert(card.includes('noindex'), 'name card stays noindex');

// Theme / layout CSS contracts (light Lab, not old navy)
const css = findCss();
assert(css.includes('f3faf8') || css.includes('#f3faf8'), 'Lab light mint shell color in CSS');
assert(!/#0b1020/.test(css) || !css.includes('--pnl-bg:#0b1020'), 'Lab not using old navy --pnl-bg');
assert(/max-width:\s*42rem/.test(css) || css.includes('42rem'), 'Lab tool card has max-width 42rem (not full-bleed sparse)');
assert(css.includes('appearance:none') || css.includes('appearance: none'), 'custom select styling (no raw native look)');
// Tool layout light — check ToolLayout source (CSS may be hashed/minified)
const toolLayout = readFileSync(join(root, 'src/layouts/ToolLayout.astro'), 'utf8');
assert(toolLayout.includes('--bg: #f6f7f9'), 'ToolLayout uses light page background');
assert(!toolLayout.includes('--bg: #0b1020'), 'ToolLayout no longer uses navy background');

assert(css.includes('pnl-generate-row'), 'pnl-generate-row styles shipped');
assert(/--pnl-bg:\s*#f3faf8/.test(css) || css.includes('#f3faf8'), 'Lab mint shell in built CSS');
assert(!/--pnl-bg:\s*#0b1020/.test(css), 'built CSS Lab bg is not navy');

// Name-card.ts source contracts (layout: Meet below photo)
const nameCardSrc = readFileSync(join(root, 'src/lib/naming/name-card.ts'), 'utf8');
assert(nameCardSrc.includes('photoCy + photoRadius'), 'Meet Y is below photo circle');
assert(nameCardSrc.includes('normalizePhotoCrop'), 'photo crop pan/zoom supported');
assert(nameCardSrc.includes('whyBlurb') || nameCardSrc.includes('Cute · easy to call'), 'why blurb not product marketing');

// Lab script selection contract
const labTs = readFileSync(join(root, 'src/scripts/pet-name-lab.ts'), 'utf8');
assert(labTs.includes('setYourPick'), 'Your pick setter exists');
assert(labTs.includes('Selected ✓'), 'selected chip shows Selected ✓ label');
assert(
  readFileSync(join(root, 'src/components/naming/PetNameLabEmbed.astro'), 'utf8').includes(
    'rgba(255, 107, 53, 0.16)',
  ),
  'selected chip has strong orange fill',
);
assert(labTs.includes("closest('summary')") || labTs.includes('setYourPick(n)'), 'card click can set Your pick');
assert(!labTs.includes("closest('details') || t?.closest('summary')"), 'fun summary no longer blocks pick alone');

if (failures.length) {
  console.error('\nFAILED pre-deploy checks:');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}

console.log('\nAll pre-deploy hard checks passed.');
