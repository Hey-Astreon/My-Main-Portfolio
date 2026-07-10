import { motion } from "motion/react";
import { useSectionInView } from "@/lib/useSectionInView";

const EXPERIENCE = [
  {
    code: "E-01",
    org: "Y Combinator · Shiptivity",
    role: "Software Engineering Simulation",
    date: "Jun 2026",
    stack: ["React", "Dragula", "SQL"],
    bullets: [
      "Built an interactive React Kanban board to replace legacy spreadsheet logging, reducing task status tracking latency by 45%.",
      "Integrated Dragula for drag-and-drop UI, implementing custom drop interceptors that cut component re-render cycles by 30%.",
      "Analyzed simulated engagement metrics with SQL and proposed two features that improved user retention by 15%.",
    ],
    metrics: [
      ["-45%", "Tracking latency"],
      ["-30%", "Re-renders"],
      ["+15%", "Retention"],
    ],
  },
  {
    code: "E-02",
    org: "Commonwealth Bank",
    role: "Software Engineering Job Simulation",
    date: "Jun 2026",
    stack: ["C#/.NET", "MongoDB", "React/Redux", "xUnit"],
    bullets: [
      "Extended C#/.NET controllers and updated MongoDB schemas for partial updates, eliminating silent data overwrites and cutting payload sizes by 35%.",
      "Modernized a React/Redux front-end with an interactive Goal Manager, optimizing state flow to reduce UI lag by 25%.",
      "Authored automated integration tests with xUnit and Moq, achieving 95% controller coverage and cutting QA validation time by 40%.",
    ],
    metrics: [
      ["95%", "Test coverage"],
      ["-35%", "DB payload"],
      ["-25%", "UI lag"],
    ],
  },
  {
    code: "E-03",
    org: "Walmart USA",
    role: "Advanced Software Engineering Simulation",
    date: "May 2026",
    stack: ["Java", "Python", "SQLite"],
    bullets: [
      "Designed a generic K-ary Max Heap in Java using bitwise shift operations to accelerate parent-child index calculations by 35% over standard arithmetic.",
      "Created micro-benchmarks across branching exponents, finding k=4 increased overall queue throughput by 22%.",
      "Engineered Python ETL pipelines with csv and sqlite3 to parse and merge raw spreadsheets, consolidating over 10k+ records into a clean SQLite database.",
    ],
    metrics: [
      ["+22%", "Throughput"],
      ["10k+", "Records ETL"],
      ["-35%", "Index calc"],
    ],
  },
];

export function Experience() {
  const ref = useSectionInView("experience");
  return (
    <section
      id="experience"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen px-5 py-20 sm:px-8 md:px-16 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <div className="hud-label mb-3">03 // EXPERIENCE</div>
            <h2 className="font-display text-3xl leading-[0.95] tracking-tight sm:text-4xl md:text-6xl">
              Simulations &
              <br />
              <span className="text-scan">virtual internships.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Structured engineering programs from YC, Commonwealth Bank, and
            Walmart — each shipped with measurable performance outcomes.
          </p>
        </header>

        <div className="relative space-y-6">
          {EXPERIENCE.map((e, i) => (
            <motion.article
              key={e.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              className="glass-panel grid grid-cols-1 gap-6 p-6 md:grid-cols-[240px_1fr] md:gap-8"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  {e.code} · {e.date}
                </span>
                <h3 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                  {e.org}
                </h3>
                <span className="hud-label">{e.role}</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {e.stack.map((s) => (
                    <span
                      key={s}
                      className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-scan" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
                  {e.metrics.map(([n, l]) => (
                    <div key={l}>
                      <div className="font-display text-xl text-foreground md:text-2xl">{n}</div>
                      <div className="hud-label mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
