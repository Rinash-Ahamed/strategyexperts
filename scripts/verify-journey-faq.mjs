// Focused functional checks; the unchanged external robot is excluded, not benchmarked.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const base = process.argv[2] || 'http://localhost:3001';
const output = await mkdtemp(path.join(tmpdir(), 'se-journey-'));
console.log(`Screenshots: ${output}`);
const profile = path.join(output, 'profile');
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map();
let socket, id = 0;
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const request = ++id;
    const timer = setTimeout(() => { pending.delete(request); reject(new Error(method)); }, 30000);
    pending.set(request, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: request, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function open(route) {
  await send('Page.navigate', { url: base + route });
  for (let i = 0; i < 150; i++) {
    try {
      if (await evaluate(`location.pathname===${JSON.stringify(route)}&&!!document.querySelector('footer')`)) return;
    } catch { /* Navigation replaces the execution context. */ }
    await delay(150);
  }
  throw new Error(`Not ready: ${route}`);
}
async function shot(selector, name) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);
  await delay(1500);
  const result = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64'));
}
const services = [
  ['e-commerce-support', 'Before your next marketplace move.'],
  ['restaurant-consulting', 'Behind a stronger restaurant business.'],
  ['hotel-revenue-management', 'Clarity before your next booking.'],
  ['digital-marketing', 'Before your next campaign.'],
];
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; }
    catch { await delay(100); }
  }
  assert(port, 'Chrome did not start');
  const targets = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json());
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data), entry = pending.get(message.id);
    if (!entry) return;
    clearTimeout(entry.timer); pending.delete(message.id);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error))); else entry.resolve(message.result);
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Page.bringToFront');
  await send('Fetch.enable', { patterns: [{ urlPattern: '*scene.splinecode*', requestStage: 'Request' }] });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const width of [390, 820, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
    await open('/'); await shot('.process', `journey-${width}`);
    assert.equal(await evaluate("document.querySelectorAll('.process ol > li').length"), 4);
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'), `Home overflow ${width}`);
    const columns = await evaluate("getComputedStyle(document.querySelector('.process ol')).gridTemplateColumns.split(' ').length");
    assert.equal(columns, width < 960 ? 1 : 4);
    for (const [slug, title] of services) {
      await open(`/services/${slug}`); await shot('.service-faq', `${slug}-${width}`);
      assert.equal(await evaluate("document.querySelector('#faq-title').textContent"), title);
      assert.equal(await evaluate("document.querySelector('.faq-consultation').getAttribute('href')"), `/contact?service=${slug}`);
      assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'), `${slug} overflow ${width}`);
      await evaluate("document.querySelector('.service-faq summary').focus()");
      assert(await evaluate("document.activeElement.matches('.service-faq summary')"), 'Summary receives keyboard focus');
      for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, ...(type === 'keyDown' ? { text: '\r' } : {}) });
      await delay(150);
      assert(await evaluate("document.querySelector('.service-faq details').open"), `Enter opens native FAQ: ${slug} at ${width}`);
      for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, ...(type === 'keyDown' ? { text: '\r' } : {}) });
      await delay(150);
      assert.equal(await evaluate("document.querySelector('.service-faq details').open"), false);
    }
  }
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await open('/'); await shot('.process', 'journey-desktop-motion');
  const marker = await evaluate("(()=>{const r=document.querySelector('.process ol span').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...marker });
  await delay(500);
  assert.equal(await evaluate("new DOMMatrix(getComputedStyle(document.querySelector('.process ol span')).transform).f"), -4);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate("new DOMMatrix(getComputedStyle(document.querySelector('.process ol span')).transform).f"), 0);
  await send('Emulation.setScriptExecutionDisabled', { value: true });
  await open('/services/digital-marketing');
  await evaluate("document.querySelector('.service-faq summary').click()");
  assert(await evaluate("document.querySelector('.service-faq details').open"), 'Native accordion works without JavaScript');
  await open('/');
  assert.equal(await evaluate("[...document.querySelectorAll('.process ol h3')].filter(e=>getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).opacity!=='0').length"), 4);
  console.log('PASS: 3 journey layouts, 12 service FAQ layouts, keyboard toggles, consultation links, hover/reduced motion and no-JavaScript content.');
} finally {
  if (socket?.readyState === WebSocket.OPEN) { try { await send('Browser.close'); } catch {} socket.close(); }
  for (const entry of pending.values()) clearTimeout(entry.timer);
  browser.kill();
}
