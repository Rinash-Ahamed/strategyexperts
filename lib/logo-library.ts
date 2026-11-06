import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { PLATFORM_ASSETS } from "./platform-assets";
import type { ServiceTheme } from "./site";

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

export type LogoAsset = { name: string; src: string };

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
      return rank(a.name) - rank(b.name) || a.name.localeCompare(b.name, "en");
    });
}

// Server-rendered discovery: development refreshes and production builds pick
// up additions/removals without changing imports or maintaining a manifest.
export async function getClientLogos() {
  const logos = await readLogos("clients", CLIENT_NAMES, Object.values(CLIENT_NAMES));
  return Promise.all(logos.map(async logo => {
    const filename = decodeURIComponent(logo.src.slice("/clients/".length));
    const file = await stat(path.join(process.cwd(), "public", "clients", filename));
    // Replacing a file under the same name must invalidate optimized copies
    // after the next render/build, without a separate asset manifest.
    const version = `${file.size.toString(36)}-${Math.trunc(file.mtimeMs).toString(36)}`;
    return { ...logo, src: `${logo.src}?v=${version}` };
  }));
}

export function getPlatformLogos(theme: ServiceTheme, preferred: readonly string[]) {
  const folder = `Brand/${SERVICE_FOLDERS[theme]}`;
  const names = Object.fromEntries(Object.entries(PLATFORM_ASSETS)
    .filter(([, asset]) => asset.src.startsWith(`/${folder}/`))
    .map(([name, asset]) => [path.basename(asset.src), name]));
  return readLogos(folder, names, preferred);
}
