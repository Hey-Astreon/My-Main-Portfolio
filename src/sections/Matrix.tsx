import { motion } from "motion/react";
import { useSectionInView } from "@/lib/useSectionInView";

const GROUPS: { title: string; code: string; items: string[] }[] = [
  {
    title: "Languages",
    code: "S-01",
    items: ["C#", "Java", "Python", "Rust", "JavaScript", "TypeScript", "SQL", "HTML5", "CSS3"],
  },
  {
    title: "Backend & Databases",
    code: "S-02",
    items: [
      "Spring Boot",
      "Node.js",
      "Express.js",
      ".NET",
      "FastAPI",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "SQLite",
    ],
  },
  {
    title: "Frontend Libraries",
    code: "S-03",
    items: ["React.js", "Redux", "Dragula", "Bootstrap", "TailwindCSS"],
  },
  {
    title: "Testing, Cloud & Tools",
    code: "S-04",
    items: [
      "xUnit",
      "Moq",
      "JUnit 5",
      "MockMvc",
      "PyTest",
      "Docker",
      "Google Cloud",
      "Git",
      "GitHub",
      "GitLab CI/CD",
      "Gradle",
      "Vercel",
      "Render",
    ],
  },
];

export function Matrix() {
  const ref = useSectionInView("matrix");
  return (
    <section
      id="matrix"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen px-5 py-20 sm:px-8 md:px-16 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <div className="hud-label mb-3">04 // TECHNICAL SKILLS</div>
            <h2 className="font-display text-3xl leading-[0.95] tracking-tight sm:text-4xl md:text-6xl">
              The stack,
              <br />
              <span className="text-scan">chosen with intent.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Languages, frameworks, databases, and tooling I rely on to design
            and ship reliable backend systems and full-stack products.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {GROUPS.map((g, i) => (
            <motion.div
              key={g.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              className="glass-panel p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="hud-label">{g.code} // {g.title.toUpperCase()}</span>
                <span className="font-mono text-[10px] tracking-widest text-scan">
                  {String(g.items.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-xl tracking-tight md:text-2xl">{g.title}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span
                    key={s}
                    className="scan-hover border border-border bg-card/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
