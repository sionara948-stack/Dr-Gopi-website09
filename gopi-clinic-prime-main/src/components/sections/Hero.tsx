import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/hero-clinic.jpg";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <motion.section
      id="top"
      ref={ref}
      style={{ scale, opacity }}
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden pt-36"
    >
      {/* Soft fog wash */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-background via-background/0 to-background" />
      <div className="pointer-events-none absolute inset-0 z-10" style={{ background: "radial-gradient(60% 50% at 50% 30%, transparent 0%, oklch(0.985 0.003 80 / 0.55) 100%)" }} />

      <motion.div
        style={{ y: imgY }}
        className="absolute right-0 top-[18%] hidden md:block w-[42%] h-[60%] overflow-hidden"
      >
        <img
          src={heroImg}
          alt="Calm interior of Dr. Gopi's Speciality Clinic"
          className="h-full w-full object-cover grayscale-[20%] opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/20 to-background" />
      </motion.div>

      <motion.div style={{ y }} className="container relative z-20 mx-auto px-6 md:px-12 pb-24 md:pb-36">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="editorial-eyebrow mb-10"
        >
          Hyderabad &middot; Venkata Ramana Colony
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.05, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="editorial-display text-[13vw] md:text-[9.5vw] leading-[0.95] max-w-5xl text-foreground"
        >
          Considered<br />
          medicine,<br />
          <span className="text-muted-foreground">quietly practiced.</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          className="mt-14 grid gap-12 md:grid-cols-[1fr_auto] md:items-end"
        >
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            A speciality clinic dedicated to attentive, unhurried care &mdash; where each
            consultation is a conversation, and every patient is known by name.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#appointment" className="btn-editorial btn-editorial-filled">Book Appointment</a>
            <a href="#services" className="btn-editorial">Explore Services</a>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
