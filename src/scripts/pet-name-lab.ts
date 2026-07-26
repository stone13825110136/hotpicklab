import dogNames from '../data/naming/dog-names.json';
import catNames from '../data/naming/cat-names.json';
import tarotDeck from '../data/naming/tarot-meanings.json';
import {
  attachFortune,
  chooseHotPick,
  filterNames,
} from '../lib/naming/generate';
import type { Gender, NameEntry, ScoredName, Species, Vibe } from '../lib/naming/types';

const pools: Record<Species, NameEntry[]> = {
  dog: dogNames as NameEntry[],
  cat: catNames as NameEntry[],
};

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing #${id}`);
  return node as T;
}

function readFilters(): { species: Species; gender: Gender; vibe: Vibe } {
  const species = (el<HTMLSelectElement>('pnl-species').value || 'dog') as Species;
  const gender = (el<HTMLSelectElement>('pnl-gender').value || 'neutral') as Gender;
  const vibe = (el<HTMLSelectElement>('pnl-vibe').value || 'cute') as Vibe;
  return { species, gender, vibe };
}

let candidates: ScoredName[] = [];
const selected = new Set<string>();

/** Always put highest scores in visible trays — never hide the whole shortlist in a closed fold. */
export function splitTrays(list: ScoredName[]) {
  const sorted = [...list].sort((a, b) => b.practical - a.practical || a.name.localeCompare(b.name));
  if (!sorted.length) return { top: [] as ScoredName[], mid: [] as ScoredName[], low: [] as ScoredName[] };

  const topCount = Math.min(6, sorted.length);
  const midCount = Math.min(8, Math.max(0, sorted.length - topCount));
  const top = sorted.slice(0, topCount);
  const mid = sorted.slice(topCount, topCount + midCount);
  const low = sorted.slice(topCount + midCount);
  return { top, mid, low };
}

function mountChip(n: ScoredName, grid: HTMLElement) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'pnl-chip' + (selected.has(n.name) ? ' is-on' : '');
  btn.setAttribute('aria-pressed', selected.has(n.name) ? 'true' : 'false');
  btn.innerHTML = `<span class="pnl-chip-name">${n.name}</span><span class="pnl-chip-meta">Score ${n.practical}/100 · ${n.tags.slice(0, 2).join(' · ')}</span>`;
  btn.addEventListener('click', () => {
    if (selected.has(n.name)) selected.delete(n.name);
    else {
      if (selected.size >= 5) return;
      selected.add(n.name);
    }
    renderCandidates();
    renderCompareBar();
  });
  grid.appendChild(btn);
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
}

function renderCompareBar() {
  const bar = el<HTMLElement>('pnl-compare-bar');
  const list = el<HTMLElement>('pnl-selected');
  list.textContent = [...selected].join(', ') || 'None selected';
  const go = el<HTMLButtonElement>('pnl-compare-btn');
  go.disabled = selected.size < 2;
  bar.hidden = selected.size === 0;
}

function renderResults(compared: ScoredName[], hot: ScoredName) {
  const panel = el<HTMLElement>('pnl-results');
  panel.hidden = false;
  const cards = el<HTMLElement>('pnl-compare-cards');
  cards.innerHTML = '';
  for (const n of compared) {
    const card = document.createElement('article');
    card.className = 'pnl-card' + (n.name === hot.name ? ' is-hot' : '');
    const tarotBlock = n.tarot
      ? `<div class="pnl-fun-wrap">
          <p class="pnl-fun-teaser"><span class="pnl-fun-label">Fun vibe</span> ${n.tarot.name}</p>
          <details class="pnl-fun-details">
            <summary>Tap to read the short fun card (optional)</summary>
            <p class="pnl-tarot-vibe">${n.tarot.vibe}</p>
            <p class="pnl-fun">Fun reading · Not a prediction · Does not change Hot Pick</p>
          </details>
        </div>`
      : '';
    card.innerHTML = `
      <header>
        <h3>${n.name}</h3>
        <p class="pnl-score">Practical score ${n.practical}/100</p>
      </header>
      ${tarotBlock}
    `;
    cards.appendChild(card);
  }

  el<HTMLElement>('pnl-hot-name').textContent = hot.name;
  el<HTMLElement>('pnl-hot-reason').textContent =
    hot.reason ?? `Highest practical score (${hot.practical}/100) in your shortlist.`;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generate() {
  const { species, gender, vibe } = readFilters();
  selected.clear();
  candidates = filterNames(pools[species], gender, vibe, 18);
  el<HTMLElement>('pnl-results').hidden = true;
  renderCandidates();
  renderCompareBar();
  el<HTMLElement>('pnl-output').hidden = false;
}

export function initPetNameLab() {
  el<HTMLButtonElement>('pnl-generate').addEventListener('click', generate);
  for (const id of ['pnl-species', 'pnl-gender', 'pnl-vibe'] as const) {
    el<HTMLSelectElement>(id).addEventListener('change', generate);
  }

  el<HTMLButtonElement>('pnl-compare-btn').addEventListener('click', () => {
    const picked = candidates.filter((n) => selected.has(n.name));
    if (picked.length < 2) return;
    const withFortune = attachFortune(picked, tarotDeck as { id: number; name: string; vibe: string }[]);
    const hot = chooseHotPick(withFortune);
    if (!hot) return;
    renderResults(withFortune, hot);
  });

  generate();
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
