import Link from "next/link";
import { AdminNav } from "./AdminNav";
import { readCausas } from "@/lib/causasData";
import { readSintomas } from "@/lib/sintomasData";
import { readFaq } from "@/lib/faqData";
import { readTestimonios } from "@/lib/testimoniosData";
import { readGlosario } from "@/lib/glosarioData";

export const dynamic = "force-dynamic";

const cards = [
  { href: "/admin/causas", label: "Causas", countKey: "causas" as const },
  { href: "/admin/sintomas", label: "Síntomas", countKey: "sintomas" as const },
  { href: "/admin/faq", label: "FAQ", countKey: "faq" as const },
  {
    href: "/admin/testimonios",
    label: "Testimonios",
    countKey: "testimonios" as const,
  },
  { href: "/admin/glosario", label: "Glosario", countKey: "glosario" as const },
];

export default function AdminHomePage() {
  const counts = {
    causas: readCausas().length,
    sintomas: readSintomas().length,
    faq: readFaq().length,
    testimonios: readTestimonios().length,
    glosario: readGlosario().length,
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <AdminNav />
      <h2 className="text-lg font-bold text-white">Contenido editable</h2>
      <p className="mt-1 text-sm text-white/40">
        Los cambios se guardan en JSON en la raíz del repo y se reflejan en el
        sitio público tras revalidar.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-5 transition hover:border-primary/40 hover:bg-white/[0.06]"
          >
            <p className="text-sm font-semibold text-white">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {counts[c.countKey]}
            </p>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-xs text-white/30">
        Links globales (WhatsApp, redes, vacunación):{" "}
        <code className="text-white/50">src/lib/siteLinks.ts</code>
      </p>
    </div>
  );
}
