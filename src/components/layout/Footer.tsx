import Image from "next/image";
import Link from "next/link";
import { ReferencesAccordion } from "@/components/layout/ReferencesAccordion";

const legalLinks = [
  {
    href: "https://privacy.gsk.com/es-ar/privacy-notice/",
    label: "Política de cookies",
    external: true,
  },
  { href: "/terminos", label: "Términos y condiciones", external: false },
  {
    href: "https://privacy.gsk.com/es-ar/privacy-notice/general/general-full-text/",
    label: "Política de privacidad",
    external: true,
  },
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
            className="h-10 w-auto object-contain object-left md:h-11"
            priority={false}
          />
          <div className="mt-5 h-px w-full bg-white/30" />
          <nav className="mt-4 flex flex-nowrap items-center gap-x-4 overflow-x-auto text-[12px] whitespace-nowrap">
            {legalLinks.map((l) =>
              l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-normal text-white/75 underline-offset-2 hover:text-white hover:underline"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="shrink-0 font-normal text-white/75 underline-offset-2 hover:text-white hover:underline"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          <p className="mt-4 max-w-3xl text-[11px] leading-[1.45] text-white/75 md:text-[12px]">
            NP-AR-MNU-WCNT-260001 - Septiembre 2026.
            <br />
            Para mayor información consulte a su médico.
            <br />
            GSK Biopharma Argentina SA Av del Libertador 7202, Piso 4, CABA,
            Buenos Aires, Argentina.
            <br />
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
            <br />
            © 2026 GSK y sus afiliadas o licenciantes
          </p>
        </div>
      </footer>
    </>
  );
}
