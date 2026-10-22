"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wrap center-page">
      <span className="eyebrow">Something went wrong</span>
      <h1 className="h1">We hit a snag.</h1>
      <p className="lead">Please try again. If it keeps happening, reach out through the contact page.</p>
      <div className="hero-cta">
        <button className="btn btn-primary" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
