import Image from "next/image";
import Link from "next/link";
import { ReferencesAccordion } from "@/components/layout/ReferencesAccordion";

const legalLinks = [
  { href: "/cookies", label: "Política de cookies" },
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/privacidad", label: "Política de privacidad" },
];

const PHONE = "0800-220-4752";
const EMAIL = "bua-farmacovigilancia-rx@gsk.com";

export function Footer() {
  return (
    <>
      <ReferencesAccordion />
      <footer className="bg-[#503C77] pb-[calc(3.85rem+env(safe-area-inset-bottom))] text-white md:pb-0">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12">
          <Image
            src="/brand/logo-gsk-footer.png"
            alt="GSK"
            width={120}
            height={48}
            className="h-10 w-auto object-contain object-left mix-blend-screen md:h-11"
            priority={false}
          />
          <div className="mt-5 h-px w-full bg-white/30" />
          <nav className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] font-normal text-white/75 underline-offset-2 hover:text-white hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 max-w-3xl space-y-3 text-[11px] leading-relaxed text-white/75 md:text-[12px] md:leading-relaxed">
            <p>NP-AR-MNU-WCNT-260001 - Agosto 2026.</p>
            <p>Para mayor información consulte a su médico.</p>
            <p>
              GSK Biopharma Argentina SA Av del Libertador 7202, Piso 4, CABA,
              Buenos Aires, Argentina.
            </p>
            <p>
              Para consultas sobre nuestros productos, consultas de calidad o
              reporte de eventos adversos puede comunicarse al{" "}
              <a
                href={`tel:${PHONE.replace(/-/g, "")}`}
                className="text-white underline underline-offset-2 hover:text-white/90"
              >
                {PHONE}
              </a>
              . Para reportar eventos adversos de nuestros productos envíe un
              correo a:{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="break-all text-white underline underline-offset-2 hover:text-white/90"
              >
                {EMAIL}
              </a>
            </p>
            <p>© 2026 GSK y sus afiliadas o licenciantes</p>
          </div>
        </div>
      </footer>
    </>
  );
}
