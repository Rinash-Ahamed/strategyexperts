// Build-time image work replaces billable on-demand logo transformations.
import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { prepareLogoVariants } from '../lib/logo-variants.ts';

const folders = ['clients', ...['Restaurant', 'Hotel', 'Ecommerce', 'DigitalMarketting'].map(name => `Brand/${name}`)];
let logos = 0, variants = 0;
for (const folder of folders) {
  for (const entry of await readdir(path.join('public', folder), { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith('.') || !/\.(png|jpe?g|webp|avif|svg)$/i.test(entry.name)) continue;
    const file = await readFile(path.join('public', folder, entry.name));
    const hash = createHash('sha256').update(file).digest('hex').slice(0, 16);
    const src = `/${folder}/${encodeURIComponent(entry.name)}?v=${hash}`;
    const result = await prepareLogoVariants(file, src);
    logos++; variants += result?.length ?? 0;
  }
}
console.log(`Prepared ${logos} folder-discovered logos (${variants} static image candidates); originals preserved.`);
