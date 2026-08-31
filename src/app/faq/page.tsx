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

export const dynamic = "force-dynamic";

export default function FaqPage() {
  const items = readFaq().filter((f) => f.visible);

  return (
    <>
      <section className="bg-white px-5 pb-6 pt-16 md:px-8 md:pt-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-2xl">
            <h1 className="animate-fade-up text-[28px] font-[900] leading-normal text-[#503c77]">
              Todo lo que necesitas saber sobre las vacunas y la meningitis
            </h1>
            <p className="animate-fade-up animate-delay-1 mt-4 text-[16px] leading-[26px] text-[#442748]">
              Seleccioná una categoría para explorar las preguntas.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-10 md:px-8 md:pb-12">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal delay={80}>
            <div className="mx-auto max-w-2xl">
              <FaqAccordion items={items} />
            </div>
          </Reveal>
        </div>
      </section>

      <VacunasCtaSection />
    </>
  );
}
