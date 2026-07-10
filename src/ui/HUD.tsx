import { useEffect, useState } from "react";
import { sceneBus, type SectionId } from "@/lib/scene-bus";
import { useDeviceTier } from "@/scene/useDeviceTier";

const MODULE_LABELS: Record<SectionId, string> = {
  identity: "01 // ABOUT",
  modules: "02 // PROJECTS",
  experience: "03 // EXPERIENCE",
  matrix: "04 // SKILLS",
  transmission: "05 // CONTACT",
};

const NAV: [SectionId, string, string][] = [
  ["identity", "01·ABOUT", "ABOUT"],
  ["modules", "02·PROJECTS", "PROJECTS"],
  ["experience", "03·EXPERIENCE", "EXP"],
  ["matrix", "04·SKILLS", "SKILLS"],
  ["transmission", "05·CONTACT", "CONTACT"],
];

function useUtcClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return t.toISOString().slice(11, 19);
}

function useFps() {
  const [fps, setFps] = useState(60);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    const loop = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return fps;
}

export function HUD({
  theme,
  onToggleTheme,
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const utc = useUtcClock();
  const fps = useFps();
  const tier = useDeviceTier();
  const [section, setSection] = useState<SectionId>(sceneBus.current);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const unsub = sceneBus.subscribe(setSection);
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <Corner tl />
      <Corner tr />
      <Corner bl />
      <Corner br />

      {/* Top bar */}
      <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-scan"
              style={{ boxShadow: "0 0 10px var(--scan)" }}
            />
            <span className="font-display text-sm font-medium tracking-wider">ASTREON</span>
            <span className="hud-label hidden sm:inline">v4.0</span>
          </div>
          <nav className="hidden items-center gap-5 lg:flex">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                data-magnetic
                data-label={label}
                className="hud-label transition-colors hover:text-foreground"
                style={{ color: section === id ? "var(--scan)" : undefined }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden items-center gap-4 xl:flex">
            <Telemetry k="STATUS" v="ONLINE" accent />
            <Telemetry k="FPS" v={String(fps).padStart(2, "0")} />
            <Telemetry k="TIER" v={tier.toUpperCase()} />
            <Telemetry k="UTC" v={utc} />
          </div>
          <div className="hidden items-center gap-3 md:flex xl:hidden">
            <Telemetry k="FPS" v={String(fps).padStart(2, "0")} />
            <Telemetry k="UTC" v={utc} />
          </div>
          <button
            data-magnetic
            data-label="TOGGLE_THEME"
            onClick={onToggleTheme}
            className="scan-hover pointer-events-auto flex items-center gap-2 border border-border bg-card/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur"
            aria-label="Toggle theme"
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--scan)" }}
            />
            {theme === "dark" ? "DARK" : "LIGHT"}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="pointer-events-auto flex items-center gap-1.5 border border-border bg-card/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur lg:hidden"
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="pointer-events-auto absolute right-4 top-14 z-50 flex flex-col gap-1 border border-border bg-background/95 p-3 backdrop-blur lg:hidden">
          {NAV.map(([id, , short]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="hud-label px-3 py-2 transition-colors hover:text-foreground"
              style={{ color: section === id ? "var(--scan)" : undefined }}
            >
              {short}
            </a>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-col gap-1">
          <span className="hud-label">CURRENT</span>
          <span className="font-display text-xs tracking-wider md:text-sm">
            {MODULE_LABELS[section]}
          </span>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Telemetry k="LOC" v="PATNA·IN" />
          <Telemetry k="ROLE" v="DEVELOPER" />
          <Telemetry k="AVAIL" v="OPEN" accent />
        </div>
      </div>

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
    </div>
  );
}

function Telemetry({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest">
      <span className="text-muted-foreground">{k}</span>
      <span style={{ color: accent ? "var(--scan)" : undefined }}>{v}</span>
    </div>
  );
}

function Corner({
  tl,
  tr,
  bl,
  br,
}: {
  tl?: boolean;
  tr?: boolean;
  bl?: boolean;
  br?: boolean;
}) {
  const pos: React.CSSProperties = { position: "absolute", width: 24, height: 24 };
  if (tl) Object.assign(pos, { top: 16, left: 16, borderTop: "1px solid var(--foreground)", borderLeft: "1px solid var(--foreground)" });
  if (tr) Object.assign(pos, { top: 16, right: 16, borderTop: "1px solid var(--foreground)", borderRight: "1px solid var(--foreground)" });
  if (bl) Object.assign(pos, { bottom: 16, left: 16, borderBottom: "1px solid var(--foreground)", borderLeft: "1px solid var(--foreground)" });
  if (br) Object.assign(pos, { bottom: 16, right: 16, borderBottom: "1px solid var(--foreground)", borderRight: "1px solid var(--foreground)" });
  return <div style={pos} />;
}
