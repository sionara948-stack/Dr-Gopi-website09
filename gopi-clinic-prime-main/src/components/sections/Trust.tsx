import { motion } from "framer-motion";

const items = [
  { k: "12+", v: "Years of practice" },
  { k: "8,500+", v: "Patients cared for" },
  { k: "10", v: "Clinical specialities" },
  { k: "4.9", v: "Patient rating" },
];

export function Trust() {
  return (
    <section className="relative border-y border-border py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-12">
        <p className="editorial-eyebrow mb-12 text-center">A quiet record of trust</p>
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.v}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="editorial-display text-5xl md:text-6xl text-foreground">{it.k}</div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{it.v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
