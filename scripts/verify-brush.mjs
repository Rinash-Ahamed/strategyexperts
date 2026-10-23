// Focused full-document brush checks, using system Chrome and no dependencies.
// Use a production server for timing comparisons. --block-framework verifies
// that document navigation and the brush do not depend on React hydration.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const base = process.argv[2] || 'http://localhost:3122';
const label = process.argv[3] || 'brush';
const blockFramework = process.argv.includes('--block-framework');
const includeHome = process.argv.includes('--include-home');
const remountOverlay = process.argv.includes('--remount-overlay');
const remountDuringDraw = process.argv.includes('--remount-during-draw');
const output = await mkdtemp(path.join(tmpdir(), `se-${label}-`));
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${path.join(output, 'profile')}`,
  '--no-first-run', '--no-default-browser-check', '--enable-unsafe-swiftshader',
  '--use-angle=swiftshader', 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map();
const errors = [];
let blockedRequests = 0;
let drawEvidence;
let socket;
let id = 0;
async function send(method, params = {}) {
  const request = ++id;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(request); reject(new Error(`Timeout: ${method}`)); }, 20000);
    pending.set(request, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: request, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function ready(route) {
  for (let i = 0; i < 150; i++) {
    try {
      if (await evaluate(`location.pathname === ${JSON.stringify(route)} && document.querySelector('.route-transition')?.dataset.state === 'idle' && document.querySelector('.route-transition path')?.style.strokeWidth === '200'`)) return;
    } catch { /* A document replacement temporarily destroys its JS context. */ }
    await delay(100);
  }
  throw new Error(`Brush did not become ready: ${route}`);
}
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(path.join(output, 'profile', 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; }
    catch { await delay(100); }
  }
  if (!port) throw new Error('Chrome did not start');
  const targets = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json());
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.bindingCalled' && message.params.name === 'brushTestReport') {
      drawEvidence = JSON.parse(message.params.payload);
    }
    if (message.method === 'Network.loadingFailed' && message.params.blockedReason === 'inspector') blockedRequests++;
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      errors.push(message.params.args.map(arg => arg.value ?? arg.description ?? '').join(' '));
    }
    const entry = pending.get(message.id);
    if (!entry) return;
    clearTimeout(entry.timer); pending.delete(message.id);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error))); else entry.resolve(message.result);
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Runtime.addBinding', { name: 'brushTestReport' });
  if (blockFramework) await send('Network.setBlockedURLs', { urls: ['*/_next/static/chunks/*.js*'] });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__brushCheck = {states: [], longTasks: [], modelMountedDuringBrush: false, documentId: Math.random()};
    const drawSamples = [];
    let drawSent = false;
    let remounted = false;
    new MutationObserver(() => {
      const state = document.querySelector('.route-transition')?.dataset.state;
      const states = window.__brushCheck.states;
      if (state && states.at(-1)?.state !== state) states.push({state, time: performance.now()});
      if (state === 'arrival' && document.querySelector('.hero-robot canvas')) window.__brushCheck.modelMountedDuringBrush = true;
      if (state === 'covering') {
        const path = document.querySelector('.route-transition path');
        const overlay = path.closest('.route-transition');
        const style = getComputedStyle(overlay);
        drawSamples.push({width:+path.style.strokeWidth,offset:+path.style.strokeDashoffset,
          visible:overlay.isConnected && style.visibility==='visible' && style.display!=='none' && Number(style.opacity)>0});
        if (${remountDuringDraw} && !remounted && drawSamples.length >= 3) {
          remounted = true;
          const overlay = document.querySelector('.route-transition');
          overlay.replaceWith(overlay.cloneNode(true));
        }
      }
      if (state === 'covered' && drawSamples.length && !drawSent) {
        drawSent = true;
        window.brushTestReport(JSON.stringify({samples:drawSamples.length,visibleSamples:drawSamples.filter(s=>s.visible).length,first:drawSamples[0],last:drawSamples.at(-1)}));
      }
    }).observe(document, {subtree:true, childList:true, attributes:true, attributeFilter:['data-state','style']});
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) window.__brushCheck.longTasks.push({start:entry.startTime,duration:entry.duration});
    }).observe({type:'longtask',buffered:true});
  ` });
  const runs = [];
  for (const width of [1440, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
    await send('Page.navigate', { url: base + '/services/restaurant-consulting' });
    await ready('/services/restaurant-consulting');
    const routes = ['/services/digital-marketing', '/services/hotel-revenue-management', '/contact'];
    if (includeHome) routes.push('/');
    for (const route of routes) {
      const before = await evaluate('window.__brushCheck.documentId');
      if (remountOverlay) {
        await evaluate(`(()=>{const overlay=document.querySelector('.route-transition');overlay.replaceWith(overlay.cloneNode(true));})()`);
      }
      drawEvidence = undefined;
      await evaluate(`document.querySelector('a[href=${JSON.stringify(route)}]').click()`);
      await ready(route);
      const result = await evaluate(`({ ...window.__brushCheck, route:location.pathname, overflow:document.documentElement.scrollWidth>innerWidth, navigation:performance.getEntriesByType('navigation').map(n=>({responseStart:n.responseStart,domContentLoaded:n.domContentLoadedEventEnd}))[0] })`);
      result.width = width;
      // Observe inside the source document rather than relying on wall-clock
      // CDP samples that can miss the animation when software rendering stalls.
      result.drawEvidence = drawEvidence;
      result.drawsAndThickens = drawEvidence?.samples > 1 && drawEvidence.visibleSamples > 1 && drawEvidence.last.width > drawEvidence.first.width && drawEvidence.last.offset < drawEvidence.first.offset;
      result.fullDocument = before !== result.documentId;
      result.erases = result.states.some(s => s.state === 'arrival');
      result.pass = result.drawsAndThickens && result.fullDocument && result.erases && !result.overflow && !result.modelMountedDuringBrush;
      runs.push(result);
    }
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(path.join(output, `${width}.png`), Buffer.from(screenshot.data, 'base64'));
  }
  const report = { base, label, blockFramework, remountOverlay, remountDuringDraw, blockedRequests, runs, errors, output };
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (errors.length || runs.some(r => !r.pass) || (blockFramework && !blockedRequests)) process.exitCode = 1;
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await send('Browser.close'); } catch {}
    socket.close();
  }
  browser.kill();
}
