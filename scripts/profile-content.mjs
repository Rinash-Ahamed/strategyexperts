// Isolate document/content loading from the independently profiled external 3D scene.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const base = process.argv[2] || 'http://localhost:3126';
const label = process.argv[3] || 'content';
const output = await mkdtemp(path.join(tmpdir(), `se-${label}-`));
console.log(`Content profile: ${output}`);
const profile = path.join(output, 'profile');
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
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
      if (await evaluate(`location.pathname===${JSON.stringify(route)}&&document.readyState!=='loading'&&!!document.querySelector('footer')`)) return;
    } catch { /* Navigation replaces the context. */ }
    await delay(100);
  }
  throw new Error(`Not ready: ${route}`);
}
const onlyRoute = process.argv.find(arg => arg.startsWith('--route='))?.slice(8);
const routes = onlyRoute ? [onlyRoute] : ['/', '/services/e-commerce-support', '/services/restaurant-consulting', '/services/hotel-revenue-management', '/services/digital-marketing', '/contact'];
const report = { conditions: 'Production localhost; Chrome DPR 1; no CPU/network throttling. External scene fetch held pending to isolate content, NOT whole-homepage/robot performance. 2 cold-cache samples per route/viewport; LCP observation window 2 seconds after DOM ready.', runs: [], bundles: [], errors: [] };
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
    const m = JSON.parse(event.data);
    if (m.method === 'Runtime.exceptionThrown') report.errors.push(m.params.exceptionDetails.text);
    const p = pending.get(m.id);
    if (!p) return;
    clearTimeout(p.timer); pending.delete(m.id);
    if (m.error) p.reject(new Error(JSON.stringify(m.error))); else p.resolve(m.result);
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Fetch.enable', { patterns: [{ urlPattern: '*scene.splinecode*', requestStage: 'Request' }] });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__content={lcp:0,cls:0,blockingMs:0,shifts:[]};for(const type of ['largest-contentful-paint','layout-shift','longtask'])new PerformanceObserver(list=>{for(const e of list.getEntries()){if(type==='largest-contentful-paint')__content.lcp=e.startTime;if(type==='layout-shift'&&!e.hadRecentInput){__content.cls+=e.value;__content.shifts.push({at:e.startTime,value:e.value,sources:e.sources.map(s=>({node:s.node?.outerHTML.slice(0,200),before:s.previousRect.toJSON(),after:s.currentRect.toJSON()}))})}if(type==='longtask')__content.blockingMs+=Math.max(0,e.duration-50)}}).observe({type,buffered:true});` });
  for (const width of (process.argv.includes('--desktop-only') ? [1440] : [390, 1440])) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
    await send('Emulation.setTouchEmulationEnabled', { enabled: width < 700 });
    for (let sample = 1; sample <= 2; sample++) for (const route of routes) {
      await open(route); await delay(2000);
      const result = await evaluate(`(()=>{const n=performance.getEntriesByType('navigation')[0];return {...__content,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,ttfb:n.responseStart,domReady:n.domContentLoadedEventEnd,overflow:document.documentElement.scrollWidth>innerWidth,resources:performance.getEntriesByType('resource').reduce((sum,e)=>sum+e.transferSize,0)}})()`);
      report.runs.push({ route, width, sample, ...result });
      assert.equal(result.overflow, false);
      if (route === '/' && width === 1440 && sample === 2) {
        report.pointerBurst = await evaluate(`(()=>{const e=document.querySelector('.hero-robot'),original=e.getBoundingClientRect;let reads=0;e.getBoundingClientRect=function(){reads++;return original.call(this)};const start=performance.now();for(let i=0;i<100;i++)window.dispatchEvent(new PointerEvent('pointermove',{clientX:600+i,clientY:280,pointerType:'mouse'}));const syncMs=performance.now()-start;const synchronousReads=reads;return new Promise(resolve=>setTimeout(()=>{e.getBoundingClientRect=original;resolve({events:100,synchronousReads,totalReads:reads,syncMs,tracking:e.dataset.headTracking})},100))})()`);
      }
    }
  }
  for (const route of routes) {
    const response = await fetch(base + route), html = await response.text();
    const scripts = [...new Set([...html.matchAll(/<script[^>]*src="([^"]+)/g)].map(m => m[1]))];
    let gzipJs = 0;
    for (const src of scripts) gzipJs += gzipSync(Buffer.from(await (await fetch(new URL(src, base))).arrayBuffer())).length;
    report.bundles.push({ route, status: response.status, initialScriptGzipBytes: gzipJs, htmlBytes: Buffer.byteLength(html) });
  }
  assert.deepEqual(report.errors, []);
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  if (socket?.readyState === WebSocket.OPEN) { try { await send('Browser.close'); } catch {} socket.close(); }
  for (const p of pending.values()) clearTimeout(p.timer);
  chrome.kill();
}
