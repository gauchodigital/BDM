import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import { CausaOtrasCausas } from "@/components/causas/CausaOtrasCausas";
import { RevealSection } from "@/components/ui/RevealSection";
import {
  CAUSA_PANEL,
  CAUSA_WRAP,
  CausaEyebrow,
  CausaPrevencionCta,
  CausaSectionTitle,
  CausaSintomasPanel,
  CausaTocNav,
  CausaUrgencyBar,
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
            className="font-medium text-[#503c77] underline underline-offset-2 hover:opacity-90"
          >
            Causas
          </Link>
          <span className="text-[#94a3b8]">/</span>
          <span className="font-medium text-[#442748]">{d.breadcrumb}</span>
        </div>
      </nav>

      <section className="bg-white pb-10 pt-6">
        <div
          className={`${CAUSA_WRAP} flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12`}
        >
          <div className="flex flex-col gap-6">
            <div className="animate-fade-up flex flex-col gap-3">
              <Chip label={d.badge} color={d.badgeColor} />
              <h1 className="text-[34px] font-black leading-tight text-[#503c77] md:text-[40px] lg:text-[44px]">
                {d.title}
              </h1>
            </div>
            <p className="animate-fade-up animate-delay-1 text-[15px] leading-6 text-[#442748] lg:text-[16px] lg:leading-[26px]">
              <RichText text={d.intro} />
            </p>
          </div>

          <aside className="animate-fade-up animate-delay-2 flex flex-col gap-2 lg:sticky lg:top-24">
            <CausaEyebrow>EN ESTA PÁGINA</CausaEyebrow>
            <CausaTocNav items={d.toc} />
          </aside>
        </div>
      </section>

      <RevealSection className="scroll-mt-20 bg-white pb-16" delay={80}>
        <div className={`${CAUSA_WRAP} grid gap-8 lg:grid-cols-2 lg:gap-10`}>
          <div id="que-es" className={`${CAUSA_PANEL} flex flex-col gap-4`}>
            <div className="flex flex-col gap-2">
              <CausaEyebrow>{d.queEs.eyebrow}</CausaEyebrow>
              <CausaSectionTitle>{d.queEs.title}</CausaSectionTitle>
            </div>
            <div className="flex flex-col gap-4 text-[16px] leading-[25px] text-[#442748]">
              {d.queEs.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>
                  <RichText text={p} />
                </p>
              ))}
            </div>
          </div>
          <CausaSintomasPanel />
        </div>
      </RevealSection>

      <RevealSection className="bg-[#503c77]" delay={150}>
        <CausaUrgencyBar />
      </RevealSection>

      <RevealSection
        id="tratamiento"
        className="scroll-mt-20 bg-white py-16"
        delay={100}
      >
        <div className={`${CAUSA_WRAP} max-w-3xl flex flex-col gap-4`}>
          <div className="flex flex-col gap-2">
            <CausaEyebrow>{d.tratamiento.eyebrow}</CausaEyebrow>
            <CausaSectionTitle>{d.tratamiento.title}</CausaSectionTitle>
          </div>
          <div className="flex flex-col gap-4 text-[16px] leading-[26px] text-[#442748]">
            {d.tratamiento.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection
        id="prevencion"
        className="scroll-mt-20 bg-[#503c77] py-16"
        delay={150}
      >
        <CausaPrevencionCta {...d.prevencion} />
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
