import { getImageProps, type ImageProps } from "next/image";

type StaticImageProps = Omit<ImageProps, "onLoad" | "onError" | "onLoadingComplete" | "placeholder" | "blurDataURL" | "preload" | "priority"> & {
  slotWidth?: number;
  originalAtFullSize?: boolean;
  variants?: readonly { src: string; width: number }[];
};

/** Next's responsive optimizer, without a client image component per artwork.
 * Use only for server-rendered images without load callbacks or blur state.
 * See the installed Next.js Image documentation's getImageProps section. */
export default function StaticImage({ slotWidth, originalAtFullSize, variants, ...props }: StaticImageProps) {
  const prepared = variants && variants.length > 0;
  const vector = typeof props.src === "string" && /\.svg(?:\?|$)/i.test(props.src);
  const { props: image } = getImageProps({ ...props, ...(prepared || vector ? { unoptimized: true } : {}) });
  if (prepared) {
    image.src = variants[variants.length - 1].src;
    image.srcSet = variants.length > 1 ? variants.map(v => `${v.src} ${v.width}w`).join(", ") : undefined;
    image.sizes = image.srcSet ? props.sizes : undefined;
  }
  // Already-compressed artwork needs smaller derivatives, not a larger or
  // recompressed full-size copy. Static imports have immutable hashed URLs.
  const original = typeof props.src === "object" && "src" in props.src ? props.src : null;
  if (originalAtFullSize && original && image.srcSet) {
    const smaller = image.srcSet.split(", ").filter(source => Number(source.match(/ (\d+)w$/)?.[1]) < original.width);
    image.srcSet = [...smaller, `${original.src} ${original.width}w`].join(", ");
    image.src = original.src;
  }
  // A fixed logo slot does not need viewport-wide candidates up to 3840px.
  // Retain mobile sizing and up to 4x density, without duplicating huge srcsets
  // in HTML and the server-component payload for every conveyor copy.
  if (slotWidth && image.srcSet) {
    const candidates = image.srcSet.split(", ").map(source => ({ source, width: Number(source.match(/ (\d+)w$/)?.[1]) }));
    if (candidates.every(candidate => candidate.width > 0)) {
      const selected = new Set([.75, 1, 1.5, 2, 3, 4].map(scale => candidates.find(candidate => candidate.width >= slotWidth * scale) ?? candidates[candidates.length - 1]));
      const retained = candidates.filter(candidate => selected.has(candidate));
      image.srcSet = retained.map(candidate => candidate.source).join(", ");
      image.src = retained[retained.length - 1].source.replace(/ \d+w$/, "");
    }
  }
  // eslint-disable-next-line @next/next/no-img-element -- getImageProps supplies Next's optimized srcset, sizing and native loading.
  return <img {...image} alt={image.alt} />;
}
