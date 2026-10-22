import { ImageResponse } from "next/og";

export const alt = "Strategy Experts — Better strategy. Stronger business.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f5f8fe", padding: 72, color: "#08122e" }}>
        <div style={{ fontSize: 34, fontWeight: 800, display: "flex" }}>
          Strategy<span style={{ color: "#1b4dff" }}>.</span>Experts
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 120, fontWeight: 800, lineHeight: 0.95, letterSpacing: -5 }}>
          <span>Better strategy.</span>
          <span style={{ color: "#1b4dff" }}>Stronger business.</span>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 26, color: "#44506b" }}>
          E-Commerce · Restaurants · Hotels · Digital Marketing
        </div>
      </div>
    ),
    size
  );
}
