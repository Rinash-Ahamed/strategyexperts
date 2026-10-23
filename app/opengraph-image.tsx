import { ImageResponse } from "next/og";

export const alt = "Strategy Experts - Better strategy. Stronger business.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000000", padding: 72, color: "#f0f0f0" }}>
        <div style={{ fontSize: 34, fontWeight: 400, display: "flex" }}>
          Strategy Experts
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 120, fontWeight: 800, lineHeight: 0.95, letterSpacing: -5 }}>
          <span>Better strategy.</span>
          <span style={{ color: "#bdbdbd" }}>Stronger business.</span>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 26, color: "#858585" }}>
          E-Commerce · Restaurants · Hotels · Digital Marketing
        </div>
      </div>
    ),
    size
  );
}
