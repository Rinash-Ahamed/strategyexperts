// Reproducible Lighthouse measurements; tooling may live outside the project.
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const option = name => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const cli = option('lighthouse');
const destination = option('output');
if (!cli || !destination) throw new Error('Supply --lighthouse=<path/to/lighthouse/cli/index.js> and --output=<directory>.');
const base = option('base') || 'http://127.0.0.1:3100';
const repeats = Number(option('repeats') || 2);
if (!Number.isInteger(repeats) || repeats < 1 || repeats > 5) throw new Error('Repeats must be between 1 and 5.');
const routes = option('route') ? [option('route')] : ['/', '/services/e-commerce-support', '/services/restaurant-consulting', '/services/hotel-revenue-management', '/services/digital-marketing', '/pricing', '/contact'];
const modes = option('mode') ? [option('mode')] : ['mobile', 'desktop'];
await mkdir(destination, { recursive: true });
const runs = [];
for (const mode of modes) for (let sample = 1; sample <= repeats; sample++) for (const route of routes) {
  if (!['mobile', 'desktop'].includes(mode)) throw new Error('Mode must be mobile or desktop.');
  const slug = route === '/' ? 'home' : route.split('/').at(-1);
  const output = path.resolve(destination, `${slug}-${mode}-${sample}.json`);
  const args = [cli, base + route, '--quiet', '--only-categories=performance,accessibility,best-practices,seo', '--output=json', `--output-path=${output}`, '--chrome-flags=--headless=new --no-first-run'];
  if (mode === 'desktop') args.push('--preset=desktop');
  let result;
  if (process.argv.includes('--resume')) {
    try { result = JSON.parse(await readFile(output, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!result) await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'], env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' } });
    let error = '';
    child.stderr.on('data', chunk => { error = (error + chunk).slice(-4000); });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`${route} ${mode}: Lighthouse exit ${code}\n${error}`)));
  });
  result ??= JSON.parse(await readFile(output, 'utf8'));
  if (result.runtimeError) throw new Error(JSON.stringify(result.runtimeError));
  const audit = key => result.audits[key]?.numericValue ?? null;
  const run = { route, mode, sample, lighthouse: result.lighthouseVersion, chrome: result.environment.hostUserAgent,
    settings: { formFactor: result.configSettings.formFactor, throttlingMethod: result.configSettings.throttlingMethod, throttling: result.configSettings.throttling, screenEmulation: result.configSettings.screenEmulation },
    scores: Object.fromEntries(Object.entries(result.categories).map(([key, value]) => [key, value.score])),
    fcp: audit('first-contentful-paint'), lcp: audit('largest-contentful-paint'), tbt: audit('total-blocking-time'), cls: audit('cumulative-layout-shift'), speedIndex: audit('speed-index'), bytes: audit('total-byte-weight'),
    warnings: result.runWarnings, file: path.basename(output) };
  runs.push(run);
  await writeFile(path.join(destination, 'summary.json'), JSON.stringify({ base, note: 'Local production Lighthouse lab measurements. Mobile uses Lighthouse simulated slow-4G/CPU throttling. Cold browser profiles; server caches persist. Not real devices or field INP.', runs }, null, 2));
  console.log(JSON.stringify(run));
}
