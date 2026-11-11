import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { PLATFORM_ASSETS } from "./platform-assets";
import type { ServiceTheme } from "./site";
import { prepareLogoVariants, type ImageVariant } from "./logo-variants";

const IMAGE_EXTENSION = /\.(png|jpe?g|webp|avif|svg)$/i;
const SERVICE_FOLDERS: Record<ServiceTheme, string> = {
  restaurant: "Restaurant", hotel: "Hotel", ecom: "Ecommerce", digital: "DigitalMarketting",
};
const CLIENT_NAMES: Record<string, string> = {
  "anganan.jpeg": "Covai Anganan Biriyani House",
  "hmr.jpeg": "HMR Biriyani Restaurant",
  "mouzy.jpeg": "Mouzy Banana Avil Milk",
  "Nahdi.jpeg": "Nahdi Mandi Restaurant",
  "thallassery.jpeg": "Thalassery Restaurant",
  "tnt.jpeg": "T&T",
  "valarmathi.jpeg": "Valarmathi Kongunaatu Samayal",
  "haribhavanam.png": "Haribhavanam",
  "terminal-2-tamil.png": "Terminal 2",
};

export type LogoAsset = { name: string; src: string; variants?: ImageVariant[] };

async function readLogos(folder: string, names: Record<string, string>, preferred: readonly string[]): Promise<LogoAsset[]> {
  let entries;
  try {
    entries = await readdir(path.join(process.cwd(), "public", folder), { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return entries.filter(entry => entry.isFile() && !entry.name.startsWith(".") && IMAGE_EXTENSION.test(entry.name))
    .map(entry => ({
      name: names[entry.name] ?? (path.parse(entry.name).name.replace(/[_-]+/g, " ").replace(/\blogo\b/gi, "").trim() || path.parse(entry.name).name),
      src: `/${folder}/${encodeURIComponent(entry.name)}`,
    }))
    .sort((a, b) => {
      const rank = (name: string) => { const index = preferred.indexOf(name); return index === -1 ? preferred.length : index; };
      return rank(a.name) - rank(b.name) || a.name.localeCompare(b.name, "en", { numeric: true });
    });
}

// Server-rendered discovery: development refreshes and production builds pick
// up additions/removals without changing imports or maintaining a manifest.
async function fingerprintLogos(logos: LogoAsset[]) {
  return Promise.all(logos.map(async logo => {
    const file = await readFile(path.join(process.cwd(), "public", decodeURIComponent(logo.src.slice(1))));
    // Content hashes survive redeploys and refresh same-name replacements.
    // This runs at static rendering/build time, never in an image request.
    const version = createHash("sha256").update(file).digest("hex").slice(0, 16);
    const src = `${logo.src}?v=${version}`;
    return { ...logo, src, variants: await prepareLogoVariants(file, src) };
  }));
}

export async function getClientLogos() {
  return fingerprintLogos(await readLogos("clients", CLIENT_NAMES, Object.values(CLIENT_NAMES)));
}

export async function getPlatformLogos(theme: ServiceTheme, preferred: readonly string[]) {
  const folder = `Brand/${SERVICE_FOLDERS[theme]}`;
  const names = Object.fromEntries(Object.entries(PLATFORM_ASSETS)
    .filter(([, asset]) => asset.src.startsWith(`/${folder}/`))
    .map(([name, asset]) => [path.basename(asset.src), name]));
  return fingerprintLogos(await readLogos(folder, names, preferred));
}
