/** Runs before hydration so the refresh opening and Skip do not depend on React. */
export const PAGE_BOOTSTRAP = String.raw`(() => {
  const root = document.documentElement;
  root.classList.add('js');
  let abandon = () => {};
  const reset = () => {
    delete root.dataset.openingTrigger;
    delete root.dataset.openingManaged;
    history.scrollRestoration = 'auto';
  };
  addEventListener('pageshow', event => { if (event.persisted) { abandon(); reset(); } });
  const reload = performance.getEntriesByType('navigation')[0]?.type === 'reload' || performance.navigation?.type === 1;
  if (location.pathname !== '/' || !reload) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  root.dataset.openingTrigger = 'refresh';
  history.scrollRestoration = 'manual';
  const top = () => scrollTo({ top: 0, left: 0, behavior: 'instant' });
  top();
  document.addEventListener('DOMContentLoaded', top, { once: true });
  addEventListener('pageshow', event => { if (!event.persisted) top(); }, { once: true });
  let watchdog;
  const finish = () => {
    abandon();
    reset();
    top();
  };
  const skip = event => {
    if (event.target instanceof Element && event.target.closest('[data-opening-skip]')) finish();
  };
  const key = event => { if (['Escape', 'Tab', 'Enter', ' '].includes(event.key)) finish(); };
  const preference = () => { if (motion.matches) finish(); };
  abandon = () => {
    clearTimeout(watchdog);
    removeEventListener('click', skip);
    removeEventListener('keydown', key);
    removeEventListener('strategy-experts:opening-finished', finish);
    motion.removeEventListener('change', preference);
  };
  addEventListener('click', skip);
  addEventListener('keydown', key);
  addEventListener('strategy-experts:opening-finished', finish);
  motion.addEventListener('change', preference);
  // Only a failed client/scene uses this escape; normal exit is robot-ready.
  watchdog = setTimeout(finish, 60000);
})();`;
