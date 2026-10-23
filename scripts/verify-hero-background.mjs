// Background-only visual checks against a local server. No scene mutations.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const base = process.argv[2] || 'http://localhost:3124';
const label = process.argv[3] || 'hero';
const after = process.argv.includes('--after');
const desktopOnly = process.argv.includes('--desktop-only');
const output = await mkdtemp(path.join(tmpdir(), `se-${label}-`));
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${path.join(output, 'profile')}`,
  '--no-first-run', '--no-default-browser-check', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map();
let socket, id = 0;
const errors = [];
async function send(method, params = {}) {
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
    try { port = (await readFile(path.join(output, 'profile', 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; }
    catch { await delay(100); }
  }
  const targets = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json());
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id); clearTimeout(entry.timer);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error))); else entry.resolve(message.result);
  };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: base });
  for (let i = 0; i < 160; i++) {
    if (await evaluate(`Boolean(document.querySelector('.hero-robot.is-loaded canvas'))`)) break;
    await delay(300);
  }
  const canvasEdge = await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>{
    const source=document.querySelector('.hero-robot canvas');
    if(!source){resolve(null);return;}
    const test=document.createElement('canvas');test.width=test.height=16;
    const ctx=test.getContext('2d');ctx.drawImage(source,0,0,16,16);
    try{resolve([...ctx.getImageData(0,0,1,1).data]);}catch(e){resolve({error:String(e)});}
  }))`);
  const viewports = [];
  const sizes = [[1440,1000,'desktop'],[1440,800,'laptop'],[820,1180,'tablet'],[390,844,'mobile']];
  for (const [width, height, name] of sizes.filter(size=>!desktopOnly || size[2]==='desktop')) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 });
    await delay(800);
    viewports.push(await evaluate(`(()=>{
      const box=e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}};
      const halo=document.querySelector('.hero-background-glow');
      const arc=document.querySelector('.hero-background-arc');
      const hero=document.querySelector('.hero');
      const protectedElements=[...document.querySelectorAll('.hero-brand,.hero-service-nav,.hero-side-copy,.hero-footnote span')].filter(e=>e.getBoundingClientRect().height);
      const arcBox=arc?.getBoundingClientRect();
      return {width:innerWidth,hero:box(hero),robot:box(document.querySelector('.hero-robot')),shell:box(document.querySelector('.hero-shell')),
        content:protectedElements.map(e=>({class:e.className,...box(e)})),overflow:document.documentElement.scrollWidth>innerWidth,
        loaded:!!document.querySelector('.hero-robot.is-loaded canvas'),tracking:document.querySelector('.hero-robot').dataset.headTracking,
        layers:{halo:halo&&getComputedStyle(halo).zIndex,arc:arc&&getComputedStyle(arc).zIndex,robot:getComputedStyle(document.querySelector('.hero-robot')).zIndex,content:getComputedStyle(document.querySelector('.hero-shell')).zIndex},
        halo:halo?{...box(halo),pointer:getComputedStyle(halo).pointerEvents,filter:getComputedStyle(halo).filter,animation:getComputedStyle(halo).animationName}:null,
        arc:arc?{...box(arc),paths:arc.querySelectorAll('path').length,pointer:getComputedStyle(arc).pointerEvents,animation:getComputedStyle(arc).animationName}:null,
        arcTouchesContent:!!arcBox&&protectedElements.some(e=>{const b=e.getBoundingClientRect();return b.left<arcBox.right&&b.right>arcBox.left&&b.top<arcBox.bottom&&b.bottom>arcBox.top})};
    })()`));
    viewports.at(-1).name = name;
    // Allow software-rendered tiles to settle after viewport changes.
    await send('Page.captureScreenshot', { format: 'png' });
    await delay(300);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(path.join(output, `${name}.png`), Buffer.from(shot.data, 'base64'));
  }
  if (after) {
    await send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion',value:'reduce' }] });
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(path.join(output, 'reduced-motion.png'), Buffer.from(shot.data, 'base64'));
  }
  const failures = [];
  if (errors.length || viewports.some(v => v.overflow || !v.loaded)) failures.push('Runtime/model/overflow issue');
  if (after && viewports.some(v=>!v.halo || v.halo.pointer!=='none' || v.halo.filter!=='none' || v.halo.animation!=='none' || v.arc?.paths!==1 || v.arc.pointer!=='none' || v.arc.animation!=='none' || v.arcTouchesContent)) failures.push('Background count, motion or content collision issue');
  if (after && viewports.some(v=>JSON.stringify(v.layers)!==JSON.stringify({halo:'0',arc:'1',robot:'2',content:'3'}))) failures.push('Incorrect background stacking order');
  const report = { base, output, canvasEdge, viewports, failures, errors };
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await send('Browser.close'); } catch {}
    socket.close();
  }
  browser.kill();
}
