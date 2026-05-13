import { useEffect, useState } from "react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Doctors", href: "#doctors" },
  { label: "Reviews", href: "#reviews" },
  { label: "Appointment", href: "#appointment" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-1/2 z-40 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
        scrolled ? "top-4 w-[min(1000px,93vw)]" : "top-7 w-[min(1160px,95vw)]"
      }`}
    >
      <nav className="navbar-shell flex items-center justify-between rounded-full pl-5 pr-3 py-2.5">
        <a href="#top" className="flex items-center gap-3.5 group">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-foreground/40 bg-background/40 transition-colors group-hover:border-foreground">
            <span className="font-serif text-lg leading-none -mt-0.5">G</span>
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-[9px] tracking-[0.32em] text-muted-foreground uppercase">Dr. Gopi&rsquo;s</span>
            <span className="font-serif text-[15px] tracking-wide mt-1">Speciality Clinic</span>
          </div>
        </a>
        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="nav-link text-[10.5px] uppercase tracking-[0.28em] text-foreground/75 hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#appointment" className="btn-pill">
          <span>Book</span>
          <span className="btn-pill-arrow">&rarr;</span>
        </a>
      </nav>
    </header>
  );
}
