import type { Metadata } from "next";
import { CausaSpotlightCard } from "@/components/home/CausaSpotlightCard";
import { Reveal } from "@/components/ui/Reveal";
import { readCausas } from "@/lib/causasData";

export const metadata: Metadata = {
  title: "Causas",
  description:
    "Tipos de meningitis: bacteriana, viral, fúngica y parasitaria.",
};

export const dynamic = "force-dynamic";

export default function CausasPage() {
  const causas = readCausas().filter((c) => c.visible);

  return (
    <section className="section-pad scroll-mt-16 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F6FB_45%,#FFFFFF_100%)]">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            ¿Cómo se clasifica?
          </p>
          <h1 className="mt-3 max-w-3xl text-[28px] font-[900] leading-tight text-primary md:text-[2.5rem] lg:text-[48px] lg:leading-[1.08]">
            Causas de la meningitis
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.55] text-dark md:text-[16px] md:leading-[1.6]">
            La meningitis puede ser clasificada por su causa: bacteriana (la
            más grave), viral (la más común), por hongos o parásitos. Si bien
            hay tipos más frecuentes o más graves que otros,{" "}
            <strong className="font-semibold text-[#442748]">
              es imprescindible la visita a un médico
            </strong>{" "}
            para que pueda determinar la causa y el tratamiento
            correspondiente.
            <sup className="text-[0.7em] text-muted">3</sup>
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:gap-6 xl:grid-cols-4">
          {causas.map((causa, i) => (
            <Reveal key={causa.id} delay={i * 70} className="h-full">
              <CausaSpotlightCard
                causa={causa}
                ctaLabel="Aprender más"
                showExternalIcon
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
