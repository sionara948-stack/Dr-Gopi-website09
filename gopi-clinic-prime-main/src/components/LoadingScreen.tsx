import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <p className="editorial-eyebrow mb-6">Established with care</p>
            <h1 className="editorial-display text-3xl md:text-5xl text-foreground">
              Dr. Gopi&rsquo;s
            </h1>
            <h2 className="editorial-display text-2xl md:text-4xl text-muted-foreground mt-1">
              Speciality Clinic
            </h2>
          </motion.div>
          <div className="mt-10 h-12 w-px bg-border overflow-hidden">
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
              className="h-full w-px bg-foreground"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
