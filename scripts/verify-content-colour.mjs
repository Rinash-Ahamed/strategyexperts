// Functional layout/asset checks, not a performance benchmark. Uses system Chrome.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const base = process.argv[2] || "http://localhost:3000";
const output = await mkdtemp(path.join(tmpdir(), "se-content-colour-"));
const browser = spawn(process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${path.join(output, "profile")}`, "--no-first-run",
], { windowsHide: true, stdio: "ignore" });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map();
let socket, id = 0;
const errors = [], reports = [];
const routes = ["/", "/services/e-commerce-support", "/services/restaurant-consulting", "/services/hotel-revenue-management", "/services/digital-marketing"];
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
      if (await evaluate("!!document.querySelector('[data-platform-marks]') && document.readyState !== 'loading'")) break;
      await delay(150);
    }
    await evaluate("document.fonts.ready");
    for (const width of [320, 390, 820, 1440]) {
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
          h1:document.querySelectorAll('h1').length };
      })()`);
      report.route = route;
      assert.equal(report.overflow, false, `${route} overflows at ${width}`);
      assert.equal(report.filtered, false); assert.equal(report.h1, 1);
      if (route === "/") assert.equal(report.hero, "rgb(0, 0, 0)");
      else if (!route.includes("digital-marketing")) assert.equal(report.paper, "rgb(244, 242, 237)");
      reports.push(report);
      if (width === 390 || width === 1440) {
        if (route === "/") {
          for (const section of [".sc-1", ".sc-2", ".sc-3", ".sc-4"]) {
            await evaluate(`document.querySelector('${section}').scrollIntoView({block:'start',behavior:'instant'})`);
            await delay(900);
            await screenshot(`home-${section.slice(1)}-${width}`);
          }
        } else { await delay(900); await screenshot(`${route.split("/").at(-1)}-${width}`); }
      }
    }
    const assets = await evaluate(`Promise.all([...new Set([...document.querySelectorAll('[data-platform-marks] img,[data-industry-visual] figure img')].map(img=>img.getAttribute('src')).filter(Boolean))].map(async url=>{const r=await fetch(url);return {url,status:r.status}}))`);
    assert(assets.every(asset => asset.status === 200), JSON.stringify(assets));
    console.log(`${route}: four widths and ${assets.length} image responses passed`);
  }
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await send("Page.navigate", { url: base });
  for (let i = 0; i < 100; i++) {
    if (await evaluate("document.querySelector('[data-rotating-phrases]')?.dataset.animate==='true'")) break;
    await delay(150);
  }
  await evaluate("document.querySelector('[data-hero-opening] button')?.click(); document.querySelector('.platform-ticker').scrollIntoView({block:'center',behavior:'instant'})");
  await delay(600);
  const ribbon = await evaluate("(()=>{const b=document.querySelector('.platform-ticker').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()");
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...ribbon });
  const transform = await evaluate("getComputedStyle(document.querySelector('.ticker-track')).transform");
  await delay(600);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.ticker-track')).animationPlayState"), "running");
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('.ticker-track')).transform"), transform);
  await screenshot("platform-ribbon-live");
  console.log("Platform ribbon continues moving while hovered");
  assert.deepEqual(errors, []);
  await writeFile(path.join(output, "report.json"), JSON.stringify({ base, reports, errors }, null, 2));
  console.log(`Passed ${reports.length} layout checks. Screenshots/report: ${output}`);
  await send("Browser.close");
} finally {
  socket?.close(); browser.kill();
  for (const entry of pending.values()) clearTimeout(entry.timer);
}
