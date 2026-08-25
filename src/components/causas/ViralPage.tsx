import type { ReactNode } from "react";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import { CausaOtrasCausas } from "@/components/causas/CausaOtrasCausas";
import { VIRAL } from "@/lib/viralContent";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-extrabold uppercase leading-[16.8px] tracking-[1.3px] text-[#dd876e]">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[28px] font-black leading-8 text-[#503c77]">
      {children}
    </h2>
  );
}

export function ViralPage() {
  const d = VIRAL;

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#e2e8f0] bg-white px-5 py-3 md:px-8"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2 text-[13px]">
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

      {/* Hero */}
      <section className="bg-white px-5 pb-6 pt-6 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Chip label={d.badge} color="primary" />
            <h1 className="text-[32px] font-black leading-normal text-[#503c77]">
              {d.title}
            </h1>
          </div>
          <p className="text-[15px] leading-6 text-[#442748]">
            <RichText text={d.intro} />
          </p>
        </div>
      </section>

      {/* Síntomas chips */}
      <section className="bg-white px-5 pb-10 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <h2 className="text-[18px] font-bold leading-6 text-[#503c77]">
            {d.sintomasTitle}
          </h2>
          <div className="flex flex-wrap gap-2">
            {d.sintomasChips.map((chip) => (
              <span
                key={chip}
                className="rounded-[20px] border border-[#a6c0d6] bg-[rgba(166,192,214,0.25)] px-3.5 py-1.5 text-[13px] font-medium text-[#442748]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Qué es? */}
      <section className="scroll-mt-20 bg-white px-5 pb-16 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Eyebrow>{d.queEs.eyebrow}</Eyebrow>
            <SectionTitle>{d.queEs.title}</SectionTitle>
          </div>
          <p className="text-[16px] leading-[25px] text-[#442748]">
            <RichText text={d.queEs.body} />
          </p>
        </div>
      </section>

      {/* Grupos de riesgo */}
      <section className="scroll-mt-20 bg-white px-5 pb-16 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.gruposRiesgo.eyebrow}</Eyebrow>
              <SectionTitle>
                <RichText text={d.gruposRiesgo.title} />
              </SectionTitle>
            </div>
            <p className="text-[16px] leading-[26px] text-[#442748]">
              <RichText text={d.gruposRiesgo.body} />
            </p>
          </div>
          {d.gruposRiesgo.items.map((item) => (
            <div
              key={item.title}
              className="rounded-[12px] border border-[#a6c0d6] bg-white p-4"
            >
              <h3 className="text-[15px] font-bold leading-6 text-[#503c77]">
                {item.title}
              </h3>
              {"bullets" in item ? (
                <ul className="mt-1 list-disc space-y-1 pl-5 text-[13px] leading-5 text-[#442748]">
                  {item.bullets.map((b) => (
                    <li key={b.slice(0, 40)}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-[13px] leading-5 text-[#442748]">
                  {item.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tratamiento */}
      <section className="scroll-mt-20 bg-white px-5 pb-16 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Eyebrow>{d.tratamiento.eyebrow}</Eyebrow>
            <SectionTitle>{d.tratamiento.title}</SectionTitle>
          </div>
          <div className="flex flex-col gap-1 text-[16px] leading-[26px] text-[#442748]">
            {d.tratamiento.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Prevención CTA */}
      <section className="bg-[#503c77] px-5 py-16 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.prevencion.eyebrow}</Eyebrow>
              <h2 className="text-[22px] font-bold leading-7 text-white">
                {d.prevencion.title}
              </h2>
            </div>
            <p className="text-[14px] leading-[19.6px] text-white/90">
              <RichText text={d.prevencion.body} />
            </p>
          </div>
          <Link
            href={d.prevencion.ctaHref}
            className="flex h-[52px] items-center justify-center gap-2 rounded-[12px] bg-white px-4 text-[15px] font-bold text-[#503c77] transition hover:bg-white/95"
          >
            {d.prevencion.ctaLabel}
            <span
              aria-hidden
              className="block size-3 shrink-0"
              style={{
                backgroundColor: "#503c77",
                WebkitMaskImage: "url(/icons/arrow-right.svg)",
                maskImage: "url(/icons/arrow-right.svg)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </Link>
        </div>
      </section>

      <CausaOtrasCausas items={d.otrasCausas} />
    </>
  );
}
