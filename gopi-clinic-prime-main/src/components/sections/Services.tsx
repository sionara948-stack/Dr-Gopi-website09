import { motion } from "framer-motion";
import { useState } from "react";

const services = [
  { t: "General Medicine", d: "Comprehensive primary care for adults — diagnosis, treatment, and continuity of care across acute and chronic conditions." },
  { t: "Diabetology", d: "Long-term management of Type 1, Type 2, and gestational diabetes with personalised lifestyle and pharmacological plans." },
  { t: "Preventive Healthcare", d: "Annual health reviews, screening protocols, and risk profiling tailored to age, family history, and lifestyle." },
  { t: "Women's Health", d: "Considered, private consultations covering hormonal, metabolic, and general wellness needs across life stages." },
  { t: "Thyroid Care", d: "Diagnosis and ongoing management of hypo- and hyperthyroidism, nodules, and autoimmune thyroid disorders." },
  { t: "Lifestyle Disorders", d: "Structured, evidence-based programmes for obesity, metabolic syndrome, sleep, and stress-related illness." },
  { t: "Hypertension Management", d: "Calibrated blood pressure treatment with home-monitoring guidance and cardiovascular risk reduction." },
  { t: "Senior Citizen Care", d: "Patient, unhurried geriatric medicine focusing on dignity, polypharmacy review, and quality of life." },
  { t: "Wellness Consultation", d: "One-to-one consultations on nutrition, movement, and recovery — practical guidance grounded in clinical evidence." },
  { t: "Follow-up Care", d: "Continuity-driven follow-ups so treatment plans evolve with your progress, not a calendar." },
];

export function Services() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" className="relative py-32 md:py-44">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-20 max-w-3xl">
          <p className="editorial-eyebrow mb-6">Clinical Services</p>
          <h2 className="editorial-display text-5xl md:text-7xl text-foreground">
            Ten disciplines.<br />
            <span className="text-muted-foreground">One standard of care.</span>
          </h2>
        </div>

        <ul className="divide-y divide-border border-y border-border">
          {services.map((s, i) => {
            const isActive = active === i;
            const dim = active !== null && !isActive;
            return (
              <li
                key={s.t}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(isActive ? null : i)}
                data-cursor="hover"
                className={`group relative cursor-none transition-all duration-700 ${
                  dim ? "opacity-30" : "opacity-100"
                }`}
              >
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-8 md:py-10">
                  <span className="font-sans text-xs tracking-[0.2em] text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className={`editorial-display transition-all duration-700 ${
                      isActive
                        ? "text-5xl md:text-7xl translate-x-4 text-foreground"
                        : "text-3xl md:text-5xl text-foreground/80"
                    }`}
                  >
                    {s.t}
                  </h3>
                  <span
                    className={`text-xs uppercase tracking-[0.2em] transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                    }`}
                  >
                    Read &rarr;
                  </span>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-10 pl-12 text-base leading-relaxed text-muted-foreground">
                    {s.d}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
