import dogNames from '../data/naming/dog-names.json';
import catNames from '../data/naming/cat-names.json';
import catNamesExtra from '../data/naming/cat-names-extra.json';
import tarotDeck from '../data/naming/tarot-meanings.json';
import {
  attachFortune,
  chooseHotPick,
  rankNamesDetailed,
} from '../lib/naming/generate';
import type { Gender, NameEntry, ScoredName, Species, Vibe } from '../lib/naming/types';

const BATCH_SIZE = 18;

function mergePool(base: NameEntry[], extra: NameEntry[]): NameEntry[] {
  const map = new Map<string, NameEntry>();
  for (const n of base) map.set(n.name.toLowerCase(), n);
  for (const n of extra) {
    const key = n.name.toLowerCase();
    if (!map.has(key)) map.set(key, n);
  }
  return [...map.values()];
}

const pools: Record<Species, NameEntry[]> = {
  dog: dogNames as NameEntry[],
  cat: mergePool(catNames as NameEntry[], catNamesExtra as NameEntry[]),
};

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing #${id}`);
  return node as T;
}

function readFilters(): {
  species: Species;
  gender: Gender;
  vibe: Vibe;
  letter: string;
  breedId: string;
} {
  const species = (el<HTMLSelectElement>('pnl-species').value || 'dog') as Species;
  const gender = (el<HTMLSelectElement>('pnl-gender').value || 'neutral') as Gender;
  const vibe = (el<HTMLSelectElement>('pnl-vibe').value || 'cute') as Vibe;
  const letterRaw = el<HTMLSelectElement>('pnl-letter').value || '';
  const letter = /^[A-Za-z]$/.test(letterRaw) ? letterRaw.toUpperCase() : '';
  const breedId = el<HTMLSelectElement>('pnl-breed').value || '';
  return { species, gender, vibe, letter, breedId };
}

function syncBreedOptgroups(species: Species) {
  const dogGroup = document.getElementById('pnl-breed-dog');
  const catGroup = document.getElementById('pnl-breed-cat');
  if (dogGroup) dogGroup.hidden = species !== 'dog';
  if (catGroup) catGroup.hidden = species !== 'cat';

  const breedSelect = el<HTMLSelectElement>('pnl-breed');
  const selected = breedSelect.selectedOptions[0];
  const selectedGroup = selected?.parentElement;
  if (
    selected &&
    selected.value &&
    ((species === 'dog' && selectedGroup?.id === 'pnl-breed-cat') ||
      (species === 'cat' && selectedGroup?.id === 'pnl-breed-dog'))
  ) {
    breedSelect.value = '';
  }
}

/** Full ranked pool for current filters (stable score order). */
let rankedPool: ScoredName[] = [];
/** Offset into rankedPool for the visible page. */
let batchOffset = 0;
/** Names on the current page (for tray render). */
let candidates: ScoredName[] = [];
/** Selections persist across batches so Compare still works. */
const selected = new Map<string, ScoredName>();
/** Final user choice after compare — may differ from Hot Pick. */
let yourPick: ScoredName | null = null;
let lastCompared: ScoredName[] = [];
let lastHot: ScoredName | null = null;

/** Keep rank order from generate() — do NOT re-sort by score (that breaks Starts-with). */
export function splitTrays(list: ScoredName[]) {
  if (!list.length) return { top: [] as ScoredName[], mid: [] as ScoredName[], low: [] as ScoredName[] };

  const topCount = Math.min(6, list.length);
  const midCount = Math.min(8, Math.max(0, list.length - topCount));
  const top = list.slice(0, topCount);
  const mid = list.slice(topCount, topCount + midCount);
  const low = list.slice(topCount + midCount);
  return { top, mid, low };
}

function mountChip(n: ScoredName, grid: HTMLElement) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'pnl-chip' + (selected.has(n.name) ? ' is-on' : '');
  btn.setAttribute('aria-pressed', selected.has(n.name) ? 'true' : 'false');
  btn.title = selected.has(n.name) ? 'Selected — tap to remove' : 'Tap to select for Compare';
  const metaBit = selected.has(n.name)
    ? 'Selected ✓ · tap to remove'
    : `Score ${n.practical}/100 · ${n.tags.slice(0, 2).join(' · ')} · tap to select`;
  btn.innerHTML = `<span class="pnl-chip-name">${n.name}</span><span class="pnl-chip-meta">${metaBit}</span>`;
  btn.addEventListener('click', () => {
    if (selected.has(n.name)) selected.delete(n.name);
    else {
      if (selected.size >= 5) return;
      selected.set(n.name, n);
    }
    renderCandidates();
    renderCompareBar();
  });
  grid.appendChild(btn);
}

