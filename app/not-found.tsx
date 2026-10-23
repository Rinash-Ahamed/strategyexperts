import Link from "@/components/shared/PageLink";

export default function NotFound() {
  return (
    <div className="wrap center-page">
      <h1 className="h1">This page doesn’t exist.</h1>
      <p className="lead">The link may be out of date. Head back home or explore our services.</p>
      <div className="hero-cta">
        <Link href="/" className="btn btn-primary">Back to home <span className="arr" aria-hidden="true">→</span></Link>
        <Link href="/contact" className="btn btn-ghost">Discuss your business</Link>
      </div>
    </div>
  );
}
