import { motion } from "framer-motion";
import type { ReactNode } from "react";

const reviews = [
  { t: "Dr. Gopi explained every step with such [care] — I left feeling heard, not rushed.", n: "Lakshmi R.", c: "Diabetology follow-up" },
  { t: "Rare to find this kind of [comfort] in a clinic. The staff knew my name on the second visit.", n: "Anil K.", c: "General Medicine" },
  { t: "After years of switching doctors, I finally have one I [trust]. Calm, thoughtful, evidence-based.", n: "Sushma P.", c: "Hypertension" },
  { t: "He [explained clearly] what was happening and gave me a plan I could actually follow.", n: "Ravi M.", c: "Lifestyle review" },
  { t: "Dr. Saradha brought such [comfort] during a difficult consultation — never made me feel hurried.", n: "Priya S.", c: "Women's Health" },
  { t: "What stood out was the [care] taken to ensure my mother understood her medication.", n: "Vikram T.", c: "Senior Care" },
];

const HIGHLIGHTED = ["care", "comfort", "trust", "explained clearly"];

function renderReview(text: string): ReactNode[] {
  const parts: ReactNode[] = [text];
  HIGHLIGHTED.forEach((word) => {
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (typeof part !== "string") continue;
      const regex = new RegExp(`\\[(${word})\\]`, "i");
      const m = part.match(regex);
      if (!m) continue;
      const idx = part.indexOf(m[0]);
      const before = part.slice(0, idx);
      const after = part.slice(idx + m[0].length);
      parts.splice(
        i,
        1,
        before,
        <em key={`${word}-${i}`} className="font-serif not-italic text-foreground relative px-0.5" style={{ backgroundImage: "linear-gradient(to top, oklch(0.18 0.005 270 / 0.08) 30%, transparent 30%)" }}>{m[1]}</em>,
        after,
      );
    }
  });
  return parts;
}

export function Reviews() {
  return (
    <section id="reviews" className="relative py-32 md:py-48 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-24 max-w-3xl">
          <p className="editorial-eyebrow mb-6">In their words</p>
          <h2 className="editorial-display text-5xl md:text-7xl text-foreground">
            What patients<br />
            <span className="text-muted-foreground">have written.</span>
          </h2>
        </div>

        <div className="relative grid gap-x-8 gap-y-20 md:grid-cols-2">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.n}
              initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: (i % 2) * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={`relative ${i % 3 === 1 ? "md:translate-y-16" : ""} ${i % 3 === 2 ? "md:-translate-y-6" : ""} group`}
            >
              <span className="editorial-display text-7xl text-muted-foreground/40 leading-none">&ldquo;</span>
              <blockquote className="editorial-display text-2xl md:text-3xl leading-snug text-foreground/85 transition-colors group-hover:text-foreground -mt-4">
                {renderReview(r.t)}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-px w-8 bg-border" />
                <span>{r.n}</span>
                <span className="text-foreground/40">&middot;</span>
                <span>{r.c}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
