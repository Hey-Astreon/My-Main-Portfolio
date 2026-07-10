import { useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import { toast } from "sonner";
import { useSectionInView } from "@/lib/useSectionInView";
import { Magnetic } from "@/ui/Magnetic";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name (2+ characters)." })
    .max(100, { message: "Name must be under 100 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." })
    .max(255, { message: "Email must be under 255 characters." }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(1000, { message: "Message must be under 1000 characters." }),
});

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const CONTACT_EMAIL = "roushanraut404@gmail.com";

export function Transmission() {
  const ref = useSectionInView("transmission");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("msg") ?? ""),
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors | undefined;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the errors and try again.");
      return;
    }

    setSubmitting(true);
    try {
      // Deliver via user's default email client — reliable, no backend keys required.
      const subject = `Portfolio contact — ${parsed.data.name}`;
      const body = `${parsed.data.message}\n\n—\nFrom: ${parsed.data.name} <${parsed.data.email}>`;
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setSent(true);
      toast.success("Opening your email client to send the message.", {
        description: `If nothing opens, email me directly at ${CONTACT_EMAIL}.`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please email me directly.", {
        description: CONTACT_EMAIL,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="transmission"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen px-5 py-20 sm:px-8 md:px-16 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="hud-label mb-3">05 // CONTACT</div>
        <h2 className="font-display text-3xl leading-[0.95] tracking-tight sm:text-4xl md:text-6xl">
          Let's <span className="text-scan">work together.</span>
        </h2>
        <p className="mt-6 max-w-lg text-sm text-muted-foreground">
          Open to internships, full-time roles, and freelance collaboration.
          I typically reply within 24 hours.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-[1.4fr_0.9fr]">
          <div className="glass-panel relative p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="hud-label">SEND A MESSAGE</span>
              <div className="flex gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-scan" />
              </div>
            </div>

            {sent ? (
              <div className="space-y-3 py-6">
                <div className="font-mono text-sm text-scan">
                  ✓ Your email client should have opened.
                </div>
                <p className="text-sm text-muted-foreground">
                  If it didn't, please email me directly at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-2 border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <Field label="Name" error={errors.name}>
                  <input
                    required
                    name="name"
                    aria-invalid={!!errors.name}
                    placeholder="Your full name"
                    className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    required
                    type="email"
                    name="email"
                    aria-invalid={!!errors.email}
                    placeholder="you@company.com"
                    className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </Field>
                <Field label="Message" error={errors.message}>
                  <textarea
                    required
                    name="msg"
                    rows={4}
                    aria-invalid={!!errors.message}
                    placeholder="Tell me about your project or role"
                    className="w-full resize-none bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </Field>
                <Magnetic label="SEND_MESSAGE">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="scan-hover inline-flex items-center gap-3 border border-foreground bg-foreground px-6 py-3 text-[11px] uppercase tracking-widest text-background disabled:opacity-60"
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--scan)" }}
                    />
                    {submitting ? "Sending…" : "Send_Message"}
                  </button>
                </Magnetic>
                <p className="pt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Opens your email app. Prefer direct? {CONTACT_EMAIL}
                </p>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {[
              { k: "EMAIL", v: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
              { k: "PHONE", v: "+91 94314 83512", href: "tel:+919431483512" },
              { k: "GITHUB", v: "github.com/Hey-Astreon", href: "https://github.com/Hey-Astreon" },
              {
                k: "LINKEDIN",
                v: "in/roushan-kumar-ab4b19250",
                href: "https://www.linkedin.com/in/roushan-kumar-ab4b19250/",
              },
            ].map((c, i) => (
              <Magnetic key={c.k} label={c.k}>
                <motion.a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-panel scan-hover flex items-center justify-between gap-4 p-4 font-mono text-[11px] uppercase tracking-widest"
                >
                  <span className="text-muted-foreground">{c.k}</span>
                  <span className="truncate text-right">{c.v} →</span>
                </motion.a>
              </Magnetic>
            ))}

            <div className="glass-panel mt-2 p-4 font-mono text-[10px] leading-relaxed tracking-widest text-muted-foreground">
              <div className="text-scan">// AVAILABILITY</div>
              <p className="mt-2">
                Based in Patna, India. Open to remote roles worldwide and
                on-site opportunities across India.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:mt-20">
          <span>© {new Date().getFullYear()} ROUSHAN KUMAR // ASTREON</span>
          <span>STATUS :: <span className="text-scan">AVAILABLE</span></span>
        </footer>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        {error && <span className="text-[color:hsl(0_70%_60%)]">! {error}</span>}
      </span>
      <div
        className="border-b pb-2 transition-colors"
        style={{ borderColor: error ? "hsl(0 70% 60%)" : "var(--border)" }}
      >
        {children}
      </div>
    </label>
  );
}
