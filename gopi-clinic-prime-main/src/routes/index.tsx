import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { Trust } from "@/components/sections/Trust";
import { Services } from "@/components/sections/Services";
import { Doctors } from "@/components/sections/Doctors";
import { Reviews } from "@/components/sections/Reviews";
import { Appointment } from "@/components/sections/Appointment";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Gopi's Speciality Clinic — Considered Medicine, Hyderabad" },
      {
        name: "description",
        content:
          "Dr. Gopi's Speciality Clinic in Venkata Ramana Colony, Hyderabad. Unhurried general medicine, diabetology, women's health, and preventive care. Book a consultation.",
      },
      { name: "keywords", content: "Dr Gopi clinic, Hyderabad doctor, diabetology, internal medicine, Venkata Ramana Colony, speciality clinic" },
      { property: "og:title", content: "Dr. Gopi's Speciality Clinic" },
      { property: "og:description", content: "Considered medicine, quietly practiced — Hyderabad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dr. Gopi's Speciality Clinic" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <Trust />
      <Services />
      <Doctors />
      <Reviews />
      <Appointment />
      <Contact />
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalClinic",
            name: "Dr. Gopi's Speciality Clinic",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Venkata Ramana Colony",
              addressLocality: "Hyderabad",
              addressRegion: "Telangana",
              addressCountry: "IN",
            },
            telephone: "+91-90000-00000",
            openingHours: "Mo-Sa 09:00-20:00",
            medicalSpecialty: [
              "InternalMedicine", "Diabetology", "PreventiveMedicine",
              "WomensHealth", "Endocrine", "Geriatric",
            ],
          }),
        }}
      />
    </main>
  );
}
