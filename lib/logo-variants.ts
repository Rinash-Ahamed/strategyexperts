import { access, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

export type ImageVariant = { src: string; width: number };
// Change the recipe when encoder settings change, so immutable URLs stay honest.
const RECIPE = "logo-webp-alpha100-v2";
const pending = new Map<string, Promise<ImageVariant[] | undefined>>();

/** Static derivatives, generated before production builds and on dev discovery.
 * Original artwork is never overwritten. No remote input or runtime upload API. */
export function prepareLogoVariants(file: Buffer, originalSrc: string): Promise<ImageVariant[] | undefined> {
  if (/\.svg(?:\?|$)/i.test(originalSrc)) return Promise.resolve(undefined);
  // Preserve the existing quality split: client plaques 75, platform logos 90.
  const quality = originalSrc.startsWith("/clients/") ? 75 : 90;
  const key = createHash("sha256").update(`${RECIPE}-q${quality}`).update(file).digest("hex").slice(0, 24);
  let result = pending.get(key);
  if (!result) {
    result = generate(file, originalSrc, key, quality);
    pending.set(key, result);
    // A failed generation must be retryable, not poison later dev refreshes.
    void result.catch(() => pending.delete(key));
  }
  return result;
}

async function generate(file: Buffer, originalSrc: string, key: string, quality: number): Promise<ImageVariant[] | undefined> {
  const metadata = await sharp(file).metadata();
  // Preserve animation and leave unknown formats to Next's existing fallback.
  if (!metadata.width || (metadata.pages ?? 1) > 1) return undefined;
  if (file.length < 10240 && metadata.width <= 640) {
    return [{ src: originalSrc, width: metadata.width }];
  }
  const maxWidth = Math.min(metadata.width, quality === 75 ? 640 : 960);
  const steps = quality === 75 ? [160, 320, 640] : [128, 192, 256, 320, 640];
  const widths = [...new Set([...steps, maxWidth].filter(width => width <= maxWidth))].sort((a, b) => a - b);
  const directory = path.join(process.cwd(), "public", "_images");
  await mkdir(directory, { recursive: true });
  return Promise.all(widths.map(async width => {
    const name = `logo-${key}-${width}.webp`;
    const target = path.join(directory, name);
    try { await access(target); }
    catch {
      const output = await sharp(file).resize({ width, withoutEnlargement: true })
        .webp({ quality, alphaQuality: 100, effort: 5 }).toBuffer();
      await writeFile(target, output);
    }
    return { src: `/_images/${name}`, width };
  }));
}
