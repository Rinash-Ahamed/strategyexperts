"use client";

import { useState } from "react";

const NAMES = [
  "Amazon", "Flipkart", "Meesho", "Zomato", "Swiggy",
  "MakeMyTrip", "Booking.com", "Agoda", "Goibibo", "Expedia",
  "Cleartrip", "EaseMyTrip", "Yatra", "Google", "Meta", "WhatsApp",
];

export default function Ticker() {
  const [paused, setPaused] = useState(false);
  const group = (hidden: boolean) => (
    <div className="ticker-group" aria-hidden={hidden || undefined}>
      {NAMES.map((n) => (
        <span key={n} style={{ display: "contents" }}>
          <span>{n}</span>
          <i />
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker on-dark" data-paused={paused} role="region" aria-label="Platforms we work across">
      <div className="ticker-track">
        {group(false)}
        {group(true)}
      </div>
      <button type="button" className="ticker-control" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? "Resume platform ticker" : "Pause platform ticker"}
      </button>
    </div>
  );
}
