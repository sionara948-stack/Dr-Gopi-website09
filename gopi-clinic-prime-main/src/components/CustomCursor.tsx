import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const aura = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }
      const el = e.target as HTMLElement;
      const interactive = el.closest("a, button, [role='button'], input, textarea, label, [data-cursor='hover']");
      setHover(!!interactive);
    };
    window.addEventListener("mousemove", move);

    let raf = 0;
    const tick = () => {
      aura.current.x += (target.current.x - aura.current.x) * 0.15;
      aura.current.y += (target.current.y - aura.current.y) * 0.15;
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${aura.current.x - 18}px, ${aura.current.y - 18}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={auraRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.18 0.005 270 / 0.08) 0%, transparent 70%)",
          border: "1px solid oklch(0.18 0.005 270 / 0.25)",
          transition: "width 0.4s cubic-bezier(.22,1,.36,1), height 0.4s, opacity 0.3s, background 0.4s",
          opacity: hover ? 1 : 0.7,
          ...(hover && { width: 56, height: 56, background: "radial-gradient(circle, oklch(0.18 0.005 270 / 0.12) 0%, transparent 75%)" }),
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--foreground)",
        }}
      />
    </>
  );
}
