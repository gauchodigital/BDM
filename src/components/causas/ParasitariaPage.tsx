import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import { CausaOtrasCausas } from "@/components/causas/CausaOtrasCausas";
import { RevealSection } from "@/components/ui/RevealSection";
import {
  CAUSA_WRAP,
  CausaEyebrow,
  CausaPrevencionCta,
  CausaSectionTitle,
} from "@/components/causas/causaPageShared";
import { PARASITARIA } from "@/lib/parasitariaContent";

export function ParasitariaPage() {
  const d = PARASITARIA;

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-[#e2e8f0] bg-white py-3">
        <div className={`${CAUSA_WRAP} flex items-center gap-2 text-[13px]`}>
          <Link
            href="/causas"
            className="font-medium text-[#503C77] underline underline-offset-2 hover:opacity-90"
          >
            Causas
          </Link>
          <span className="text-[#94a3b8]">/</span>
          <span className="font-medium text-[#442748]">{d.breadcrumb}</span>
        </div>
      </nav>

      <section className="bg-white pb-6 pt-6">
        <div className={`${CAUSA_WRAP} flex max-w-3xl flex-col gap-10`}>
          <div className="flex flex-col gap-4">
            <div className="animate-fade-up flex flex-col gap-3">
              <Chip label={d.badge} color={d.badgeColor} />
              <h1 className="text-[34px] font-black leading-tight text-[#503C77] md:text-[40px] lg:text-[44px]">
                {d.title}
              </h1>
            </div>
            <p className="animate-fade-up animate-delay-1 text-[15px] font-normal leading-6 text-[#442748] lg:text-[16px] lg:leading-[26px]">
              <RichText
                text={d.intro}
                strongClassName="font-semibold text-[#442748]"
                citeClassName="ml-0.5 text-[0.65em] font-[inherit] leading-none text-[#503C77]"
              />
            </p>
          </div>

          <div id="que-es" className="animate-fade-up animate-delay-2 flex scroll-mt-20 flex-col gap-3">
            <div className="flex flex-col gap-2">
              <CausaEyebrow>{d.queEs.eyebrow}</CausaEyebrow>
              <CausaSectionTitle tone="primary">{d.queEs.title}</CausaSectionTitle>
            </div>
            <div className="flex flex-col gap-4 text-[16px] font-normal leading-[25px] text-[#442748]">
              {d.queEs.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>
                  <RichText
                    text={p}
                    strongClassName="font-semibold text-[#442748]"
                    citeClassName="ml-0.5 text-[0.65em] font-[inherit] leading-none text-[#503C77]"
                  />
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RevealSection
        id="tratamiento"
        className="scroll-mt-20 bg-white pt-8 pb-12"
        delay={100}
      >
        <div className={`${CAUSA_WRAP} flex max-w-3xl flex-col gap-4`}>
          <div className="flex flex-col gap-2">
            <CausaEyebrow>{d.tratamiento.eyebrow}</CausaEyebrow>
            <CausaSectionTitle tone="primary">{d.tratamiento.title}</CausaSectionTitle>
          </div>
          <div className="flex flex-col gap-4 text-[16px] leading-[26px] text-[#442748]">
            {d.tratamiento.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>
                <RichText
                  text={p}
                  strongClassName="font-semibold text-[#442748]"
                  citeClassName="ml-0.5 text-[0.65em] font-[inherit] leading-none text-[#503C77]"
                />
              </p>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection
        id="prevencion"
        className="scroll-mt-20 bg-[#503C77] py-16"
        delay={150}
      >
        <CausaPrevencionCta {...d.prevencion} tone="primary" />
      </RevealSection>

      <CausaOtrasCausas
        items={d.otrasCausas}
        eyebrow={d.otrasCausasEyebrow}
        eyebrowClassName="text-[#94a3b8]"
        containerClassName="max-w-7xl"
      />
    </>
  );
}
