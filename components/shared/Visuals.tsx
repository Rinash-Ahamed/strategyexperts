/** Abstract, purely decorative compositions. No data is implied. */

export function HeroArt() {
  const heights = [90, 150, 128, 214, 262, 332, 424];
  const base = 480;
  const x0 = 36;
  const step = 100;
  const w = 72;
  const tops = heights.map((h, i) => ({ x: x0 + i * step + w / 2, y: base - h }));
  const d = tops
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y - 26}`;
      const prev = tops[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C ${cx} ${prev.y - 26}, ${cx} ${p.y - 26}, ${p.x} ${p.y - 26}`;
    })
    .join(" ");
  const last = tops[tops.length - 1];

  return (
    <svg className="hero-art" viewBox="0 0 760 520" role="presentation" aria-hidden="true" focusable="false">
      {[80, 160, 240, 320, 400].map((y) => (
        <line key={y} x1="0" x2="760" y1={y} y2={y} stroke="#d9e2f3" strokeWidth="1" />
      ))}
      <line x1="0" x2="760" y1={base} y2={base} stroke="#08122e" strokeWidth="1.5" />
      {heights.map((h, i) => {
        const isLast = i === heights.length - 1;
        const dark = i === 4;
        return (
          <rect
            key={i}
            className="bar"
            style={{ ["--i" as string]: i }}
            x={x0 + i * step}
            y={base - h}
            width={w}
            height={h}
            fill={isLast ? "#1b4dff" : dark ? "#050d29" : "#e8efff"}
            stroke={isLast || dark ? "none" : "#b9c7e4"}
            strokeWidth="1"
          />
        );
      })}
      <path className="trace" d={d} fill="none" stroke="#08122e" strokeWidth="2" strokeLinecap="round" />
      <g className="node">
        <circle cx={last.x} cy={last.y - 26} r="16" fill="#fff" stroke="#08122e" strokeWidth="2" />
        <circle cx={last.x} cy={last.y - 26} r="5" fill="#1b4dff" />
      </g>
    </svg>
  );
}

export function Rings({ color = "#0369a1" }: { color?: string }) {
  return (
    <svg className="rings" viewBox="0 0 500 500" role="presentation" aria-hidden="true" focusable="false">
      {[230, 180, 130, 80].map((r, i) => (
        <circle
          key={r}
          className="ring"
          style={{ ["--i" as string]: i }}
          cx="250"
          cy="250"
          r={r}
          fill={i === 3 ? color : "none"}
          stroke={color}
          strokeOpacity={i === 3 ? 1 : 0.18 + i * 0.16}
          strokeWidth="1.5"
        />
      ))}
      <line x1="250" x2="250" y1="10" y2="490" stroke={color} strokeOpacity=".15" />
      <line x1="10" x2="490" y1="250" y2="250" stroke={color} strokeOpacity=".15" />
      <path d="M250 214 c-19 0 -34 15 -34 34 c0 26 34 58 34 58 s34 -32 34 -58 c0 -19 -15 -34 -34 -34 z" fill="#fff" />
      <circle cx="250" cy="248" r="11" fill={color} />
    </svg>
  );
}
