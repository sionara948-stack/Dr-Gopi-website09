import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState(false);
  const dragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setFromY = (clientY: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const h = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: p * h, behavior: dragging.current ? "auto" : "smooth" });
  };

  const onDown = (e: React.MouseEvent) => {
    dragging.current = true;
    setFromY(e.clientY);
    const move = (ev: MouseEvent) => setFromY(ev.clientY);
    const up = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    document.body.style.cursor = "grabbing";
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div className="fixed right-7 top-1/2 z-50 hidden -translate-y-1/2 md:block">
      <div
        ref={trackRef}
        onMouseDown={onDown}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative h-72 w-4 flex justify-center"
        style={{ cursor: "grab" }}
        data-cursor="hover"
      >
        <div className="absolute top-0 bottom-0 w-px bg-foreground/15" />
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-[top] duration-200"
          style={{
            top: `calc(${progress * 100}% - 6px)`,
            transitionDuration: dragging.current ? "0ms" : "200ms",
          }}
        >
          <div
            className="rounded-full bg-foreground"
            style={{
              width: hover ? 12 : 9,
              height: hover ? 12 : 9,
              boxShadow: hover
                ? "0 0 0 4px oklch(0.18 0.005 270 / 0.08), 0 0 18px oklch(0.18 0.005 270 / 0.35)"
                : "0 0 0 2px oklch(0.18 0.005 270 / 0.06), 0 0 10px oklch(0.18 0.005 270 / 0.25)",
              transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