function renderBatchMeta() {
  const moreBtn = el<HTMLButtonElement>('pnl-more');
  const meta = el<HTMLElement>('pnl-batch-meta');
  const total = rankedPool.length;
  if (!total) {
    moreBtn.hidden = true;
    meta.hidden = true;
    return;
  }

  const start = batchOffset + 1;
  const end = Math.min(batchOffset + candidates.length, total);
  meta.hidden = false;
  meta.textContent = `Showing ${start}–${end} of ${total} (highest scores first)`;

  moreBtn.hidden = total <= BATCH_SIZE;
  if (batchOffset + BATCH_SIZE >= total) {
    moreBtn.textContent = '← Back to top scores';
  } else {
    moreBtn.textContent = 'Show more names →';
  }
}

function renderCandidates() {
  const { top, mid, low } = splitTrays(candidates);
  const topGrid = el<HTMLElement>('pnl-candidates-top');
  const midGrid = el<HTMLElement>('pnl-candidates-mid');
  const lowGrid = el<HTMLElement>('pnl-candidates-low');
  const lowTray = el<HTMLDetailsElement>('pnl-tray-low');
  topGrid.innerHTML = '';
  midGrid.innerHTML = '';
  lowGrid.innerHTML = '';
  for (const n of top) mountChip(n, topGrid);
  for (const n of mid) mountChip(n, midGrid);
  for (const n of low) mountChip(n, lowGrid);
  el<HTMLElement>('pnl-count-top').textContent = `${top.length} names`;
  el<HTMLElement>('pnl-count-mid').textContent = `${mid.length} names`;
  el<HTMLElement>('pnl-count-low').textContent = `${low.length} names`;
  lowTray.hidden = low.length === 0;
  lowTray.open = false;

  const empty = el<HTMLElement>('pnl-empty');
  empty.hidden = candidates.length > 0;
  renderBatchMeta();
}

function renderCompareBar() {
  const bar = el<HTMLElement>('pnl-compare-bar');
  const list = el<HTMLElement>('pnl-selected');
  list.textContent = [...selected.keys()].join(', ') || 'None selected';
  const go = el<HTMLButtonElement>('pnl-compare-btn');
  go.disabled = selected.size < 2;
  bar.hidden = selected.size === 0;
}

function setYourPick(n: ScoredName) {
  yourPick = n;
  const nameEl = document.getElementById('pnl-your-name');
  const cardLink = document.getElementById('pnl-make-card') as HTMLAnchorElement | null;
  if (nameEl) nameEl.textContent = n.name;
  if (cardLink) {
    let species: Species = 'dog';
    let vibe: Vibe = 'cute';
    try {
      species = (el<HTMLSelectElement>('pnl-species').value || 'dog') as Species;
      vibe = (el<HTMLSelectElement>('pnl-vibe').value || 'cute') as Vibe;
    } catch {
      /* filters missing on rare embeds — still allow pick */
    }
    const params = new URLSearchParams({
      name: n.name,
      species,
      vibe,
      meta: `${vibe} · ${species === 'dog' ? 'Dog' : 'Cat'}`,
    });
    cardLink.href = `/tools/pet-name-card?${params.toString()}`;
    cardLink.hidden = false;
  }
  document.querySelectorAll('#pnl-compare-cards .pnl-card').forEach((node) => {
    const article = node as HTMLElement;
    const isPick = article.dataset.name === n.name;
    article.classList.toggle('is-pick', isPick);
    article.setAttribute('aria-pressed', isPick ? 'true' : 'false');
    const btn = article.querySelector('.pnl-card-pick');
    if (btn) btn.textContent = isPick ? 'Your pick ✓' : 'Use as Your pick';
  });
}

