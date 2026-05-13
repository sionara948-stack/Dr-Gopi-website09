import mapImg from "@/assets/map-mono.jpg";

export function Contact() {
  const items = [
    { k: "Phone", v: "+91 90000 00000" },
    { k: "Email", v: "care@drgopisclinic.in" },
    { k: "WhatsApp", v: "+91 90000 00000" },
    { k: "Hours", v: "Mon \u2013 Sat \u00b7 09:00 \u2013 20:00 IST" },
  ];

  return (
    <section id="contact" className="relative py-32 md:py-44 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-20 max-w-3xl">
          <p className="editorial-eyebrow mb-6">Visit the clinic</p>
          <h2 className="editorial-display text-5xl md:text-7xl text-foreground">
            Venkata Ramana Colony,<br />
            <span className="text-muted-foreground">Hyderabad.</span>
          </h2>
        </div>

        <div className="grid gap-16 md:grid-cols-[1fr_1.3fr]">
          <dl className="space-y-10">
            <div>
              <dt className="editorial-eyebrow mb-3">Address</dt>
              <dd className="font-serif text-2xl leading-snug">
                Dr. Gopi&rsquo;s Speciality Clinic<br />
                Venkata Ramana Colony<br />
                Hyderabad, Telangana
              </dd>
            </div>
            {items.map((i) => (
              <div key={i.k}>
                <dt className="editorial-eyebrow mb-2">{i.k}</dt>
                <dd className="font-serif text-xl">{i.v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <a
              href="https://www.google.com/maps/search/Venkata+Ramana+Colony+Hyderabad"
              target="_blank"
              rel="noreferrer"
              className="block group relative overflow-hidden border border-border"
            >
              <img src={mapImg} alt="Map preview of clinic location" className="w-full h-[420px] object-cover grayscale transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between glass-panel rounded-full px-5 py-3">
                <span className="text-xs uppercase tracking-[0.22em]">View on Google Maps</span>
                <span className="font-serif text-lg">&nearr;</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
