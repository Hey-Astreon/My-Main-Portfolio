import { motion } from "motion/react";
import { useSectionInView } from "@/lib/useSectionInView";
import { Magnetic } from "@/ui/Magnetic";

const MODULES = [
  {
    code: "P-01",
    kind: "Security · Full-Stack",
    status: "live",
    title: "Alyra Lock",
    desc: "Zero-knowledge password manager using AES-GCM client-side encryption and PBKDF2 key derivation. Encrypted vault sync stays under 200ms over REST with JWT auth.",
    stack: ["TypeScript", "React", "JWT", "AES-GCM"],
    live: "https://alyra-lock.vercel.app",
    github: "https://github.com/Hey-Astreon/alyra-lock",
  },
  {
    code: "P-02",
    kind: "AI · Backend",
    status: "live",
    title: "Axiom AI Orchestration Gateway",
    desc: "AI model routing API with Redis caching that lowered average dispatch times by 65%. Real-time WebSocket telemetry streams metrics under 40ms latency.",
    stack: ["FastAPI", "Redis", "WebSockets", "Python"],
    live: "https://axiom-orchestration-gateway.onrender.com/dashboard",
    github: "https://github.com/Hey-Astreon/axiom-gateway",
  },
  {
    code: "P-03",
    kind: "Developer Tools · AI",
    status: "beta",
    title: "Astra Vision",
    desc: "AI-powered developer assistant using AST parsing and semantic code graphs to help engineers debug 30% faster, with runtime error mapping at 90%+ accuracy.",
    stack: ["Python", "AST", "React", "GCP"],
    live: "https://astra-frontend-mrfinklbba-uc.a.run.app",
    github: "https://github.com/Hey-Astreon/astra-vision",
  },
];

export function Modules() {
  const ref = useSectionInView("modules");
  return (
    <section
      id="modules"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen px-5 py-20 sm:px-8 md:px-16 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <div className="hud-label mb-3">02 // PROJECTS</div>
            <h2 className="font-display text-3xl leading-[0.95] tracking-tight sm:text-4xl md:text-6xl">
              Selected projects,
              <br />
              <span className="text-scan">shipped & measured.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Each project is a production-grade build — versioned, benchmarked,
            and instrumented with real performance metrics.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <motion.article
              key={m.code}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              className="glass-panel group relative flex h-full flex-col p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  {m.code}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: m.status === "beta" ? "var(--scan)" : undefined }}
                >
                  ● {m.status}
                </span>
              </div>

              <div className="hud-label mb-2">{m.kind}</div>
              <h3 className="font-display text-2xl leading-tight tracking-tight">{m.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {m.stack.map((s) => (
                  <span
                    key={s}
                    className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
                <Magnetic label={`LIVE_${m.code}`}>
                  <a
                    href={m.live}
                    target="_blank"
                    rel="noreferrer"
                    className="scan-hover flex items-center justify-between border border-foreground bg-foreground px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-background"
                  >
                    <span>Live</span>
                    <span>↗</span>
                  </a>
                </Magnetic>
                <Magnetic label={`CODE_${m.code}`}>
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noreferrer"
                    className="scan-hover flex items-center justify-between border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest"
                  >
                    <span>GitHub</span>
                    <span>↗</span>
                  </a>
                </Magnetic>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
