// Native Chromium lab measurements, not Lighthouse scores or real-device claims.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const base = process.argv[2] || 'http://localhost:3115';
const label = process.argv[3] || 'audit';
const mobileOnly = process.argv.includes('--mobile-only');
const metricsOnly = process.argv.includes('--metrics-only');
const repeats = Math.max(1, Math.min(3, Number(process.argv.find(arg => arg.startsWith('--repeat='))?.split('=')[1]) || 1));
const output = await mkdtemp(path.join(tmpdir(), `strategy-audit-${label}-`));
console.log(`Audit output: ${output}`);
const profile = path.join(output, 'profile');
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map();
let socket, nextId = 0;
async function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve,reject) => {
    const timer = setTimeout(()=>{pending.delete(id);reject(new Error(`Timeout: ${method}`));},30000);
    pending.set(id,{resolve,reject,timer}); socket.send(JSON.stringify({id,method,params}));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function ready(route) {
  for(let attempt=0;attempt<100;attempt++) {
    try { if(await evaluate(`location.pathname===${JSON.stringify(route)} && document.readyState!=='loading' && !!document.querySelector('h1')`)) return; } catch {}
    await delay(200);
  }
  throw new Error(`Not ready: ${route}`);
}
const instrumentation = `window.__audit={lcp:0,cls:0,longTasks:[],frames:[]};
for(const type of ['largest-contentful-paint','layout-shift','longtask']){
  try{new PerformanceObserver(list=>{for(const e of list.getEntries()){
    if(type==='largest-contentful-paint')window.__audit.lcp=e.startTime;
    if(type==='layout-shift'&&!e.hadRecentInput)window.__audit.cls+=e.value;
    if(type==='longtask')window.__audit.longTasks.push(e.duration);
  }}).observe({type,buffered:true});}catch{}
}`;
const appState = `(()=>{const el=document.querySelector('.hero-robot');if(!el)return null;let f=el[Object.keys(el).find(k=>k.startsWith('__reactFiber$'))];while(f){let h=f.memoizedState;for(let i=0;h&&i<40;i++,h=h.next){const app=h.memoizedState?.current;if(app&&typeof app.getAllObjects==='function')return {stopped:app.isStopped,settings:app.data?.scene?.publish?.settings?.web};}f=f.return;}return null})()`;
const report = {label,base,conditions:'Local production, headless Chrome, software WebGL, DPR 1, no CPU/network throttling; not real-device or Lighthouse measurements.',runs:[],responsive:[],errors:[]};
try {
  let port;
  for(let i=0;i<100;i++){try{port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await delay(200);}}
  if(!port)throw new Error('Chrome unavailable');
  const targets=await fetch(`http://127.0.0.1:${port}/json`).then(r=>r.json());
  socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
    socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')report.errors.push(m.params.exceptionDetails.text);const p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);if(m.error)p.reject(new Error(JSON.stringify(m.error)));else p.resolve(m.result);};
  await send('Page.enable');await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument',{source:instrumentation});
  const viewports = mobileOnly ? [[390,844,'mobile']] : [[1440,1000,'desktop'],[390,844,'mobile']];
  for(const [width,height,name] of Array.from({length:repeats},()=>viewports).flat()) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700});
    await send('Page.navigate',{url:base});await ready('/');
    let modelReady=false;
    for(let i=0;i<100;i++){modelReady=await evaluate(`!!document.querySelector('.hero-robot.is-loaded canvas')`);if(modelReady)break;await delay(200);}
    await delay(800);
    const metrics=await evaluate(`(()=>{const a=window.__audit;const c=document.querySelector('.hero-robot canvas');const entries=performance.getEntriesByType('resource');return {lcpMs:a.lcp,cls:a.cls,fcpMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,longTaskCount:a.longTasks.length,longTaskMs:a.longTasks.reduce((s,v)=>s+v,0),blockingMs:a.longTasks.reduce((s,v)=>s+Math.max(0,v-50),0),modelLoadedAtMs:document.querySelector('.hero-robot')?.dataset.loadedAt,canvas:c?{width:c.width,height:c.height,cssWidth:c.clientWidth,cssHeight:c.clientHeight}:null,resources:entries.filter(e=>e.initiatorType==='script'||/splinecode/.test(e.name)).map(e=>({name:e.name.split('/').pop(),startMs:e.startTime,durationMs:e.duration,transferBytes:e.transferSize,decodedBytes:e.decodedBodySize}))}})()`);
    metrics.modelReady=modelReady;metrics.viewport=name;
    metrics.runtime=await evaluate(appState);
    metrics.frames=await evaluate(`new Promise(resolve=>{let first=0,last=0;const deltas=[];function tick(now){if(!first)first=now;if(last)deltas.push(now-last);last=now;if(now-first<1500)requestAnimationFrame(tick);else{deltas.sort((a,b)=>a-b);resolve({samples:deltas.length,p50Ms:deltas[Math.floor(deltas.length*.5)],p95Ms:deltas[Math.floor(deltas.length*.95)],worstMs:deltas.at(-1)})}}requestAnimationFrame(tick)})`);
    await evaluate(`scrollTo({top:document.querySelector('.hero-intro').offsetTop+500,behavior:'instant'})`);
    // Software WebGL can delay the next observer delivery by more than 300ms.
    // Wait for the existing lifecycle handler rather than reporting a stale ref.
    for (let attempt=0;attempt<20;attempt++) {
      if ((await evaluate(appState))?.stopped) break;
      await delay(250);
    }
    metrics.offscreenRuntime=await evaluate(appState);
    report.runs.push(metrics);
    await writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
  }
  const routes=metricsOnly ? [] : ['/','/services/e-commerce-support','/services/restaurant-consulting','/services/hotel-revenue-management','/services/digital-marketing','/contact'];
  for(const route of routes){
    await send('Page.navigate',{url:base+route});await ready(route);
    for(const width of [320,390,600,768,820,1024,1180,1440,1920]){
      await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
      report.responsive.push(await evaluate(`({route:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main h1,main h2,main h3,main a,main p')].filter(e=>{const b=e.getBoundingClientRect();return b.width&&b.right>innerWidth+2}).slice(0,5).map(e=>e.className),title:document.title,h1Count:document.querySelectorAll('h1').length})`));
    }
  }
  report.headers=Object.fromEntries((await fetch(base)).headers);
  report.overflowFailures=report.responsive.filter(r=>r.scrollWidth>r.width||r.overflow.length);
  await writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({output,runs:report.runs.map(({resources,...rest})=>({...rest,scriptDecodedBytes:resources.reduce((s,r)=>s+r.decodedBytes,0)})),overflowFailures:report.overflowFailures,errors:report.errors},null,2));
} finally {
  if(socket?.readyState===WebSocket.OPEN){socket.send(JSON.stringify({id:++nextId,method:'Browser.close'}));socket.close();}
  chrome.kill();
}
