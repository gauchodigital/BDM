import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { VacunasCtaSection } from "@/components/home/VacunasCtaSection";
import { Reveal } from "@/components/ui/Reveal";
import { readFaq } from "@/lib/faqData";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Todo lo que necesitás saber sobre la meningitis y las vacunas.",
};


export default function FaqPage() {
  const items = readFaq().filter((f) => f.visible);

  return (
    <>
      <section className="section-pad scroll-mt-16 bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF9FC_50%,#FFFFFF_100%)]">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <Reveal delay={80}>
            <FaqAccordion items={items} showHeader />
          </Reveal>
        </div>
      </section>

      <VacunasCtaSection />
    </>
  );
}
