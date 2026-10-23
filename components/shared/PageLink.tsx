import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { prefetch?: false };

/** Full-document links are intentional: each service is an independent page. */
export default function PageLink({ prefetch, ...props }: Props) {
  // Accept the existing opt-out without forwarding a non-HTML attribute.
  void prefetch;
  return <a {...props} />;
}
