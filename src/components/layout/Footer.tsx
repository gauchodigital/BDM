import Link from "next/link";
import { ReferencesAccordion } from "@/components/layout/ReferencesAccordion";

const legalLinks = [
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
];

export function Footer() {
  return (
    <>
      <ReferencesAccordion />
      <footer className="bg-[#503C77] pb-[calc(3.85rem+env(safe-area-inset-bottom))] text-white md:pb-0">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-12">
          <p className="text-[28px] font-extrabold tracking-tight text-white">
            GSK
          </p>
          <div className="mt-5 h-px w-full bg-white/30" />
          <nav className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] font-normal uppercase tracking-[0.06em] text-white hover:text-white/80"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-white/80">
            © {new Date().getFullYear()} GSK group of companies o su
            licenciante. Todos los derechos reservados. Este sitio es solo para
            residentes de Argentina. PM-AR-SGM-WCNT-230001
          </p>
        </div>
      </footer>
    </>
  );
}
