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
import { VIRAL } from "@/lib/viralContent";

export function ViralPage() {
  const d = VIRAL;

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

      <section className="bg-white pb-12 pt-6">
        <div className={`${CAUSA_WRAP} flex max-w-3xl flex-col gap-10`}>
          <div className="flex flex-col gap-4">
            <div className="animate-fade-up flex flex-col gap-3">
              <Chip label={d.badge} color="primary" />
              <h1 className="text-[34px] font-black leading-tight text-[#503C77] md:text-[40px] lg:text-[44px]">
                {d.title}
              </h1>
            </div>
            <p className="animate-fade-up animate-delay-1 text-[15px] font-normal leading-6 text-[#442748] lg:text-[16px] lg:leading-[26px]">
              <RichText text={d.intro} />
            </p>
          </div>

          <div id="que-es" className="animate-fade-up animate-delay-2 flex scroll-mt-20 flex-col gap-3">
            <div className="flex flex-col gap-2">
              <CausaEyebrow>CONOCÉ LA MENINGITIS VIRAL</CausaEyebrow>
              <CausaSectionTitle>{d.queEs.title}</CausaSectionTitle>
            </div>
            <p className="text-[16px] font-normal leading-[25px] text-[#442748]">
              <RichText text={d.queEs.body} />
            </p>
          </div>
        </div>
      </section>

      <RevealSection
        id="grupos-riesgo"
        className="scroll-mt-20 bg-white pb-16 pt-4"
        delay={80}
      >
        <div className={`${CAUSA_WRAP} flex max-w-3xl flex-col gap-8`}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <CausaEyebrow>¿A QUIÉNES AFECTA?</CausaEyebrow>
              <CausaSectionTitle>
                <RichText text={d.gruposRiesgo.title} />
              </CausaSectionTitle>
            </div>
            <p className="text-[16px] font-normal leading-[26px] text-[#442748]">
              <RichText
                text={d.gruposRiesgo.body}
                strongClassName="font-semibold text-[#442748]"
              />
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {d.gruposRiesgo.items.map((item) => (
              <div
                key={item.title}
                className="rounded-[14px] border border-[#e2e8f0] bg-transparent p-5"
              >
                <h3 className="text-[15px] font-bold leading-6 text-[#503C77]">
                  {item.title}
                </h3>
                {"bullets" in item ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] font-normal leading-5 text-[#442748]">
                    {item.bullets.map((b) => (
                      <li key={b.slice(0, 40)}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[13px] font-normal leading-5 text-[#442748]">
                    {item.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection
        id="tratamiento"
        className="scroll-mt-20 bg-white py-16"
        delay={100}
      >
        <div className={`${CAUSA_WRAP} flex max-w-3xl flex-col gap-4`}>
          <div className="flex flex-col gap-2">
            <CausaEyebrow>{d.tratamiento.eyebrow}</CausaEyebrow>
            <CausaSectionTitle>{d.tratamiento.title}</CausaSectionTitle>
          </div>
          <div className="flex flex-col gap-4 text-[16px] font-normal leading-[26px] text-[#442748]">
            {d.tratamiento.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>
                <RichText
                  text={p}
                  strongClassName="font-semibold text-[#442748]"
                />
              </p>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection
        id="prevencion"
        className="scroll-mt-20 bg-[#503c77] py-16"
        delay={80}
      >
        <CausaPrevencionCta {...d.prevencion} />
      </RevealSection>

      <CausaOtrasCausas items={d.otrasCausas} containerClassName="max-w-7xl" />
    </>
  );
}
