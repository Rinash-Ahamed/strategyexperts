// Native full-document navigation regression. The external robot is held pending
// to isolate navigation; these measurements are NOT robot performance scores.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const base = process.argv[2] || "http://localhost:3126";
const baseline = process.argv.includes("--baseline-brush");
const blockFramework = process.argv.includes("--block-framework");
const homeOnly = process.argv.includes("--home-only");
const output = await mkdtemp(path.join(tmpdir(), "se-navigation-"));
const profile = path.join(output, "profile");
const browser = spawn(process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run",
], { windowsHide: true, stdio: "ignore" });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket, id = 0;
const pending = new Map(), requests = [], errors = [], runs = [], homeBehavior = [], transitions = [], historyChecks = [];
async function send(method, params = {}) {
  const request = ++id;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(request); reject(new Error(method)); }, 30000);
    pending.set(request, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: request, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function ready(route) {
  for (let attempt = 0; attempt < 150; attempt++) {
    try {
      if (await evaluate(`location.pathname===${JSON.stringify(route)} && document.readyState!=='loading' && !!document.querySelector('h1')`)) {
        await delay(baseline ? 1200 : 150);
        return;
      }
    } catch { /* A full document replacement destroys the previous context. */ }
    await delay(100);
  }
  throw new Error(`Navigation failed: ${route}`);
}
try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { port = (await readFile(path.join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]; break; }
    catch { await delay(100); }
  }
  assert(port, "Chrome did not start");
  const targets = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json());
  socket = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === "Network.requestWillBeSent" && message.params.type === "Document") {
      requests.push({ url: message.params.request.url, start: message.params.wallTime * 1000 });
    }
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
    const entry = pending.get(message.id);
    if (!entry) return;
    clearTimeout(entry.timer); pending.delete(message.id);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error))); else entry.resolve(message.result);
  };
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `window.__navigationTransition={supported:'onpagereveal' in window,active:false};addEventListener('pagereveal',event=>{const transition=event.viewTransition;if(!transition)return;__navigationTransition.active=true;transition.ready.then(()=>{const style=getComputedStyle(document.documentElement,'::view-transition-new(root)');__navigationTransition.animation=style.animationName;__navigationTransition.duration=style.animationDuration;__navigationTransition.ready=true}).catch(()=>{__navigationTransition.skipped=true});transition.finished.then(()=>{__navigationTransition.finished=true})});` });
  await send("Fetch.enable", { patterns: [{ urlPattern: "*scene.splinecode*", requestStage: "Request" }] });
  if (blockFramework) await send("Network.setBlockedURLs", { urls: ["*/_next/static/chunks/*.js*"] });
  for (const width of [390, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
    await send("Page.navigate", { url: base + (homeOnly ? "/" : "/services/restaurant-consulting") });
    await ready(homeOnly ? "/" : "/services/restaurant-consulting");
    for (const route of (homeOnly ? [] : ["/services/e-commerce-support", "/services/hotel-revenue-management", "/services/digital-marketing", "/contact", "/"])) {
      const before = await evaluate("performance.timeOrigin");
      const clickedAt = await evaluate(`(()=>{const anchor=document.querySelector('a[href=${JSON.stringify(route)}]');if(!anchor)throw Error('Missing link');const start=Date.now();anchor.click();return start})()`);
      await ready(route);
      const request = requests.findLast(r => new URL(r.url).pathname === route);
      const state = await evaluate(`({origin:performance.timeOrigin,brush:!!document.querySelector('.route-transition'),inert:!!document.getElementById('main')?.inert,overflow:document.documentElement.scrollWidth>innerWidth})`);
      assert.notEqual(state.origin, before, "Links must replace the document, not use SPA routing");
      assert.equal(state.brush, baseline, "Unexpected brush overlay state");
      assert.equal(state.inert, false); assert.equal(state.overflow, false);
      assert(request, "Expected a document request");
      const requestDelayMs = Math.max(0, request.start - clickedAt);
      if (!baseline) assert(requestDelayMs < 750, `Navigation delayed by ${requestDelayMs}ms`);
      runs.push({ width, route, requestDelayMs, fullDocument: true });
      if (!baseline) {
        const transition = await evaluate("window.__navigationTransition");
        if (transition.supported) {
          assert.equal(transition.active, true, `Missing native transition: ${route}`);
          assert.equal(transition.animation, "page-arrive");
          assert.equal(transition.duration, "0.3s");
        }
        transitions.push({ width, route, ...transition });
      }
    }
    if (!baseline) {
      const origin = await evaluate("performance.timeOrigin");
      assert(await evaluate("getComputedStyle(document.querySelector('[data-hero-opening]')).display==='none'"), "Navigating home must not play the opening");
      for (const target of ["logo", "home"]) {
        await evaluate("scrollTo({top:600,behavior:'instant'})");
        if (target === "home" && width < 700 && !blockFramework) {
          await evaluate("document.querySelector('.burger').click()"); await delay(200);
        }
        const selector = target === "logo" ? ".nav-inner > a" : width < 700 ? "#mobile-menu a[href='#']" : ".nav-links a[href='#']";
        await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
        for (let attempt=0;attempt<30;attempt++) {
          if (await evaluate("scrollY<1")) break;
          await delay(100);
        }
        assert.equal(await evaluate("performance.timeOrigin"), origin, "Home/logo on home must not reload");
        const position=await evaluate("({y:scrollY,hash:location.hash,target:document.getElementById('top')?.tagName,logo:document.querySelector('.nav-inner>a').getAttribute('href')})");
        assert(position.y<1, `Home/logo should return to the top: ${JSON.stringify({width,target,...position})}`);
      }
      if (!blockFramework) {
        await evaluate("scrollTo({top:600,behavior:'instant'})");
        await send("Page.reload"); await ready("/");
        assert(await evaluate("document.documentElement.dataset.openingTrigger==='refresh'&&getComputedStyle(document.querySelector('[data-hero-opening]')).display==='grid'"), "Refresh should play the opening");
        assert.equal(await evaluate("scrollY"), 0, 'Refresh opening starts at the top, not the old scroll position');
        assert.equal(await evaluate("getComputedStyle(document.querySelector('.nav')).visibility"), "hidden");
        assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-hero-opening]')).pointerEvents"), 'auto', 'Opening must block accidental clicks on covered links');
        const opening = await evaluate("({managed:document.documentElement.dataset.openingManaged,animation:getComputedStyle(document.querySelector('[data-hero-opening]')).animationName,delay:getComputedStyle(document.querySelector('[data-hero-opening]')).animationDelay})");
        assert(opening.managed === 'true' ? opening.animation === 'none' : opening.delay === '60s', 'Robot readiness owns the managed reveal; CSS timeout is only a no-hydration failsafe');
        await delay(300);
        const introShot = await send('Page.captureScreenshot', { format: 'png' });
        await writeFile(path.join(output, `refresh-opening-${width}.png`), Buffer.from(introShot.data, 'base64'));
        await evaluate("document.querySelector('[data-hero-opening] button').click()"); await delay(200);
        assert.equal(await evaluate("getComputedStyle(document.querySelector('.nav')).visibility"), "visible");
        await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
        await send("Page.reload"); await ready("/");
        assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-hero-opening]')).display"), "none");
        assert.equal(await evaluate("getComputedStyle(document.querySelector('.nav')).visibility"), "visible");
        await send("Emulation.setEmulatedMedia", { features: [] });
      }
      homeBehavior.push({ width, samePageLogoAndHomeReturnToTop: true, reloadOpeningAndReducedMotion: !blockFramework });
      if (blockFramework) {
        await send('Page.reload'); await ready('/');
        assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-hero-opening]')).display"), 'grid');
        await evaluate("document.querySelector('[data-opening-skip]').click()");
        assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-hero-opening]')).display"), 'none', 'Skip works before framework hydration');
        assert.equal(await evaluate("getComputedStyle(document.querySelector('.nav')).visibility"), 'visible');
      }
      if (!homeOnly && !blockFramework) {
        await evaluate("document.querySelector('footer a[href=\"/contact\"]').click()"); await ready('/contact');
        await evaluate("scrollTo({top:400,behavior:'instant'})"); await delay(350);
        const position = await evaluate("scrollY");
        await evaluate("document.querySelector('.nav-inner>a').click()"); await ready('/');
        const history = await send("Page.getNavigationHistory");
        await send("Page.navigateToHistoryEntry", { entryId: history.entries[history.currentIndex - 1].id });
        await ready('/contact'); await delay(500);
        const restored = await evaluate("scrollY");
        assert(Math.abs(restored - position) < 2, `Back should restore scroll: ${position} vs ${restored}`);
        await send("Page.navigateToHistoryEntry", { entryId: history.entries[history.currentIndex].id });
        await ready('/'); await delay(400);
        assert.equal(await evaluate("scrollY"), 0);
        assert(await evaluate("!document.documentElement.dataset.openingTrigger"), "History must not replay refresh intro");
        historyChecks.push({ width, backRestoredScroll: true, forwardReturnedToTop: true });
      }
    }
  }
  assert.deepEqual(errors, []);
  if (!baseline && !homeOnly && !blockFramework) {
    const services = [
      ['e-commerce-support', 'E-Commerce Support'],
      ['restaurant-consulting', 'Restaurant Consulting'],
      ['hotel-revenue-management', 'Hotel Revenue Management'],
      ['digital-marketing', 'Digital Marketing & WhatsApp Marketing'],
    ];
    for (const [slug, name] of services) {
      const html = await (await fetch(`${base}/contact?service=${slug}`)).text();
      assert(html.includes('<form') && html.includes('name="message"'), 'Contact form must be in static HTML');
      await send("Page.navigate", { url: `${base}/contact?service=${slug}` }); await ready('/contact');
      let matched = false;
      for (let attempt = 0; attempt < 50; attempt++) {
        matched = await evaluate(`document.querySelector('#service').value===${JSON.stringify(name)}`);
        if (matched) break;
        await delay(100);
      }
      assert(matched, `Contact query preselection: ${slug}`);
    }
    await evaluate("document.querySelector('.form button').click()"); await delay(100);
    assert.equal(await evaluate("document.activeElement.id"), 'name', 'Validation focuses first invalid field without opening external apps');
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    await evaluate("document.querySelector('.nav-inner>a').click()"); await ready('/');
    assert.equal(await evaluate("window.__navigationTransition.active"), false, 'Reduced motion disables cross-document transitions');
  }
  const footerSocials = await evaluate(`(()=>{const links=[...document.querySelectorAll('.footer-socials a')];return links.map(a=>({href:a.href,label:a.getAttribute('aria-label'),size:a.getBoundingClientRect().width}))})()`);
  assert.equal(footerSocials.length, 2);
  assert(footerSocials.some(a=>a.href.startsWith('https://wa.me/')&&a.label.includes('WhatsApp')&&a.size>=44), 'Footer WhatsApp icon is labelled and touch-sized');
  for (const width of [1440, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
    await evaluate("document.querySelector('.footer-brand').scrollIntoView({block:'center',behavior:'instant'})"); await delay(200);
    const footerShot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(path.join(output, `footer-socials-${width}.png`), Buffer.from(footerShot.data, 'base64'));
  }
  const report = { base, baseline, blockFramework, conditions: "External scene held pending; navigation-only checks. Use production for timing claims.", runs, homeBehavior, transitions, historyChecks, errors };
  await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ output, ...report }, null, 2));
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await send("Browser.close"); } catch { /* Close the owned child below. */ }
    socket.close();
  }
  for (const entry of pending.values()) clearTimeout(entry.timer);
  browser.kill();
}