function bindCompareCard(card: HTMLElement, n: ScoredName) {
  card.dataset.name = n.name;
  card.tabIndex = 0;
  card.setAttribute('aria-pressed', 'false');
  card.style.cursor = 'pointer';

  const pickBtn = card.querySelector('.pnl-card-pick') as HTMLButtonElement | null;
  if (pickBtn) {
    pickBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setYourPick(n);
    });
  }

  // Whole card selects Your pick — including the fun summary/arrow.
  // Fun can still expand; that click must not skip the pick (no double-tap).
  card.addEventListener('click', (e) => {
    const t = e.target as HTMLElement | null;
    if (t?.closest('a')) return;
    setYourPick(n);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const t = e.target as HTMLElement | null;
    if (t?.closest('a') || t?.closest('button') || t?.closest('summary')) return;
    e.preventDefault();
    setYourPick(n);
  });
}

function renderResults(compared: ScoredName[], hot: ScoredName) {
  lastCompared = compared;
  lastHot = hot;
  const panel = el<HTMLElement>('pnl-results');
  panel.hidden = false;
  const cards = el<HTMLElement>('pnl-compare-cards');
  cards.innerHTML = '';
  for (const n of compared) {
    const card = document.createElement('article');
    card.className = 'pnl-card' + (n.name === hot.name ? ' is-hot' : '');
    card.dataset.name = n.name;
    const tarotBlock = n.tarot
      ? `<div class="pnl-fun-wrap">
          <p class="pnl-fun-teaser"><span class="pnl-fun-label">Fun vibe</span> ${n.tarot.name}</p>
          <details class="pnl-fun-details">
            <summary>Optional fun card</summary>
            <p class="pnl-tarot-vibe">${n.tarot.vibe}</p>
            <p class="pnl-fun">Fun reading · Not a prediction · Does not change Hot Pick</p>
          </details>
        </div>`
      : '';
    const suggested =
      n.name === hot.name
        ? `<p class="pnl-score">Suggested Hot Pick · score ${n.practical}/100</p>`
        : `<p class="pnl-score">Practical score ${n.practical}/100</p>`;
    // Pick button above fun — primary action first; fun arrow must not steal the tap.
    card.innerHTML = `
      <header>
        <h3>${n.name}</h3>
        ${suggested}
      </header>
      <button type="button" class="pnl-card-pick">Use as Your pick</button>
      ${tarotBlock}
    `;
    bindCompareCard(card, n);
    cards.appendChild(card);
  }

  el<HTMLElement>('pnl-hot-name').textContent = hot.name;
  el<HTMLElement>('pnl-hot-reason').textContent =
    hot.reason ?? `Highest practical score (${hot.practical}/100) in your shortlist.`;

  // Default Your pick to Hot Pick — user can change by tapping any card.
  setYourPick(hot);

  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showBatch(reset: boolean) {
  if (reset) {
    batchOffset = 0;
    selected.clear();
    yourPick = null;
    lastCompared = [];
    lastHot = null;
  }
  candidates = rankedPool.slice(batchOffset, batchOffset + BATCH_SIZE);
  el<HTMLElement>('pnl-results').hidden = true;
  const cardLink = document.getElementById('pnl-make-card') as HTMLAnchorElement | null;
  if (cardLink) cardLink.hidden = true;
  const yourName = document.getElementById('pnl-your-name');
  if (yourName) yourName.textContent = '—';
  renderCandidates();
  renderCompareBar();
  el<HTMLElement>('pnl-output').hidden = false;
}

function flashOutput() {
  const output = el<HTMLElement>('pnl-output');
  output.classList.remove('pnl-output-flash');
  // restart animation
  void output.offsetWidth;
  output.classList.add('pnl-output-flash');
  window.setTimeout(() => output.classList.remove('pnl-output-flash'), 700);
}

function renderLetterNote(letter: string, exactCount: number, softened: boolean) {
  const note = document.getElementById('pnl-letter-note');
  if (!note) return;
  if (!softened || !letter) {
    note.hidden = true;
    note.textContent = '';
    return;
  }
  note.hidden = false;
  note.textContent = `${exactCount} name${exactCount === 1 ? '' : 's'} start with ${letter} for these filters — shown first. Extra names below are fill-ins because that letter set is thin.`;
}

function generate(opts: { scroll?: boolean; flash?: boolean } = {}) {
  const { scroll = true, flash = true } = opts;
  const { species, gender, vibe, letter, breedId } = readFilters();
  syncBreedOptgroups(species);
  const detail = rankNamesDetailed(pools[species], gender, vibe, {
    letter,
    breedId: breedId || undefined,
  });
  rankedPool = detail.names;
  renderLetterNote(letter, detail.meta.letterExactCount, detail.meta.letterSoftened);
  showBatch(true);
  if (flash) flashOutput();
  if (scroll) {
    el<HTMLElement>('pnl-output').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showMore() {
  if (!rankedPool.length) return;
  if (batchOffset + BATCH_SIZE >= rankedPool.length) {
    batchOffset = 0;
  } else {
    batchOffset += BATCH_SIZE;
  }
  candidates = rankedPool.slice(batchOffset, batchOffset + BATCH_SIZE);
  el<HTMLElement>('pnl-results').hidden = true;
  renderCandidates();
  renderCompareBar();
  flashOutput();
}

function applyPrefillFromRoot() {
  const root = document.getElementById('pet-name-lab');
  if (!root) return;

  const species = root.dataset.species as Species | undefined;
  const gender = root.dataset.gender as Gender | undefined;
  const vibe = root.dataset.vibe as Vibe | undefined;
  const letter = root.dataset.letter || '';
  const breed = root.dataset.breed || '';

  if (species === 'dog' || species === 'cat') {
    el<HTMLSelectElement>('pnl-species').value = species;
  }
  if (gender === 'boy' || gender === 'girl' || gender === 'neutral') {
    el<HTMLSelectElement>('pnl-gender').value = gender;
  }
  if (vibe === 'cute' || vibe === 'strong' || vibe === 'unique' || vibe === 'classic') {
    el<HTMLSelectElement>('pnl-vibe').value = vibe;
  }
  if (/^[A-Z]$/.test(letter)) {
    el<HTMLSelectElement>('pnl-letter').value = letter;
  }
  if (breed) {
    el<HTMLSelectElement>('pnl-breed').value = breed;
  }
  syncBreedOptgroups((el<HTMLSelectElement>('pnl-species').value || 'dog') as Species);
}

function wantsStartEmpty(): boolean {
  const root = document.getElementById('pet-name-lab');
  return root?.dataset.startEmpty === '1';
}

declare global {
  interface Window {
    __pnlReady?: boolean;
    __pnlGenerate?: () => void;
  }
}

export function initPetNameLab() {
  try {
    applyPrefillFromRoot();

    const runGenerate = () => generate({ scroll: true, flash: true });
    window.__pnlGenerate = runGenerate;

    el<HTMLButtonElement>('pnl-generate').addEventListener('click', runGenerate);
    el<HTMLButtonElement>('pnl-more').addEventListener('click', showMore);

    // Changing filters alone does not refresh — user must tap Generate (clear feedback).
    for (const id of ['pnl-species', 'pnl-gender', 'pnl-vibe', 'pnl-letter', 'pnl-breed'] as const) {
      el<HTMLSelectElement>(id).addEventListener('change', () => {
        syncBreedOptgroups((el<HTMLSelectElement>('pnl-species').value || 'dog') as Species);
      });
    }

    el<HTMLButtonElement>('pnl-compare-btn').addEventListener('click', () => {
      const picked = [...selected.values()];
      if (picked.length < 2) return;
      const withFortune = attachFortune(picked, tarotDeck as { id: number; name: string; vibe: string }[]);
      const hot = chooseHotPick(withFortune);
      if (!hot) return;
      renderResults(withFortune, hot);
    });

    if (wantsStartEmpty()) {
      // Tool page: wait for Generate — no results until the user asks.
      rankedPool = [];
      candidates = [];
      el<HTMLElement>('pnl-output').hidden = true;
      el<HTMLElement>('pnl-results').hidden = true;
    } else {
      // SEO embed: hydrate SSR shortlist into interactive chips (no jump/flash).
      generate({ scroll: false, flash: false });
    }

    window.__pnlReady = true;
    const fail = document.getElementById('pnl-script-fail');
    if (fail) fail.hidden = true;
  } catch (err) {
    console.error('Pet Name Lab failed to start', err);
    window.__pnlReady = false;
    const fail = document.getElementById('pnl-script-fail');
    if (fail) fail.hidden = false;
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('pet-name-lab')) initPetNameLab();
    });
  } else if (document.getElementById('pet-name-lab')) {
    initPetNameLab();
  }
}
