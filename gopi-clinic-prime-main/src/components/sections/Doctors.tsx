import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";

const doctors = [
  {
    name: "Dr. Gopi",
    role: "MD, Internal Medicine & Diabetology",
    img: doctor1,
    bio: "With over a decade of practice in internal medicine and diabetology, Dr. Gopi is known for unhurried consultations and an evidence-led approach to chronic illness. He believes the most important diagnostic tool remains the conversation.",
  },
  {
    name: "Dr. Saradha",
    role: "MD, Women's Health & Wellness",
    img: doctor2,
    bio: "Dr. Saradha leads women's health and wellness consultations at the clinic. Her practice combines clinical rigour with a quiet attentiveness to the lived experience of every patient she sees.",
  },
];

function DoctorCard({ d, i }: { d: typeof doctors[number]; i: number }) {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-20 items-start"
    >
      <motion.div
        style={{ y }}
        className={`relative ${i % 2 ? "md:order-2" : ""}`}
      >
        <div
          className="relative aspect-[3/4] overflow-hidden bg-fog"
          style={{
            boxShadow: hover
              ? "0 40px 80px -40px oklch(0.18 0.005 270 / 0.35), 0 20px 40px -20px oklch(0.18 0.005 270 / 0.18)"
              : "0 25px 60px -30px oklch(0.18 0.005 270 / 0.22)",
            transition: "box-shadow 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)",
            transform: hover ? "translateY(-6px)" : "translateY(0)",
          }}
        >
          <img
            src={d.img}
            alt={d.name}
            className="h-full w-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)]"
            style={{
              filter: hover ? "grayscale(0%) contrast(1.02)" : "grayscale(25%)",
              transform: hover ? "scale(1.03)" : "scale(1)",
            }}
          />
          <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 80px oklch(0.18 0.005 270 / 0.12)" }} />
        </div>
      </motion.div>
      <div className="pt-6">
        <p className="editorial-eyebrow mb-5">{String(i + 1).padStart(2, "0")} &nbsp;/&nbsp; Practitioner</p>
        <h3 className="editorial-display text-5xl md:text-7xl text-foreground">{d.name}</h3>
        <p className="mt-4 text-[11px] tracking-[0.28em] uppercase text-muted-foreground">{d.role}</p>

        <AnimatePresence initial={false}>
          {hover && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="mt-8 max-w-md text-base leading-relaxed text-foreground/80">{d.bio}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="mt-6 text-[10.5px] uppercase tracking-[0.28em] text-muted-foreground transition-opacity duration-500"
          style={{ opacity: hover ? 0 : 1 }}
        >
          Hover to read
        </div>
      </div>
    </div>
  );
}

export function Doctors() {
  return (
    <section id="doctors" className="relative py-32 md:py-44 bg-fog/40">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-24 max-w-3xl">
          <p className="editorial-eyebrow mb-6">The Practitioners</p>
          <h2 className="editorial-display text-5xl md:text-7xl text-foreground">
            Two physicians.<br />
            <span className="text-muted-foreground">A shared philosophy.</span>
          </h2>
        </div>
        <div className="space-y-32">
          {doctors.map((d, i) => (
            <DoctorCard key={d.name} d={d} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
