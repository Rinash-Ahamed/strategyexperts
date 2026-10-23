// Runs from server-rendered HTML, independently of React hydration.
export const BRUSH_RUNTIME = String.raw`(() => {
  let overlay = document.querySelector('.route-transition');
  if (!overlay || overlay.dataset.brushReady) return;
  overlay.dataset.brushReady = 'true';
  const root = document.documentElement;
  let paths = [...overlay.querySelectorAll('path')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'strategy-experts:route-transition';
  const warmed = new Set();
  let frame = 0, finish, busy = false;
  const clearToken = () => { try { sessionStorage.removeItem(key); } catch {} };
  const paint = (offset, width) => {
    for (const path of paths) {
      path.style.strokeDashoffset = String(offset);
      path.style.strokeWidth = String(width);
    }
  };
  // Hot updates can replace the server-rendered overlay without replacing the
  // document listener. Never draw into the old, detached SVG in that case.
  const bindOverlay = () => {
    if (overlay.isConnected) return true;
    const current = document.querySelector('.route-transition');
    if (!current) return false;
    const currentPaths = [...current.querySelectorAll('path')];
    if (!currentPaths.length) return false;
    const state = overlay.dataset.state;
    const offset = Number(paths[0]?.style.strokeDashoffset || '1');
    const width = Number(paths[0]?.style.strokeWidth || '200');
    overlay = current;
    paths = currentPaths;
    overlay.dataset.brushReady = 'true';
    overlay.dataset.state = state || 'idle';
    paint(offset, width);
    return true;
  };
  const hide = () => {
    cancelAnimationFrame(frame);
    if (finish) { const done = finish; finish = undefined; done(false); }
    paint(1, 200);
    overlay.dataset.state = 'idle';
    root.classList.remove('route-arrival');
    root.removeAttribute('data-route-transition');
    busy = false;
  };
  // Exact reference timing and quadratic easing, with no per-frame React work.
  const brush = direction => new Promise(resolve => {
    finish = resolve;
    let started;
    const tick = now => {
      if (!bindOverlay()) { finish = undefined; hide(); resolve(false); return; }
      if (started === undefined) started = now;
      const t = Math.min((now - started) / 1000, 1);
      const e = t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      paint(direction === 'in' ? 1 - e : -e,
        direction === 'in' ? 200 + 500 * e : 700 - 500 * e);
      if (t < 1) frame = requestAnimationFrame(tick);
      else { finish = undefined; resolve(true); }
    };
    frame = requestAnimationFrame(tick);
  });
  let arriving = false;
  try { arriving = sessionStorage.getItem(key) === '1'; } catch {}
  if (arriving && !motion.matches) {
    busy = true;
    paint(0, 700);
    overlay.dataset.state = 'arrival';
    root.setAttribute('data-route-transition', 'true');
    root.classList.remove('route-arrival');
    const reveal = () => {
      // Parsed HTML is enough: never wait for framework/robot JS or window.load.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(async () => {
          if (await brush('out')) { clearToken(); hide(); }
        });
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reveal, { once: true });
    else reveal();
  } else { clearToken(); hide(); }
  const destinationFor = anchor => {
    if (!anchor || anchor.hasAttribute('download') || anchor.dataset.noTransition !== undefined ||
      (anchor.target && anchor.target !== '_self')) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin ||
      (url.pathname === location.pathname && url.search === location.search)) return;
    return url;
  };
  const warm = anchor => {
    const url = destinationFor(anchor);
    if (!url || warmed.has(url.href) || warmed.size >= 8 || navigator.connection?.saveData ||
      /(^|-)2g$/.test(navigator.connection?.effectiveType || '')) return;
    warmed.add(url.href);
    const link = document.createElement('link');
    link.rel = 'prefetch'; link.as = 'document'; link.href = url.href;
    document.head.appendChild(link);
  };
  const intent = event => {
    if (event.target instanceof Element) warm(event.target.closest('a[href]'));
  };
  document.addEventListener('pointerover', intent, { passive: true });
  document.addEventListener('pointerdown', intent, { passive: true });
  document.addEventListener('focusin', intent);
  document.addEventListener('click', async event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href]');
    const url = destinationFor(anchor);
    if (!url) return;
    if (!bindOverlay()) return;
    event.preventDefault(); event.stopPropagation();
    if (busy) return;
    if (motion.matches) { location.assign(url.href); return; }
    busy = true;
    warm(anchor);
    overlay.dataset.state = 'covering';
    root.setAttribute('data-route-transition', 'true');
    if (!(await brush('in'))) return;
    overlay.dataset.state = 'covered';
    try { sessionStorage.setItem(key, '1'); } catch {}
    location.assign(url.href);
  }, true);
  addEventListener('pageshow', event => {
    if (event.persisted) { bindOverlay(); clearToken(); hide(); }
  });
  motion.addEventListener('change', () => {
    if (motion.matches && bindOverlay() && overlay.dataset.state === 'arrival') { clearToken(); hide(); }
  });
})();`;
