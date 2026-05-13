export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] items-end">
          <div>
            <p className="editorial-eyebrow mb-4">Dr. Gopi&rsquo;s</p>
            <h3 className="editorial-display text-4xl md:text-5xl">
              Speciality Clinic
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><a href="#services" className="nav-link inline-block">Services</a></li>
            <li><a href="#doctors" className="nav-link inline-block">Doctors</a></li>
            <li><a href="#reviews" className="nav-link inline-block">Reviews</a></li>
            <li><a href="#appointment" className="nav-link inline-block">Appointment</a></li>
            <li><a href="#contact" className="nav-link inline-block">Contact</a></li>
          </ul>
          <div className="text-sm text-muted-foreground">
            <p>Venkata Ramana Colony</p>
            <p>Hyderabad, Telangana</p>
            <p className="mt-3">+91 90000 00000</p>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <p>&copy; {year} Dr. Gopi&rsquo;s Speciality Clinic</p>
          <p>Crafted with care</p>
        </div>
      </div>
    </footer>
  );
}
