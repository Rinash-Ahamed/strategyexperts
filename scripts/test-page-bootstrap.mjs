// Unit checks for the trusted inline bootstrap; browser tests cover actual CSS/history.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const text = await readFile(new URL('../lib/page-bootstrap.ts', import.meta.url), 'utf8');
const source = text.split('String.raw`')[1].split('`;')[0];
function boot({ reload = true, reduced = false, pathname = '/' } = {}) {
  const listeners = new Map(), timers = new Map(), root = { dataset: {}, classList: { add() {} } };
  let scrolls = 0, timerId = 0;
  const add = (name, fn) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); };
  const remove = (name, fn) => listeners.get(name)?.delete(fn);
  const context = {
    document: { documentElement: root, addEventListener: add },
    history: { scrollRestoration: 'auto' }, location: { pathname },
    performance: { getEntriesByType: () => [{ type: reload ? 'reload' : 'navigate' }] },
    matchMedia: () => ({ matches: reduced, addEventListener: add, removeEventListener: remove }),
    addEventListener: add, removeEventListener: remove,
    scrollTo: () => { scrolls++; }, Element: class {},
    setTimeout: fn => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: id => timers.delete(id),
  };
  vm.runInNewContext(source, context);
  return { root, timers, context, emit: (name, event = {}) => { for (const fn of [...listeners.get(name) ?? []]) fn(event); }, scrolls: () => scrolls };
}
for (const options of [{ reload: false }, { reduced: true }, { pathname: '/services/restaurant-consulting' }]) {
  const app = boot(options);
  assert.equal(app.root.dataset.openingTrigger, undefined);
  assert.equal(app.timers.size, 0);
}
const ready = boot();
assert.equal(ready.root.dataset.openingTrigger, 'refresh');
ready.emit('strategy-experts:opening-finished');
assert.equal(ready.root.dataset.openingTrigger, undefined);
assert.equal(ready.timers.size, 0);
assert.equal(ready.context.history.scrollRestoration, 'auto');

const restored = boot();
restored.emit('DOMContentLoaded'); restored.emit('pageshow', { persisted: false });
const before = restored.scrolls();
restored.emit('pageshow', { persisted: true });
assert.equal(restored.root.dataset.openingTrigger, undefined);
assert.equal(restored.timers.size, 0, 'History restoration cancels the failure watchdog');
restored.emit('keydown', { key: 'Escape' });
assert.equal(restored.scrolls(), before, 'Restored documents must not jump to the top from a stale opening listener');
console.log('PASS: refresh-only detection, reduced motion, ready cleanup and active-opening BFCache cleanup.');
