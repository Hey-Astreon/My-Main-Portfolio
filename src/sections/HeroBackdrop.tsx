// Hero backdrop: blueprint grid + orbital rings + soft blue blob.

export function HeroBackdrop() {
  const nodesOuter = Array.from({ length: 7 }).map((_, i) => {
    const a = (i / 7) * Math.PI * 2;
    return { x: 50 + Math.cos(a) * 34, y: 50 + Math.sin(a) * 34, d: i * 0.4 };
  });
  const nodesInner = Array.from({ length: 5 }).map((_, i) => {
    const a = (i / 5) * Math.PI * 2 + 0.7;
    return { x: 50 + Math.cos(a) * 20, y: 50 + Math.sin(a) * 20, d: i * 0.5 };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse at 50% 45%, black 30%, transparent 85%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 45%, black 30%, transparent 85%)",
      }}
    >
      {/* Soft blue blob */}
      <div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(70vmin, 780px)",
          height: "min(70vmin, 780px)",
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--scan) 55%, transparent) 0%, color-mix(in oklab, var(--scan) 20%, transparent) 35%, transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.55,
        }}
      />

      {/* Blueprint grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.05,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          opacity: 0.025,
        }}
      />

      {/* Orbital rings + nodes */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <g
          style={{
            transformOrigin: "50% 45%",
            animation: "hero-orbit-slow 120s linear infinite",
          }}
        >
          <circle
            cx="50"
            cy="45"
            r="34"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="0.06"
            strokeDasharray="0.6 0.9"
            opacity="0.18"
          />
          {nodesOuter.map((n, i) => (
            <circle
              key={i}
              cx={n.x}
              cy={n.y - 5}
              r="0.22"
              fill={i === 2 ? "var(--scan)" : "var(--foreground)"}
              opacity="0.55"
              style={{
                animation: `hero-node-pulse 4.5s ease-in-out ${n.d}s infinite`,
              }}
            />
          ))}
        </g>
        <g
          style={{
            transformOrigin: "50% 45%",
            animation: "hero-orbit-rev 90s linear infinite",
          }}
        >
          <circle
            cx="50"
            cy="45"
            r="20"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="0.06"
            strokeDasharray="0.4 1.2"
            opacity="0.14"
          />
          {nodesInner.map((n, i) => (
            <circle
              key={i}
              cx={n.x}
              cy={n.y - 5}
              r="0.22"
              fill={i === 1 ? "var(--scan)" : "var(--foreground)"}
              opacity="0.5"
              style={{
                animation: `hero-node-pulse 5.5s ease-in-out ${n.d}s infinite`,
              }}
            />
          ))}
        </g>
      </svg>

      <style>{`
        @keyframes hero-orbit-slow { to { transform: rotate(360deg); } }
        @keyframes hero-orbit-rev  { to { transform: rotate(-360deg); } }
        @keyframes hero-node-pulse {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 0.75; }
        }
      `}</style>
    </div>
  );
}
