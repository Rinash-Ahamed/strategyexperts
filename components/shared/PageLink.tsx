import type { AnchorHTMLAttributes } from "react";

/** Full-document links are intentional: each service is an independent page. */
export default function PageLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />;
}
