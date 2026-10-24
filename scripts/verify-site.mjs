// Dependency-free local Chromium verification. Run against a production server.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const base = process.argv[2] || 'http://localhost:3112';
const label = process.argv[3] || 'refined';
const motionOnly = process.argv.includes('--motion-only');
const output = await mkdtemp(path.join(tmpdir(), `strategy-experts-${label}-`));
const profile = path.join(output, 'profile');
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--enable-unsafe-swiftshader',
  '--use-angle=swiftshader', 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
chrome.on('error', error => { console.error(error); process.exitCode = 1; });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
let id = 0;
const pending = new Map();
const errors = [];
async function send(method, params = {}) {
  const requestId = ++id;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`Timeout: ${method}`)); }, 30000);
    pending.set(requestId, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function capture(name) {
  const result = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64'));
}
async function waitForRoute(route) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if (await evaluate(`location.pathname === ${JSON.stringify(route)} && document.readyState !== 'loading' && Boolean(document.querySelector('h1'))`)) return;
    } catch {
      // A full-document navigation briefly destroys the previous JS context.
    }
    await delay(200);
  }
  throw new Error(`Route did not become ready: ${route}`);
}
try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { port = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await delay(200); }
  }
  if (!port) throw new Error('Chrome debugging port did not become ready');
  const targets = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json());
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    if (!message.id) return;
    const entry = pending.get(message.id);
    if (!entry) return;
    clearTimeout(entry.timer); pending.delete(message.id);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error))); else entry.resolve(message.result);
  };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: base });
  let loaded = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    loaded = await evaluate('Boolean(document.querySelector(".hero-robot.is-loaded canvas"))');
    if (loaded) break;
    await delay(300);
  }
  const report = { base, label, loaded, output, viewports: [], routes: [], errors };
  report.heroLabelsUnobstructed = await evaluate(`!document.querySelector('.hero-silver-streak') && document.querySelectorAll('.hero-footnote span').length === 2 && !document.querySelector('.hero-footnote')?.hasAttribute('aria-hidden')`);
  report.visualFlow = await evaluate(`({maxSectionPadding:Math.max(...[...document.querySelectorAll('.section')].map(e=>parseFloat(getComputedStyle(e).paddingTop))),menuClip:getComputedStyle(document.querySelector('.menu')).clipPath,heroGlowFilter:getComputedStyle(document.querySelector('.hero-glow')).filter,revealProperties:getComputedStyle(document.querySelector('[data-reveal]')).transitionProperty})`);
  // Read the existing React refs without adding debug globals to the product.
  const rigSnapshot = `(() => {
    const element = document.querySelector('.hero-robot');
    if (!element) return null;
    let fiber = element[Object.keys(element).find(key => key.startsWith('__reactFiber$'))];
    while (fiber) {
      let hook = fiber.memoizedState;
      for (let count=0; hook && count<40; count++, hook=hook.next) {
        const app = hook.memoizedState?.current;
        if (app && typeof app.getAllObjects === 'function') {
          const objects = app.getAllObjects();
          return { stopped: app.isStopped, objects: objects.filter(o => /head|hand|arm|camera|light/i.test(o.name)).map(o => ({ name:o.name, uuid:o.uuid, rotation:{x:o.rotation.x,y:o.rotation.y,z:o.rotation.z} })) };
        }
      }
      fiber = fiber.return;
    }
    return null;
  })()`;
  report.rigBefore = await evaluate(rigSnapshot);
  report.heroHoverBefore = await evaluate(`(()=>{const a=document.querySelector('.hero-service-nav a');const b=a.getBoundingClientRect();return {width:b.width,height:b.height,padding:getComputedStyle(a).paddingLeft}})()`);
  const hoverPoint = await evaluate(`(()=>{const b=document.querySelector('.hero-service-nav a').getBoundingClientRect();return {x:Math.round(b.left+30),y:Math.round(b.top+b.height/2)}})()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...hoverPoint });
  await delay(450);
  report.heroHoverAfter = await evaluate(`(()=>{const a=document.querySelector('.hero-service-nav a');const b=a.getBoundingClientRect();return {width:b.width,height:b.height,padding:getComputedStyle(a).paddingLeft}})()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1300, y: 280 });
  await delay(600);
  report.rigAfter = await evaluate(rigSnapshot);
  const headName = await evaluate("document.querySelector('.hero-robot')?.dataset.headTarget");
  const headBefore = report.rigBefore?.objects.find(object => object.name === headName);
  const headAfter = report.rigAfter?.objects.find(object => object.uuid === headBefore?.uuid);
  report.robotHeadResponds = Boolean(headBefore && headAfter &&
    Math.abs(headBefore.rotation.y - headAfter.rotation.y) + Math.abs(headBefore.rotation.x - headAfter.rotation.x) > .002);
  report.heroHasNoPauseControl = await evaluate(`!document.querySelector('.hero-animation-control')`);
  report.robotRunsAutomatically = report.rigAfter?.stopped === false;
  for (const [width, height, name] of (motionOnly ? [] : [[1440,1000,'desktop'],[820,1180,'tablet'],[390,844,'mobile'],[320,800,'small-mobile']])) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 701 });
    await evaluate('scrollTo(0,0)'); await delay(800);
    report.viewports.push(await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,canvas:(()=>{const c=document.querySelector('canvas');return c?{width:c.width,height:c.height,cssWidth:c.clientWidth,cssHeight:c.clientHeight}:null})(),heading:document.querySelector('h1')?.innerText,services:[...document.querySelectorAll('.hero-service-nav a')].filter(a=>a.getBoundingClientRect().height>0).map(a=>a.innerText)})`));
    await capture(name);
    if (width === 1440) {
      for (const selector of ['.hero-intro', '#expertise', '.sc-2', '.sc-3', '.cta']) {
        await evaluate(`document.querySelector('${selector}')?.scrollIntoView({behavior:'instant'})`); await delay(1200);
        await capture(`desktop-${selector.replace(/[^a-z0-9]/gi,'')}`);
      }
    }
  }
  await evaluate('scrollTo(0,0)');
  if (!motionOnly) {
    await evaluate(`document.querySelector('button[aria-controls]')?.click()`);
    await delay(150);
    report.mobileMenuExpanded = await evaluate(`document.querySelector('button[aria-controls]')?.getAttribute('aria-expanded')`);
    for (let attempt=0; attempt<30; attempt++) {
      if (await evaluate(`Boolean(document.getElementById('main')?.inert)`)) break;
      await delay(100);
    }
    report.menuPausesRobot = (await evaluate(rigSnapshot))?.stopped;
    report.menuFocusContained = true;
    for (let i=0;i<10;i++) {
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
      report.menuFocusContained &&= await evaluate(`Boolean(document.activeElement?.closest('#mobile-menu') || document.activeElement?.matches('.burger'))`);
    }
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await delay(300);
    report.menuClosesAndRestoresFocus = await evaluate(`!document.getElementById('main').inert && document.activeElement?.matches('.burger')`);
    await evaluate(`document.querySelector('.ticker')?.scrollIntoView({behavior:'instant'})`);
    await delay(200);
    report.tickerRunning = await evaluate(`getComputedStyle(document.querySelector('.ticker-track')).animationPlayState === 'running'`);
    const tickerPoint = await evaluate(`(()=>{const b=document.querySelector('.ticker').getBoundingClientRect();return {x:Math.round(b.left+50),y:Math.round(b.top+20)}})()`);
    await send('Input.dispatchMouseEvent', {type:'mouseMoved',...tickerPoint});
    report.tickerRunsOnHover = await evaluate(`getComputedStyle(document.querySelector('.ticker-track')).animationPlayState === 'running'`);
    report.tickerHasNoPauseControl = await evaluate(`!document.querySelector('.ticker button') && !document.querySelector('.ticker').hasAttribute('data-paused')`);
    await evaluate('scrollTo(0,0)');
    await evaluate(`document.querySelector('.hero-service-nav a[href="/services/e-commerce-support"]').click()`);
    await waitForRoute('/services/e-commerce-support');
    report.serviceLinkNavigates = await evaluate(`location.pathname === '/services/e-commerce-support'`);
  }
  const routes = motionOnly ? [] : ['/services/e-commerce-support','/services/restaurant-consulting','/services/hotel-revenue-management','/services/digital-marketing','/contact'];
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  for (const route of routes) {
    await send('Page.navigate', { url: base + route });
    await waitForRoute(route); await delay(800);
    report.routes.push(await evaluate(`({path:location.pathname,h1:document.querySelector('h1')?.innerText,overflow:document.documentElement.scrollWidth>innerWidth,form:!!document.querySelector('form'),buttons:[...document.querySelectorAll('form button')].map(b=>({label:b.innerText,disabled:b.disabled}))})`));
    await capture(route.split('/').pop());
  }
  report.responses = await Promise.all(['/',...routes,'/robots.txt','/sitemap.xml'].map(async route => ({route,status:(await fetch(base+route)).status})));
  if (!motionOnly) await send('Page.navigate', { url: base });
  for (let attempt=0; attempt<100; attempt++) {
    if (await evaluate('Boolean(document.querySelector(".hero-robot.is-loaded canvas"))')) break;
    await delay(200);
  }
  await evaluate("scrollTo({top:document.querySelector('.hero-intro').offsetTop+500,behavior:'instant'})");
  for (let attempt=0;attempt<50;attempt++) {
    if ((await evaluate(rigSnapshot))?.stopped) break;
    await delay(100);
  }
  report.offscreenStops = (await evaluate(rigSnapshot))?.stopped === true;
  await evaluate("scrollTo({top:0,behavior:'instant'})");
  for (let attempt=0;attempt<50;attempt++) {
    if ((await evaluate(rigSnapshot))?.stopped === false) break;
    await delay(100);
  }
  report.visibleResumes = (await evaluate(rigSnapshot))?.stopped === false;
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await delay(600);
  report.touch = {
    tracking: await evaluate("document.querySelector('.hero-robot')?.dataset.headTracking"),
    stopped: (await evaluate(rigSnapshot))?.stopped,
  };
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion',value:'reduce' }] });
  for (let attempt=0; attempt<50; attempt++) {
    if (await evaluate(`document.querySelector('.hero-robot')?.dataset.headTracking === 'disabled'`)) break;
    await delay(200);
  }
  report.reducedMotion = await evaluate(`({modelVisible:!!document.querySelector('.hero-robot.is-loaded canvas'),tracking:document.querySelector('.hero-robot')?.dataset.headTracking})`);
  report.reducedMotion.stopped = (await evaluate(rigSnapshot))?.stopped;
  report.reducedMotion.scrollBehavior = await evaluate(`getComputedStyle(document.documentElement).scrollBehavior`);
  report.reducedMotion.revealsVisible = await evaluate(`[...document.querySelectorAll('[data-reveal]')].every(e=>getComputedStyle(e).opacity==='1')`);
  await send('Emulation.setEmulatedMedia', { features: [] });
  if (process.argv.includes('--verify-opening')) {
    const origin = await evaluate('performance.timeOrigin');
    await evaluate("scrollTo({top:600,behavior:'instant'})");
    await send('Page.reload', { ignoreCache: true });
    let firstOpening = null, closedBeforeRobot = false, finished = false;
    for (let attempt = 0; attempt < 160; attempt++) {
      try {
        const state = await evaluate(`(()=>{if(performance.timeOrigin===${origin}||!document.querySelector('footer'))return null;const e=document.querySelector('[data-hero-opening]'),style=e&&getComputedStyle(e);return {trigger:document.documentElement.dataset.openingTrigger,showing:!!e&&style.display==='grid'&&style.visibility!=='hidden'&&Number(style.opacity)>0,robotLoaded:!!document.querySelector('.hero-robot.is-loaded canvas'),top:scrollY,navVisible:getComputedStyle(document.querySelector('.nav')).visibility,at:performance.now()}})()`);
        if (state) {
          if (!firstOpening && state.showing) { firstOpening = state; await capture('refresh-opening'); }
          if (!state.showing && !state.robotLoaded) closedBeforeRobot = true;
          if (firstOpening && !state.showing) { finished = true; break; }
        }
      } catch { /* A reload replaces the execution context. */ }
      await delay(150);
    }
    report.refreshOpening = { firstOpening, closedBeforeRobot, finished, finalTop: await evaluate('scrollY') };
    await capture('refresh-home-ready');
  }
  const failures = [];
  if (!report.loaded) failures.push('Robot did not load');
  if (!report.robotHeadResponds) failures.push('Robot head did not respond to the cursor');
  if (!report.offscreenStops || !report.visibleResumes) failures.push('Robot offscreen lifecycle failed');
  if (report.touch.tracking !== 'disabled' || report.touch.stopped !== false) failures.push('Touch devices should retain live animation without cursor tracking');
  if (!report.heroLabelsUnobstructed) failures.push('Hero label cleanup failed');
  if (report.visualFlow.maxSectionPadding > 112 || report.visualFlow.menuClip !== 'none' || report.visualFlow.heroGlowFilter !== 'none') failures.push('Spacing or lightweight visual-flow regression');
  if (JSON.stringify(report.heroHoverBefore) !== JSON.stringify(report.heroHoverAfter)) failures.push('Hero hover changes layout');
  if (report.errors.length) failures.push('Uncaught browser exceptions');
  if (report.viewports.some(v=>v.scrollWidth>v.width)) failures.push('Homepage horizontal overflow');
  if (report.routes.some(r=>r.overflow||!r.h1)) failures.push('Service/contact route issue');
  if (report.responses.some(r=>r.status!==200)) failures.push('Non-200 route');
  if (!report.heroHasNoPauseControl || !report.robotRunsAutomatically) failures.push('Hero does not animate automatically or has a pause control');
  if (!motionOnly && (!report.menuFocusContained || !report.menuClosesAndRestoresFocus || !report.menuPausesRobot)) failures.push('Menu keyboard/lifecycle issue');
  if (!motionOnly && (!report.tickerHasNoPauseControl || !report.serviceLinkNavigates)) failures.push('Unexpected ticker control or full-page navigation failure');
  if (!motionOnly && (!report.tickerRunning || !report.tickerRunsOnHover)) failures.push('Ticker unexpectedly pauses');
  if (!report.reducedMotion.modelVisible || !report.reducedMotion.stopped || report.reducedMotion.tracking !== 'disabled') failures.push('Reduced-motion behavior failed');
  if (report.reducedMotion.scrollBehavior !== 'auto' || !report.reducedMotion.revealsVisible) failures.push('Reduced-motion scroll/reveal issue');
  if (report.refreshOpening && (!report.refreshOpening.firstOpening || report.refreshOpening.closedBeforeRobot || !report.refreshOpening.finished || report.refreshOpening.finalTop !== 0)) failures.push('Refresh opening must cover the real robot load, then reveal the homepage at the top');
  report.failures = failures;
  if (failures.length) process.exitCode = 1;
  await writeFile(path.join(output,'report.json'), JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await send('Browser.close'); } catch {}
    socket.close();
  }
  chrome.kill();
}
