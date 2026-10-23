// Functional layout/asset checks, not a performance benchmark. Uses system Chrome.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import axe from "axe-core";

const base = process.argv[2] || "http://localhost:3000";
const output = await mkdtemp(path.join(tmpdir(), "se-content-colour-"));
const browser = spawn(process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${path.join(output, "profile")}`, "--no-first-run",
], { windowsHide: true, stdio: "ignore" });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map();
let socket, id = 0;
const errors = [], reports = [], lcpWarnings = [];
const accessibility = [];
const headlines = [];
let homepagePhotoSources = [];
const routes = ["/", "/services/e-commerce-support", "/services/restaurant-consulting", "/services/hotel-revenue-management", "/services/digital-marketing", "/contact"];
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const request = ++id;
    const timer = setTimeout(() => reject(new Error(method)), 30000);
    pending.set(request, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: request, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function screenshot(name) {
  const shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(output, `${name}.png`), Buffer.from(shot.data, "base64"));
}
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(path.join(output, "profile", "DevToolsActivePort"), "utf8")).split("\n")[0]; break; }
    catch { await delay(100); }
  }
  const targets = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json());
  socket = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
    if (message.method === "Runtime.consoleAPICalled") {
      const text = message.params.args.map(arg => arg.value ?? arg.description ?? "").join(" ");
      if (text.includes("Largest Contentful Paint")) lcpWarnings.push(text);
    }
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id); clearTimeout(entry.timer);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error))); else entry.resolve(message.result);
  };
  await send("Page.enable"); await send("Runtime.enable");
  // Isolate content checks from external 3D networking. Do not benchmark this run.
  await send("Fetch.enable", { patterns: [{ urlPattern: "*scene.splinecode*", requestStage: "Request" }] });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  for (const route of routes) {
    await send("Page.navigate", { url: base + route });
    for (let i = 0; i < 150; i++) {
      if (await evaluate("!!document.querySelector('[data-platform-marks],.contact-grid') && document.readyState !== 'loading'")) break;
      await delay(150);
    }
    await evaluate("document.fonts.ready");
    const photos = await evaluate(`([...document.querySelectorAll('[data-industry-photo]')].map(img=>({
      src:new URL(img.src).searchParams.get('url')||img.getAttribute('src'),
      loading:img.loading,priority:img.fetchPriority
    })))`);
    if (route === "/") {
      homepagePhotoSources = photos.map(photo => photo.src);
      assert.equal(photos.length, 3);
      assert(photos.every(photo => photo.loading === "eager" && photo.priority === "low"), "Homepage photos should be eager but low priority for restored views");
    } else if (photos.length) {
      assert(photos.every(photo => !homepagePhotoSources.includes(photo.src)), "Service photos must not reuse homepage images");
      assert(photos.every(photo => photo.loading === "eager" && photo.priority === "high"), "Hero photos need eager/high-priority loading");
    }
    for (const width of [320, 360, 390, 430, 600, 768, 820, 1024, 1180, 1280, 1440, 1920]) {
      await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width < 700 });
      await evaluate("window.scrollTo({top:0,behavior:'instant'})");
      await delay(150);
      const report = await evaluate(`(() => {
        const logos=[...document.querySelectorAll('[data-platform-marks] img')];
        return { width:innerWidth, overflow:document.documentElement.scrollWidth>innerWidth,
          logos:logos.length, photos:document.querySelectorAll('[data-industry-visual] figure img').length,
          filtered:logos.some(img=>getComputedStyle(img).filter!=='none'),
          hero:document.querySelector('.hero')&&getComputedStyle(document.querySelector('.hero')).backgroundColor,
          paper:document.querySelector('.service-hero-paper')&&getComputedStyle(document.querySelector('.service-hero-paper')).backgroundColor,
          paperGradient:document.querySelector('.service-hero-paper')&&getComputedStyle(document.querySelector('.service-hero-paper')).backgroundImage,
          h1:document.querySelectorAll('h1').length,
          titleSize:parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
          sectionSizes:[...document.querySelectorAll('.h2,.sc-title,.cta .h1,.sp-cta .h1')].map(e=>parseFloat(getComputedStyle(e).fontSize)),
          bodySize:parseFloat(getComputedStyle(document.body).fontSize) };
      })()`);
      report.route = route;
      assert.equal(report.overflow, false, `${route} overflows at ${width}`);
      assert.equal(report.filtered, false); assert.equal(report.h1, 1);
      const expectedTitle = route === "/" ? Math.max(32, Math.min(56, 19.2 + width * .024)) : Math.max(36, Math.min(64, 22.4 + width * .026));
      const expectedSection = Math.max(28.8, Math.min(48, 20 + width * .018));
      assert(Math.abs(report.titleSize - expectedTitle) < .1, `Title scale mismatch: ${route} at ${width}`);
      assert(report.sectionSizes.every(size => Math.abs(size - expectedSection) < .1), `Section scale mismatch: ${route} at ${width}`);
      assert.equal(report.bodySize, 16);
      const details = await evaluate(`(()=>{
        const metrics=[...document.querySelectorAll('.metric b')].map(e=>({size:parseFloat(getComputedStyle(e).fontSize),colour:getComputedStyle(e).color}));
        const social=document.querySelector('.footer-brand .footer-socials a');
        const icon=social?.getBoundingClientRect();
        const digital=document.querySelector('.hero-digital .sp-hero-grid > .stack-m');
        return {metrics,social:!!social?.querySelector('svg')&&social.href.includes('instagram.com/strategy.experts')&&icon.width>=44&&icon.height>=44,
          digitalGap:digital?digital.getBoundingClientRect().top-document.querySelector('.nav').getBoundingClientRect().bottom:null,
          reducedLogo:getComputedStyle(document.querySelector('.footer-brand-link')).animationName};
      })()`);
      assert(details.metrics.every(metric=>metric.size>=24&&metric.size<=32.01), "All page metric figures must use the compact scale");
      assert.equal(details.social, true, "Instagram icon should sit under the logo with a 44px target");
      assert.equal(details.reducedLogo, "none", "Footer logo must respect reduced motion");
      if (details.digitalGap!==null) assert(details.digitalGap>=16&&details.digitalGap<=64, `Digital hero has excessive top spacing: ${details.digitalGap}`);
      report.details=details;
      if (route === "/") assert.equal(report.hero, "rgb(0, 0, 0)");
      else if (route.startsWith("/services/") && !route.includes("digital-marketing")) assert(report.paperGradient.includes("linear-gradient") && report.paperGradient.includes("244, 242, 237"), "Expected the ivory-based service gradient");
      reports.push(report);
      if (width === 390 || width === 1440) {
        await evaluate(axe.source);
        const result = await evaluate(`axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(result=>({violations:result.violations.map(issue=>({id:issue.id,impact:issue.impact,nodes:issue.nodes.map(node=>({target:node.target,summary:node.failureSummary}))})),incomplete:result.incomplete.map(issue=>issue.id)}))`);
        accessibility.push({ route, width, ...result });
        assert.deepEqual(result.violations, [], `Accessibility: ${route} at ${width}`);
        if (route === "/") {
          for (const section of [".sc-1", ".sc-2", ".sc-3", ".sc-4"]) {
            await evaluate(`document.querySelector('${section}').scrollIntoView({block:'start',behavior:'instant'})`);
            await delay(900);
            assert(await evaluate(`(()=>{const image=document.querySelector('${section} [data-industry-photo]');return !image||image.loading==='eager'})()`), "Visible homepage photo should never be lazy");
            await screenshot(`home-${section.slice(1)}-${width}`);
          }
          await evaluate("document.querySelector('.home-metrics')?.scrollIntoView({block:'center',behavior:'instant'})");
          await screenshot(`home-metrics-${width}`);
          await evaluate("document.querySelector('footer').scrollIntoView({block:'start',behavior:'instant'})");
          await screenshot(`footer-${width}`);
        } else { await delay(900); await screenshot(`${route.split("/").at(-1)}-${width}`); }
      }
    }
    const assets = await evaluate(`Promise.all([...new Set([...document.querySelectorAll('[data-platform-marks] img,[data-industry-visual] figure img')].map(img=>img.getAttribute('src')).filter(Boolean))].map(async url=>{const r=await fetch(url);return {url,status:r.status}}))`);
    assert(assets.every(asset => asset.status === 200), JSON.stringify(assets));
    console.log(`${route}: twelve widths, desktop/mobile axe, and ${assets.length} image responses passed`);
  }
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await send("Page.navigate", { url: base });
  for (let i = 0; i < 100; i++) {
    if (await evaluate("document.querySelector('[data-rotating-phrases]')?.dataset.animate==='true'")) break;
    await delay(150);
  }
  await evaluate("document.querySelector('[data-hero-opening] button')?.click()");
  for (const width of [390, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width < 700 });
    await evaluate("scrollTo({top:0,behavior:'instant'})");
    await delay(400);
    const headline = await evaluate(`new Promise(resolve=>{
      const title=document.querySelector('h1'); const fixed=title.firstElementChild;
      const snapshot=()=>{const a=title.getBoundingClientRect(),b=fixed.getBoundingClientRect();return [a.width,a.height,b.x,b.y,b.width,b.height]};
      const initial=snapshot(),seen=new Set(); let stable=true; const start=performance.now();
      const timer=setInterval(()=>{
        seen.add(document.querySelector('[data-current-phrase]').textContent.trim());
        stable=stable&&snapshot().every((value,index)=>Math.abs(value-initial[index])<.1)&&fixed.textContent==='Clear strategy.';
        if(performance.now()-start>14500){clearInterval(timer);resolve({phrases:[...seen],stable})}
      },80);
    })`);
    assert.equal(headline.phrases.length, 7, "All seven headline phrases should appear");
    assert.equal(headline.stable, true, "Static headline and reserved layout must not move");
    headlines.push({ width, ...headline });
    await screenshot(`hero-headline-${width}`);
    if (width === 390) {
      await evaluate("document.querySelector('.burger').click()"); await delay(200);
      for (let i = 0; i < 12; i++) {
        await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
        await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
        assert(await evaluate("!!document.activeElement?.closest('#mobile-menu,.burger')"), "Menu keyboard focus should remain contained");
      }
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
      await delay(200);
      assert(await evaluate("!document.getElementById('main').inert&&document.activeElement.matches('.burger')"), "Escape should close the menu and restore focus");
    }
  }
  console.log("Seven headline phrases retain a stationary first line and stable layout on desktop/mobile; menu keyboard checks passed");
  await evaluate("document.querySelector('footer').scrollIntoView({block:'start',behavior:'instant'})");
  const logoTransform=await evaluate("getComputedStyle(document.querySelector('.footer-brand-link')).transform");
  await delay(700);
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('.footer-brand-link')).transform"),logoTransform,"Footer logo should gently zoom in and out");
  console.log("Footer logo breathes with transform-only motion");
  await evaluate("document.querySelector('.platform-ticker').scrollIntoView({block:'center',behavior:'instant'})");
  await delay(600);
  const ribbon = await evaluate("(()=>{const b=document.querySelector('.platform-ticker').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()");
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...ribbon });
  const transform = await evaluate("getComputedStyle(document.querySelector('.ticker-track')).transform");
  await delay(600);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.ticker-track')).animationPlayState"), "running");
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('.ticker-track')).transform"), transform);
  await screenshot("platform-ribbon-live");
  console.log("Platform ribbon continues moving while hovered");
  await evaluate("document.querySelector('.sc-1').scrollIntoView({block:'start',behavior:'instant'})");
  await delay(500);
  await send("Page.reload");
  await delay(8000);
  const restored = await evaluate(`(()=>{
    const image=document.querySelector('.sc-1 [data-industry-photo]');
    const bounds=image.getBoundingClientRect();
    return {loading:image.loading,priority:image.fetchPriority,inView:bounds.top<innerHeight&&bounds.bottom>0};
  })()`);
  assert.deepEqual(restored, { loading: "eager", priority: "low", inView: true });
  console.log("Reload at a restored photo position keeps the LCP candidate eager");
  assert.deepEqual(errors, []);
  assert.deepEqual(lcpWarnings, [], "No lazy-LCP image warnings should be emitted");
  await writeFile(path.join(output, "report.json"), JSON.stringify({ base, reports, accessibility, headlines, errors, lcpWarnings }, null, 2));
  console.log(`Passed ${reports.length} layout checks. Screenshots/report: ${output}`);
  await send("Browser.close");
} finally {
  socket?.close(); browser.kill();
  for (const entry of pending.values()) clearTimeout(entry.timer);
}
