// Deterministic favicon conversion from the supplied logo; no runtime processing.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = new URL('../public/SE Monogram Logo.png', import.meta.url);
const sourcePath = fileURLToPath(source);
const { data, info } = await sharp(sourcePath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
let left = info.width, top = info.height, right = -1, bottom = -1;
// Ignore the large white margins and light background texture, retaining the
// original glyphs and their antialiasing with a small source-pixel safety margin.
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const offset = (y * info.width + x) * info.channels;
    if (Math.max(data[offset], data[offset + 1], data[offset + 2]) < 96) {
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
}
if (right < left || bottom < top) throw new Error('No dark monogram found in source logo');
left = Math.max(0, left - 12); top = Math.max(0, top - 12);
right = Math.min(info.width - 1, right + 12); bottom = Math.min(info.height - 1, bottom + 12);
const region = { left, top, width: right - left + 1, height: bottom - top + 1 };
const makeIcon = async (size, palette = true) => {
  const padding = Math.max(1, Math.round(size * .0625));
  return sharp(sourcePath)
    .extract(region)
    .resize(size - padding * 2, size - padding * 2, { fit: 'contain', background: '#ffffff' })
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: '#ffffff' })
    .ensureAlpha()
    .png({ palette, colours: 64, compressionLevel: 9 }).toBuffer();
};
const sizes = [16, 32, 48];
// Next/Turbopack's ICO decoder requires RGBA PNG entries, not indexed palettes.
const images = await Promise.all(sizes.map(size => makeIcon(size, false)));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (let i = 0; i < sizes.length; i++) {
  const entry = 6 + i * 16;
  header[entry] = sizes[i]; header[entry + 1] = sizes[i];
  header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(images[i].length, entry + 8); header.writeUInt32LE(offset, entry + 12);
  offset += images[i].length;
}
await writeFile(new URL('../app/favicon.ico', import.meta.url), Buffer.concat([header, ...images]));
await writeFile(new URL('../app/icon.png', import.meta.url), await makeIcon(64));
await writeFile(new URL('../app/apple-icon.png', import.meta.url), await makeIcon(180));
console.log(JSON.stringify({ sourceCrop: region, faviconSizes: sizes, iconSize: 64, appleSize: 180 }));
