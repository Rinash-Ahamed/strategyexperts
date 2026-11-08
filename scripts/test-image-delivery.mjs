import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { stripTypeScriptTypes } from 'node:module';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import { renderToStaticMarkup } from 'react-dom/server';
import config from '../next.config.mjs';

const require = createRequire(import.meta.url);
const source = await readFile(new URL('../lib/logo-library.ts', import.meta.url), 'utf8');
const moduleCode = stripTypeScriptTypes(source).replace('from "./platform-assets"', `from ${JSON.stringify(new URL('../lib/platform-assets.ts', import.meta.url).href)}`);
const library = await import(`data:text/javascript;base64,${Buffer.from(moduleCode).toString('base64')}`);
const extensions = /\.(png|jpe?g|webp|avif|svg)$/i;

test('every supported logo in each folder is discovered with a fresh file fingerprint', async () => {
  for (const [theme, folder] of Object.entries({ restaurant: 'Restaurant', hotel: 'Hotel', ecom: 'Ecommerce', digital: 'DigitalMarketting', clients: 'clients' })) {
    const directory = theme === 'clients' ? 'clients' : `Brand/${folder}`;
    const files = (await readdir(`public/${directory}`, { withFileTypes: true })).filter(e => e.isFile() && !e.name.startsWith('.') && extensions.test(e.name)).map(e => e.name).sort();
    const logos = theme === 'clients' ? await library.getClientLogos() : await library.getPlatformLogos(theme, []);
    assert.deepEqual(logos.map(logo => decodeURIComponent(new URL(logo.src, 'https://example.test').pathname.split('/').at(-1))).sort(), files);
    for (const logo of logos) {
      const url = new URL(logo.src, 'https://example.test');
      const file = await readFile(path.join('public', decodeURIComponent(url.pathname.slice(1))));
      assert.equal(url.searchParams.get('v'), createHash('sha256').update(file).digest('hex').slice(0, 16));
      assert(logo.name.trim());
    }
  }
});

test('client numeric filenames retain natural order and preferred platform order is honored', async () => {
  const clients = await library.getClientLogos();
  const numeric = clients.map(c => c.name).filter(name => /^\d+$/.test(name)).map(Number);
  assert.deepEqual(numeric, [...numeric].sort((a, b) => a - b));
  const platforms = await library.getPlatformLogos('restaurant', ['Swiggy', 'Zomato']);
  assert.deepEqual(platforms.slice(0, 2).map(p => p.name), ['Swiggy', 'Zomato']);
});

test('only versioned logo URLs receive immutable caching, with small responsive variants', async () => {
  const headers = await config.headers();
  const immutable = headers.filter(rule => rule.headers.some(h => h.key === 'Cache-Control' && h.value.includes('immutable')));
  assert.deepEqual(immutable.map(rule => rule.source), ['/Brand/:path*', '/clients/:path*']);
  assert(immutable.every(rule => rule.has.some(condition => condition.type === 'query' && condition.key === 'v')));
  assert(config.images.localPatterns.some(pattern => pattern.pathname === '/Brand/**' && pattern.search === undefined));
  assert(config.images.imageSizes.includes(160) && config.images.imageSizes.includes(320));
  assert(config.images.qualities.includes(90));
});

test('static images retain responsive Next optimization and intrinsic sizing without client state', async () => {
  const code = ts.transpileModule(await readFile(new URL('../components/shared/StaticImage.tsx', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText
    .replaceAll('"react/jsx-runtime"', JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
    .replaceAll('"next/image"', JSON.stringify(pathToFileURL(require.resolve('next/image')).href));
  const { default: StaticImage } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  const html = renderToStaticMarkup(StaticImage({ src: '/Brand/Ecommerce/Amazon.png?v=test', alt: 'Amazon', width: 132, height: 44, sizes: '132px', slotWidth: 132, loading: 'eager', fetchPriority: 'low' }));
  assert.match(html, /width="132" height="44"/);
  assert.match(html, /loading="eager"/);
  assert.match(html, /srcSet="[^"]*_next\/image/);
  assert.match(html, /sizes="132px"/);
  assert.match(html, /alt="Amazon"/);
  assert(!html.includes('slotWidth'));
  const candidates = html.match(/srcSet="([^"]+)"/)[1].split(', ');
  assert(candidates.length <= 6, 'Fixed logos must not include a full viewport srcset.');
  assert(Number(candidates.at(-1).match(/ (\d+)w$/)[1]) >= 132 * 4, 'Retain 4x density for logos.');
  const fullSize = renderToStaticMarkup(StaticImage({ src: { src: '/_next/static/media/report.hash.webp', width: 1600, height: 800 }, alt: 'Report', sizes: '90vw', originalAtFullSize: true, loading: 'lazy' }));
  assert.match(fullSize, /report\.hash\.webp 1600w/);
  assert(!fullSize.includes('1920w'), 'Do not re-encode or upscale a full-size compressed screenshot.');
  assert(!fullSize.includes('originalAtFullSize'), 'Internal options must not leak into HTML.');
});
