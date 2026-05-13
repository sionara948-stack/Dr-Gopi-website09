import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getBookedSlots, requestAppointment } from "@/lib/api";

const PERIODS = [
  { label: "Morning", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"] },
  { label: "Afternoon", slots: ["14:00", "14:30", "15:00", "15:30", "16:00"] },
  { label: "Evening", slots: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"] },
];

function fmtIST(d: Date) {
  const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" };
  const parts = new Intl.DateTimeFormat("en-CA", opts).formatToParts(d);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${day}`;
}

function buildDates(count = 30) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

export function Appointment() {
  const dates = useMemo(() => buildDates(30), []);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState<string[]>([]);
  const [popup, setPopup] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const selectedDate = dates[selectedIdx];
  const dateStr = fmtIST(selectedDate);

  useEffect(() => {
    setSelectedSlot(null);
    getBookedSlots(dateStr).then(setBooked);
  }, [dateStr]);

  // Center selected date
  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLButtonElement>(`[data-idx='${selectedIdx}']`);
    if (el && stripRef.current) {
      const left = el.offsetLeft - stripRef.current.clientWidth / 2 + el.clientWidth / 2;
      stripRef.current.scrollTo({ left, behavior: "smooth" });
    }
  }, [selectedIdx]);

  // Drag scroll
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0;
    const md = (e: MouseEvent) => { down = true; startX = e.pageX; startLeft = el.scrollLeft; };
    const mm = (e: MouseEvent) => { if (!down) return; el.scrollLeft = startLeft - (e.pageX - startX); };
    const mu = () => { down = false; };
    el.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    return () => { el.removeEventListener("mousedown", md); window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
  }, []);

  const submit = async () => {
    setError(null);
    if (!name.trim() || name.trim().length < 2) { setError("Please enter your full name."); return; }
    if (!/^[+]?[0-9\s-]{10,15}$/.test(phone.trim())) { setError("Please enter a valid phone number."); return; }
    if (!selectedSlot) { setError("Please choose a time slot."); return; }
    setSubmitting(true);
    try {
      await requestAppointment({ name: name.trim(), phone: phone.trim(), date: dateStr, slot: selectedSlot });
      setDone(true);
      setBooked((b) => [...b, selectedSlot]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setPopup(false);
    setTimeout(() => { setName(""); setPhone(""); setError(null); setDone(false); }, 300);
  };

  return (
    <section id="appointment" className="relative py-32 md:py-44 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-20 max-w-3xl">
          <p className="editorial-eyebrow mb-6">Request a consultation</p>
          <h2 className="editorial-display text-5xl md:text-7xl text-foreground">
            Choose a date,<br />
            <span className="text-muted-foreground">a quiet hour.</span>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            All times shown in IST (Asia/Kolkata). Requests are reviewed and our reception team confirms within working hours.
          </p>
        </div>

        {/* Date strip */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div
            ref={stripRef}
            className="flex gap-3 overflow-x-auto scroll-smooth py-6 [&::-webkit-scrollbar]:hidden select-none"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="shrink-0 w-[40vw]" />
            {dates.map((d, i) => {
              const active = i === selectedIdx;
              return (
                <button
                  key={i}
                  data-idx={i}
                  onClick={() => setSelectedIdx(i)}
                  className={`shrink-0 w-24 md:w-28 py-5 border transition-all duration-500 ${
                    active
                      ? "bg-foreground text-background border-foreground scale-110"
                      : "bg-transparent border-border text-foreground/60 hover:border-foreground/60 hover:text-foreground"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-[0.2em]">
                    {d.toLocaleDateString("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" })}
                  </div>
                  <div className="font-serif text-3xl mt-2">
                    {d.toLocaleDateString("en-IN", { day: "2-digit", timeZone: "Asia/Kolkata" })}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] mt-1 opacity-70">
                    {d.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })}
                  </div>
                </button>
              );
            })}
            <div className="shrink-0 w-[40vw]" />
          </div>
        </div>

        {/* Slots */}
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {PERIODS.map((p) => (
            <div key={p.label}>
              <h4 className="editorial-eyebrow mb-6">{p.label}</h4>
              <div className="flex flex-wrap gap-2">
                {p.slots.map((s) => {
                  const taken = booked.includes(s);
                  const active = selectedSlot === s;
                  return (
                    <button
                      key={s}
                      disabled={taken}
                      onClick={() => setSelectedSlot(s)}
                      className={`px-4 py-3 text-sm font-sans tracking-wide border transition-all duration-300 ${
                        taken
                          ? "line-through text-muted-foreground/40 border-border/60 cursor-not-allowed"
                          : active
                          ? "bg-foreground text-background border-foreground"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6">
          <button
            disabled={!selectedSlot}
            onClick={() => setPopup(true)}
            className="btn-editorial btn-editorial-filled disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Request {selectedSlot ?? "a slot"}
          </button>
          {selectedSlot && (
            <p className="text-sm text-muted-foreground">
              {selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" })} &middot; {selectedSlot} IST
            </p>
          )}
        </div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "oklch(0.18 0.005 270 / 0.4)", backdropFilter: "blur(16px)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-md rounded-2xl p-10 shadow-float"
            >
              {!done ? (
                <>
                  <p className="editorial-eyebrow mb-4">Confirm details</p>
                  <h3 className="editorial-display text-3xl">Your appointment request</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} &middot; {selectedSlot} IST
                  </p>
                  <div className="mt-8 space-y-5">
                    <label className="block">
                      <span className="editorial-eyebrow text-[10px]">Full name</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 w-full bg-transparent border-b border-border py-2 font-serif text-xl focus:border-foreground outline-none transition-colors"
                      />
                    </label>
                    <label className="block">
                      <span className="editorial-eyebrow text-[10px]">Mobile number</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                        placeholder="+91 ..."
                        className="mt-2 w-full bg-transparent border-b border-border py-2 font-serif text-xl focus:border-foreground outline-none transition-colors"
                      />
                    </label>
                  </div>
                  {error && <p className="mt-4 text-xs text-destructive">{error}</p>}
                  <div className="mt-10 flex items-center justify-between">
                    <button onClick={close} className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground">
                      Cancel
                    </button>
                    <button onClick={submit} disabled={submitting} className="btn-editorial btn-editorial-filled">
                      {submitting ? "Sending..." : "Submit request"}
                    </button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <p className="editorial-eyebrow mb-6">Received</p>
                  <h3 className="editorial-display text-3xl leading-tight text-foreground">
                    Appointment request<br />
                    <span className="text-muted-foreground">received.</span>
                  </h3>
                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                    Our reception team will contact you shortly to confirm your visit.
                  </p>
                  <button onClick={close} className="mt-8 btn-editorial">Close</button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
