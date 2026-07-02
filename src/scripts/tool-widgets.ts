export function initToolWidgets(scope: ParentNode = document) {
  initAspectTool(scope);
  initTimerTool(scope);
  initSavingsTool(scope);
}

function initAspectTool(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('[data-tool="aspect"]').forEach((root) => {
    if (root.dataset.bound === 'true') return;
    root.dataset.bound = 'true';

    const platform = root.querySelector<HTMLSelectElement>('[data-aspect-platform]');
    const width = root.querySelector<HTMLInputElement>('[data-aspect-width]');
    const height = root.querySelector<HTMLInputElement>('[data-aspect-height]');
    const calcBtn = root.querySelector<HTMLButtonElement>('[data-aspect-calc]');
    const result = root.querySelector<HTMLElement>('[data-aspect-result]');
    const copyRow = root.querySelector<HTMLElement>('[data-aspect-copy-row]');
    const copyBtn = root.querySelector<HTMLButtonElement>('[data-aspect-copy]');

    platform?.addEventListener('change', () => {
      if (!platform || !width || !height) return;
      const [w, h] = platform.value.split('x').map(Number);
      width.value = String(w);
      height.value = String(h);
      updateAspect();
    });

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

    function updateAspect() {
      if (!width || !height || !result || !copyRow) return;
      const w = Number(width.value);
      const h = Number(height.value);
      if (!w || !h) return;
      const d = gcd(w, h);
      const text = `${w}×${h}px — aspect ratio ${w / d}:${h / d}`;
      result.textContent = text;
      result.classList.remove('is-empty');
      copyRow.classList.add('is-visible');
    }

    calcBtn?.addEventListener('click', updateAspect);
    width?.addEventListener('change', updateAspect);
    height?.addEventListener('change', updateAspect);

    copyBtn?.addEventListener('click', async () => {
      if (!width || !height || !copyBtn) return;
      const text = `${width.value}×${height.value}`;
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied!';
        window.setTimeout(() => {
          copyBtn.textContent = 'Copy dimensions';
        }, 1500);
      } catch {
        copyBtn.textContent = 'Copy failed';
      }
    });

    updateAspect();
  });
}

function initTimerTool(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('[data-tool="timer"]').forEach((root) => {
    if (root.dataset.bound === 'true') return;
    root.dataset.bound = 'true';

    const startBtn = root.querySelector<HTMLButtonElement>('[data-timer-start]');
    const minutesInput = root.querySelector<HTMLInputElement>('[data-timer-minutes]');
    const timerResult = root.querySelector<HTMLElement>('[data-timer-result]');
    let timerId: number | undefined;

    startBtn?.addEventListener('click', () => {
      if (!minutesInput || !timerResult || !startBtn) return;
      const total = Number(minutesInput.value) * 60;
      if (!total || total <= 0) return;
      if (timerId) window.clearInterval(timerId);
      startBtn.textContent = 'Restart timer';
      let left = total;
      timerResult.textContent = `Time left: ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
      timerId = window.setInterval(() => {
        left -= 1;
        if (left <= 0) {
          window.clearInterval(timerId);
          timerResult.textContent = 'Session over — time for a break.';
          return;
        }
        timerResult.textContent = `Time left: ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
      }, 1000);
    });
  });
}

function initSavingsTool(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('[data-tool="savings"]').forEach((root) => {
    if (root.dataset.bound === 'true') return;
    root.dataset.bound = 'true';

    const calcBtn = root.querySelector<HTMLButtonElement>('[data-savings-calc]');
    const original = root.querySelector<HTMLInputElement>('[data-savings-original]');
    const sale = root.querySelector<HTMLInputElement>('[data-savings-sale]');
    const result = root.querySelector<HTMLElement>('[data-savings-result]');
    const copyRow = root.querySelector<HTMLElement>('[data-savings-copy-row]');
    const copyBtn = root.querySelector<HTMLButtonElement>('[data-savings-copy]');

    function updateSavings() {
      if (!original || !sale || !result || !copyRow) return;
      const o = Number(original.value);
      const s = Number(sale.value);
      if (!o || s >= o) {
        result.textContent = 'Enter a sale price lower than the original.';
        result.classList.remove('is-empty');
        copyRow.classList.remove('is-visible');
        return;
      }
      const saved = o - s;
      const pct = (saved / o) * 100;
      result.textContent = `You save $${saved.toFixed(2)} (${pct.toFixed(1)}% off)`;
      result.classList.remove('is-empty');
      copyRow.classList.add('is-visible');
    }

    calcBtn?.addEventListener('click', updateSavings);
    original?.addEventListener('change', updateSavings);
    sale?.addEventListener('change', updateSavings);

    copyBtn?.addEventListener('click', async () => {
      if (!result || !copyBtn || result.classList.contains('is-empty')) return;
      try {
        await navigator.clipboard.writeText(result.textContent ?? '');
        copyBtn.textContent = 'Copied!';
        window.setTimeout(() => {
          copyBtn.textContent = 'Copy result';
        }, 1500);
      } catch {
        copyBtn.textContent = 'Copy failed';
      }
    });
  });
}

if (typeof document !== 'undefined') {
  initToolWidgets();
  document.addEventListener('astro:page-load', () => initToolWidgets());
}
