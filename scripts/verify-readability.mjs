// Layout/contrast regression; works with dev previews, not a performance benchmark.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import axe from 'axe-core';

const base = process.argv[2] || 'http://localhost:3000';
const output = await mkdtemp(path.join(tmpdir(), 'se-readability-'));
console.log('Artifacts:', output);
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${output}/profile`, '--no-first-run',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket, id = 0;
const pending = new Map(), checks = [], errors = [];
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
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(`${output}/profile/DevToolsActivePort`, 'utf8')).split('\n')[0]; break; }
    catch { await delay(100); }
  }
  assert(port, 'Chrome did not start');
  const targets = await fetch(`http://localhost:${port}/json`).then(r => r.json());
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
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const routes = ['/', '/services/e-commerce-support', '/services/restaurant-consulting', '/services/hotel-revenue-management', '/services/digital-marketing', '/pricing', '/contact'];
  for (const route of routes) {
    await send('Page.navigate', { url: base + route });
    let ready = false;
    for (let i = 0; i < 150; i++) {
      try { ready = await evaluate(`location.pathname===${JSON.stringify(route)}&&document.readyState==='complete'&&!!document.querySelector('h1')`); } catch { /* Replacing document. */ }
      if (ready) break;
      await delay(200);
    }
    assert(ready, route);
    await evaluate('document.fonts.ready');
    await evaluate(axe.source);
    for (const width of [320, 360, 390, 430, 600, 768, 820, 1024, 1180, 1280, 1440, 1920]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 700 });
      await evaluate("scrollTo({top:0,behavior:'instant'})"); await delay(200);
      const layout = await evaluate(`(()=>{
        const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}};
        const heading=document.querySelector('h1');const h=box(heading);
        const adjacent=heading.closest('.hero-brand,.stack-m')?.querySelector('p');const p=adjacent&&box(adjacent);
        const firstLine=heading.querySelector('.line-mask')||heading;
        const rgb=getComputedStyle(firstLine).color.match(/[\\d.]+/g).slice(0,3).map(Number);
        const linear=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});
        const headingContrast=(.2126*linear[0]+.7152*linear[1]+.0722*linear[2]+.05)/.05;
        return {overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,headingContrast,
          headingOverlapsCopy:!!p&&h.bottom>p.top+1,headingClipped:h.left<0||h.right>innerWidth+1,
          navigation:getComputedStyle(document.querySelector('.nav-links')).display!=='none'||getComputedStyle(document.querySelector('.burger')).display!=='none'};
      })()`);
      let violations = [], incomplete = [];
      if ([390, 1440].includes(width)) {
        const result = await evaluate(`axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}).then(r=>({violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)}))`);
        ({ violations, incomplete } = result);
      }
      checks.push({ route, width, ...layout, violations, incomplete });
      if (width === 1440) {
        for (const selector of ['.cta,.sp-cta', '.focus-block', 'footer']) {
          if (!await evaluate(`!!document.querySelector(${JSON.stringify(selector)})`)) continue;
          await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);
          await delay(250);
          await writeFile(`${output}/${route==='/'?'home':route.split('/').at(-1)}-${selector.includes('cta')?'cta':selector.includes('focus')?'cards':'footer'}.png`, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
        }
        await evaluate("scrollTo({top:0,behavior:'instant'})");
      }
      if ([390, 768, 1440].includes(width)) {
        await writeFile(`${output}/${route==='/'?'home':route.split('/').at(-1)}-${width}.png`, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      }
    }
    console.log(route, JSON.stringify(checks.filter(c=>c.route===route&&(!c.navigation||c.overflow||c.headingClipped||c.headingOverlapsCopy||c.violations.length))));
  }
  await writeFile(`${output}/report.json`, JSON.stringify({ base, checks, errors }, null, 2));
  if (process.argv.includes('--strict')) {
    assert.deepEqual(errors, []);
    assert(checks.every(c=>!c.overflow&&!c.headingClipped&&!c.headingOverlapsCopy&&c.navigation&&c.headingContrast>=4.5&&!c.violations.length), 'Layout or accessibility regression; see report');
  }
  console.log('Completed', checks.length, 'layout checks.');
  await send('Browser.close');
} finally {
  socket?.close(); browser.kill();
  for (const entry of pending.values()) clearTimeout(entry.timer);
}
