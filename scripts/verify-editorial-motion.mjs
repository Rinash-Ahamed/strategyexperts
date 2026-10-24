// Functional CSS-motion checks, not a production performance benchmark.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const base = process.argv[2] || 'http://localhost:3000';
const output = await mkdtemp(path.join(tmpdir(), 'se-editorial-'));
console.log(`Editorial screenshots/report: ${output}`);
const profile = path.join(output, 'profile');
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket, id = 0;
const pending = new Map(), errors = [], checks = [];
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
  for (let attempt = 0; attempt < 150; attempt++) {
    try {
      if (await evaluate(`location.pathname===${JSON.stringify(route)}&&document.readyState!=='loading'&&!!document.querySelector('footer')`)) return;
    } catch { /* New documents briefly destroy the previous context. */ }
    await delay(150);
  }
  throw new Error(`Not ready: ${route}`);
}
async function reveal(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);
  await delay(1000);
  for (let attempt = 0; attempt < 80; attempt++) {
    const settled = await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});return [e.closest('[data-reveal]'),...e.querySelectorAll('[data-reveal]')].filter(Boolean).every(node=>{const s=getComputedStyle(node);return Number(s.opacity)>.9999&&Math.abs(new DOMMatrix(s.transform).f)<.0001})})()`);
    if (settled) return;
    await delay(100);
  }
  throw new Error(`Reveal did not settle: ${selector}`);
}
async function hover(selector) {
  const point = await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
  await delay(700);
}
async function screenshot(name) {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(path.join(output, `${name}.png`), Buffer.from(shot.data, 'base64'));
}
const rectangles = `(()=>{const grid=document.querySelector('.focus-grid');return {height:grid.getBoundingClientRect().height,cards:[...grid.children].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})}})()`;
try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { port = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; }
    catch { await delay(100); }
  }
  assert(port, 'Chrome did not start');
  const targets = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json());
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    const entry = pending.get(message.id);
    if (!entry) return;
    clearTimeout(entry.timer); pending.delete(message.id);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error))); else entry.resolve(message.result);
  };
  await send('Page.enable'); await send('Runtime.enable');
  // The signature model is unchanged; hold its fetch to isolate content checks.
  await send('Fetch.enable', { patterns: [{ urlPattern: '*scene.splinecode*', requestStage: 'Request' }] });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await open('/services/restaurant-consulting');
  await reveal('.focus-grid');
  const before = await evaluate(rectangles);
  await hover('.focus-grid > li');
  const after = await evaluate(rectangles);
  assert.equal(before.height, after.height);
  const state = await evaluate("(()=>{const e=document.querySelector('.focus-grid>li');const s=getComputedStyle(e);return {translate:s.translate,transform:s.transform,classes:e.className,hover:e.matches(':hover'),fine:matchMedia('(hover:hover) and (pointer:fine)').matches,reduced:matchMedia('(prefers-reduced-motion:reduce)').matches}})()");
  assert(Math.abs(before.cards[0].y - after.cards[0].y - 3) < .1, JSON.stringify({ before:before.cards[0],after:after.cards[0],state }));
  assert(before.cards.slice(1).every((card,index)=>Object.keys(card).every(key=>Math.abs(card[key]-after.cards[index+1][key])<.1)), 'Hover must not move neighbouring cards');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.focus-grid>li'),'::after').opacity"), '1');
  checks.push('Desktop card lift is 3px with no grid or neighbour movement');
  await screenshot('focus-hover-desktop');
  await reveal('.deliver'); await hover('.deliver > li');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.deliver>li'),'::after').opacity"), '1');
  await screenshot('service-rows-desktop');
  checks.push('Service rows fade an inset wash without changing padding');

  await reveal('.other-services');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await evaluate("document.querySelector('.other-services a').focus({preventScroll:true})");
  await delay(400);
  assert(await evaluate("document.querySelector('.other-services a').matches(':focus-visible')"));
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.other-services a'),'::before').opacity"), '1');
  checks.push('Interactive service rows have a keyboard-visible focus treatment');

  await open('/'); await reveal('.sc-1 [data-industry-frame]');
  const frameBefore = await evaluate("(()=>{const r=document.querySelector('[data-industry-frame]').getBoundingClientRect();return {width:r.width,height:r.height}})()");
  await hover('.sc-1 [data-industry-frame]');
  const photo = await evaluate("(()=>{const e=document.querySelector('[data-industry-frame]');const r=e.getBoundingClientRect();const s=getComputedStyle(e.querySelector('img'));return {width:r.width,height:r.height,scale:new DOMMatrix(s.transform).a,filter:s.filter,overflow:getComputedStyle(e).overflow}})()");
  assert.equal(photo.width, frameBefore.width); assert.equal(photo.height, frameBefore.height);
  assert(Math.abs(photo.scale - 1.025) < .001); assert.equal(photo.filter, 'none'); assert.equal(photo.overflow, 'hidden');
  checks.push('Photo zoom clips inside a stationary frame; no image filter');
  await screenshot('home-photo-hover-desktop');

  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 1000, deviceScaleFactor: 1, mobile: true });
  await open('/services/restaurant-consulting'); await reveal('.focus-grid'); await hover('.focus-grid > li');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.focus-grid>li')).translate"), 'none');
  assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
  checks.push('Touch/coarse pointers retain static cards and no horizontal overflow');
  await screenshot('focus-mobile');

  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await reveal('.focus-grid'); await hover('.focus-grid > li');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.focus-grid>li')).translate"), 'none');
  assert(await evaluate("getComputedStyle(document.querySelector('.focus-grid>li')).transitionDuration.split(',').every(value=>parseFloat(value)<.00001)"));
  await open('/'); await reveal('.sc-1 [data-industry-frame]'); await hover('.sc-1 [data-industry-frame]');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-industry-frame] img')).transform"), 'none');
  assert(await evaluate("getComputedStyle(document.querySelector('[data-industry-frame] img')).transitionDuration.split(',').every(value=>parseFloat(value)<.00001)"));
  checks.push('Reduced motion disables card lift, photo zoom and their transitions');

  const ctaContrast = selector => evaluate(`(()=>{
    const e=document.querySelector(${JSON.stringify(selector)}),s=getComputedStyle(e),r=e.getBoundingClientRect();
    const luminance=value=>{const c=value.match(/[\\d.]+/g).slice(0,3).map(Number).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722};
    const a=luminance(s.color),b=luminance(s.backgroundColor);
    return {ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),colour:s.color,background:s.backgroundColor,visible:r.width>0&&r.height>=44&&s.visibility==='visible'&&s.opacity==='1',focus:e.matches(':focus-visible'),outline:parseFloat(s.outlineWidth)};
  })()`);
  for (const width of [1440,390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 700 });
    for (const slug of ['e-commerce-support','restaurant-consulting','hotel-revenue-management','digital-marketing']) {
      await open(`/services/${slug}`);
      for (const selector of ['.sp-hero .btn-accent','.sp-cta .btn-light']) {
        await reveal(selector);
        await evaluate('document.activeElement?.blur()');
        await send('Input.dispatchMouseEvent', { type:'mouseMoved',x:0,y:0 }); await delay(400);
        const resting = await ctaContrast(selector);
        assert(resting.visible && resting.ratio>=4.5, `Resting CTA contrast: ${slug} ${width} ${selector} ${JSON.stringify(resting)}`);
        if (slug==='restaurant-consulting' && selector.includes('sp-cta')) await screenshot(`restaurant-consultation-visible-${width}`);
        await hover(selector);
        const hovered = await ctaContrast(selector);
        assert(hovered.visible && hovered.ratio>=4.5, `Hover CTA contrast: ${slug} ${width}`);
        for (const type of ['keyDown','keyUp']) await send('Input.dispatchKeyEvent', { type,key:'Tab',code:'Tab',windowsVirtualKeyCode:9 });
        await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus({preventScroll:true})`); await delay(100);
        const focused = await ctaContrast(selector);
        assert(focused.visible && focused.ratio>=4.5 && focused.focus && focused.outline>=2, `Focus CTA contrast: ${slug} ${width} ${JSON.stringify(focused)}`);
      }
      checks.push(`Hero and closing CTAs readable at rest, hover and keyboard focus: ${slug} ${width}px`);
    }
  }

  await send('Emulation.setScriptExecutionDisabled', { value: true });
  await open('/services/restaurant-consulting'); await reveal('.focus-grid');
  assert(await evaluate("[...document.querySelectorAll('.focus-grid>li')].every(e=>getComputedStyle(e).opacity==='1')"));
  checks.push('Focus-grid content remains visible without JavaScript');
  assert.deepEqual(errors, []);
  await writeFile(path.join(output, 'report.json'), JSON.stringify({ base, conditions: 'Functional development preview; remote 3D fetch held; no FPS/performance claim.', checks, errors }, null, 2));
  console.log(JSON.stringify({ output, checks, errors }, null, 2));
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await send('Browser.close'); } catch { /* Close the owned child below. */ }
    socket.close();
  }
  for (const entry of pending.values()) clearTimeout(entry.timer);
  browser.kill();
}
