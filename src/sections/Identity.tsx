import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSectionInView } from "@/lib/useSectionInView";
import { Magnetic } from "@/ui/Magnetic";
import { HeroBackdrop } from "./HeroBackdrop";

export function Identity() {
  const ref = useSectionInView("identity");
  return (
    <section
      id="identity"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative flex min-h-screen items-center overflow-hidden px-5 pt-24 pb-14 sm:px-8 md:px-16 md:pt-28"
    >
      <HeroBackdrop />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
        <FloatingColumn>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-foreground/40" />
            <span className="hud-label">ROUSHAN KUMAR</span>
          </div>

          <h1
            className="font-display text-5xl md:text-6xl lg:text-7xl"
            style={{
              letterSpacing: "-0.03em",
              lineHeight: 0.96,
            }}
          >
            <RevealLine delay={0}>
              <span style={{ fontWeight: 300, color: "color-mix(in oklab, var(--foreground) 55%, transparent)" }}>
                Building
              </span>
            </RevealLine>
            <RevealLine delay={0.12}>
              <span style={{ fontWeight: 500 }}>Systems,</span>
            </RevealLine>
            <RevealLine delay={0.24}>
              <span style={{ fontWeight: 300, color: "color-mix(in oklab, var(--foreground) 55%, transparent)" }}>
                Not Just
              </span>
            </RevealLine>
            <RevealLine delay={0.36}>
              <span className="text-scan" style={{ fontWeight: 500 }}>
                Software.
              </span>
            </RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:mt-8 md:text-lg"
            style={{ letterSpacing: "0.005em" }}
          >
            I design backend infrastructure, AI-powered developer tools, and
            scalable software focused on performance, reliability, and developer
            experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Magnetic label="VIEW_PROJECTS">
              <a
                href="#modules"
                className="scan-hover group inline-flex items-center gap-3 border border-foreground bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-background sm:px-6"
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--scan)" }}
                />
                View_Projects
              </a>
            </Magnetic>
            <Magnetic label="GET_IN_TOUCH">
              <a
                href="#transmission"
                className="scan-hover inline-flex items-center gap-3 border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-widest sm:px-6"
              >
                Get_in_touch →
              </a>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.9 }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-5"
          >
            <Stat n="3+" label="Featured Projects" />
            <Stat n="3" label="Job Simulations" />
            <Stat n="15+" label="Tech Stack" />
          </motion.div>
        </FloatingColumn>

        <ProfileCard />
      </div>
    </section>
  );
}

function FloatingColumn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ y: [0, -3, 0, 3, 0] }}
      transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}

function ProfileCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      setTilt({ x: dx * 8, y: dy * 8 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const rows: [string, string, boolean?][] = [
    ["ROLE", "Backend & Cloud Developer"],
    ["FOCUS", "Distributed Systems & Cloud"],
    ["STACK", "TypeScript · Python · Docker · OCI"],
    ["CURRENT", "Building Stride & Astra Vision"],
    ["STATUS", "Open to Internships", true],
    ["LOCATION", "Patna, India"],
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
      style={{
        transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)`,
        transition: "transform 400ms cubic-bezier(0.2,0.7,0.2,1)",
      }}
      className="glass-panel relative mx-auto w-full max-w-[320px] p-4 sm:max-w-sm sm:p-5 md:justify-self-end"
    >
      <div className="flex items-center justify-between">
        <span className="hud-label">PROFILE</span>
        <span className="font-mono text-[10px] tracking-widest text-scan">AVAILABLE</span>
      </div>

      <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-full border border-border bg-background">
        <img
          src="/roushan.jpg"
          alt="Roushan Kumar — Backend & Cloud Developer portrait"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "contrast(1.02)" }}
        />
        <div className="scan-line-loop" />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, transparent 0, transparent 5px, color-mix(in oklab, var(--foreground) 8%, transparent) 5px, color-mix(in oklab, var(--foreground) 8%, transparent) 6px)",
          }}
        />
        {/* Slow glass reflection sweep */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, color-mix(in oklab, var(--foreground) 12%, transparent) 50%, transparent 60%)",
            transform: "translateX(-100%)",
            animation: "hero-card-sheen 12s ease-in-out infinite",
          }}
        />
      </div>

      <div className="mt-5 flex flex-col divide-y divide-border font-mono text-[10.5px] uppercase tracking-widest">
        {rows.map(([k, v, accent]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-4 py-2"
          >
            <span className="text-muted-foreground">{k}</span>
            <span
              className="text-right"
              style={{ color: accent ? "var(--scan)" : undefined }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes hero-card-sheen {
          0%   { transform: translateX(-100%); opacity: 0; }
          40%  { opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div
        className="font-display text-3xl sm:text-4xl"
        style={{ fontWeight: 300, letterSpacing: "-0.02em" }}
      >
        {n}
      </div>
      <div className="hud-label mt-1">{label}</div>
    </div>
  );
}

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "100%", filter: "blur(4px)" }}
        whileInView={{ y: "0%", filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay, duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}
