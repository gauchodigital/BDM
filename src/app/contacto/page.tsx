import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_DISPLAY, WHATSAPP_URL, FOOTER_SOCIAL_LINKS } from "@/lib/siteLinks";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacto de BastaDeMeningitis.",
};

export default function ContactoPage() {
  return (
    <Section tone="white" className="!pt-12 md:!pt-16">
      <SectionHeading
        title="Contacto"
        subtitle="Escribinos por WhatsApp o seguinos en redes. Los links se configuran en src/lib/siteLinks.ts."
      />
      <div className="max-w-md space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            WhatsApp
          </p>
          <p className="mt-1 text-lg text-dark">{WHATSAPP_DISPLAY}</p>
          <Button href={WHATSAPP_URL} external variant="primary" className="mt-4">
            Abrir WhatsApp
          </Button>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            Redes
          </p>
          <ul className="mt-2 space-y-2">
            {FOOTER_SOCIAL_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
