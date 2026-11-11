// Local production comparison, not field Core Web Vitals or Vercel billing.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const base = process.argv[2] || 'http://localhost:3011';
const destination = process.argv[3];
assert(destination, 'Supply an output JSON filename.');
const output = await mkdtemp(path.join(tmpdir(), 'se-image-audit-'));
console.log('Temporary browser:', output);
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${output}/profile`, '--no-first-run'], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket, id = 0;
const pending = new Map();
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const request = ++id;
    const timer = setTimeout(() => { pending.delete(request); reject(new Error(method)); }, 45000);
    pending.set(request, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: request, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(`${output}/profile/DevToolsActivePort`, 'utf8')).split('\n')[0]; break; }
    catch { await delay(100); }
  }
  assert(port, 'Chrome did not start.');
  const targets = await fetch(`http://localhost:${port}/json`).then(r => r.json());
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data), entry = pending.get(message.id);
    if (!entry) return;
    clearTimeout(entry.timer); pending.delete(message.id);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error))); else entry.resolve(message.result);
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.auditMetrics={lcp:0,cls:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.auditMetrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.auditMetrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});` });
  const runs = [];
  for (const width of [390, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 2, mobile: width === 390 });
    // Same simulated 1.6 Mbps download / 150ms latency on mobile before/after.
    await send('Network.emulateNetworkConditions', { offline: false, latency: width === 390 ? 150 : 0, downloadThroughput: width === 390 ? 200000 : -1, uploadThroughput: width === 390 ? 93750 : -1 });
    for (const route of ['/', '/services/e-commerce-support', '/services/restaurant-consulting', '/services/hotel-revenue-management', '/services/digital-marketing']) {
      await send('Network.clearBrowserCache');
      await send('Page.navigate', { url: base + route });
      let ready = false;
      for (let i = 0; i < 250; i++) {
        try { ready = await evaluate(`location.pathname===${JSON.stringify(route)}&&document.readyState==='complete'&&!!document.querySelector('h1')`); } catch { /* Navigation. */ }
        if (ready) break;
        await delay(200);
      }
      assert(ready, route); await evaluate('document.fonts.ready'); await delay(1000);
      const initial = await evaluate(`({ ...window.auditMetrics, load:performance.getEntriesByType('navigation')[0].loadEventEnd })`);
      // Trigger native lazy images without changing existing page effects.
      await evaluate(`(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=650){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,100));}for(const i of [...document.images].filter(i=>i.loading==='lazy')){i.scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,40));}await new Promise(r=>setTimeout(r,700));await Promise.all([...document.images].filter(i=>i.currentSrc).map(i=>i.decode().catch(()=>{})));})()`);
      const data = await evaluate(`(()=>{const images=[...document.images];const entries=performance.getEntriesByType('resource').filter(e=>e.initiatorType==='img');const candidates=[...new Set(images.flatMap(i=>(i.srcset||'').split(', ').map(s=>s.replace(/ \\d+w$/,'')).filter(Boolean)))];return {images:images.length,broken:images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc||i.src),overflow:document.documentElement.scrollWidth>innerWidth,resources:entries.map(e=>({url:e.name.replace(location.origin,''),bytes:e.encodedBodySize,duration:e.duration})),optimizerRequests:entries.filter(e=>/\\/_(next|vercel)\\/image\\?/.test(e.name)).length,potentialOptimizerVariants:candidates.filter(s=>s.includes('/_next/image?')).length,bytes:entries.reduce((s,e)=>s+e.encodedBodySize,0),cls:window.auditMetrics.cls};})()`);
      runs.push({ route, width, ...initial, ...data });
      console.log(route, width, JSON.stringify({ optimizerRequests: data.optimizerRequests, bytes: data.bytes, lcp: initial.lcp, cls: data.cls, broken: data.broken.length }));
    }
  }
  await writeFile(destination, JSON.stringify({ base, conditions: 'Local production; cold browser cache per page, server image cache retained; DPR 2; Chrome headless; mobile 1.6Mbps/150ms, desktop unthrottled; one run per route/device, not Lighthouse or field metrics.', runs }, null, 2));
  assert(runs.every(r => !r.broken.length && !r.overflow), 'Broken images or horizontal overflow.');
  await send('Browser.close');
} finally {
  socket?.close(); browser.kill();
  for (const entry of pending.values()) clearTimeout(entry.timer);
  await Promise.race([new Promise(resolve => browser.exitCode !== null ? resolve() : browser.once('exit', resolve)), delay(3000)]);
  const resolved = await realpath(output), root = await realpath(tmpdir());
  assert.equal(path.dirname(resolved), root);
  assert.equal(path.basename(resolved), path.basename(output));
  await rm(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
  console.log('Task temporary browser folder removed.');
}
