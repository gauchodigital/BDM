import type { ReactNode } from "react";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import { CausaOtrasCausas } from "@/components/causas/CausaOtrasCausas";
import { CasosChart } from "@/components/causas/CasosChart";
import { SerogruposBadges } from "@/components/causas/SerogruposBadges";
import { BACTERIANA } from "@/lib/bacterianaContent";

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

function PersonStat({
  ratio,
  label,
  total,
  active,
  activeIcon,
  inactiveIcon,
  tone = "light",
}: {
  ratio: string;
  label: string;
  total: number;
  active: number;
  activeIcon: string;
  inactiveIcon: string;
  tone?: "light" | "dark" | "plain";
}) {
  const dark = tone === "dark";
  const plain = tone === "plain";
  return (
    <div
      className={`flex flex-col items-center gap-2 overflow-hidden px-5 py-6 ${
        dark
          ? "rounded-2xl bg-[#503c77]"
          : plain
            ? "bg-transparent"
            : "rounded-2xl bg-[#e9eff5]"
      }`}
    >
      <div className="flex items-end justify-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={i < active ? activeIcon : inactiveIcon}
            alt=""
            width={28}
            height={plain ? 30 : 28}
            className={plain ? "h-[30px] w-7 shrink-0" : "size-7 shrink-0"}
          />
        ))}
      </div>
      <div className="w-full text-center">
        <p
          className={`text-[22px] font-black ${
            dark ? "text-white" : "text-[#503c77]"
          }`}
        >
          {ratio}
        </p>
        <p
          className={`mt-1 text-[13px] font-normal leading-5 ${
            dark ? "text-white/80" : plain ? "text-[#6D6AAE]" : "text-[#442748]"
          }`}
        >
          <RichText text={label} />
        </p>
      </div>
    </div>
  );
}

export function BacterianaPage() {
  const d = BACTERIANA;

  return (
    <>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#e2e8f0] bg-white px-5 py-3 md:px-8"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2 text-[13px]">
          <Link href="/causas" className="font-medium text-[#503c77] hover:underline">
            Causas
          </Link>
          <span className="text-[#94a3b8]">/</span>
          <span className="font-medium text-[#442748]">{d.breadcrumb}</span>
        </div>
      </nav>

      {/* Hero + TOC */}
      <section className="bg-white px-5 pb-10 pt-6 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="animate-fade-up flex flex-col gap-3">
            <Chip label={d.badge} color="accent" />
            <h1 className="text-[34px] font-black leading-tight text-[#503c77] md:text-[40px]">
              {d.title}
            </h1>
          </div>
          <div className="animate-fade-up animate-delay-1 flex flex-col gap-1 text-[16px] leading-[26px] text-[#442748]">
            {d.intro.map((p) => (
              <p key={p.slice(0, 48)}>
                <RichText text={p} />
              </p>
            ))}
          </div>

          <div className="animate-fade-up animate-delay-2 flex flex-col gap-2">
            <Eyebrow>EN ESTA PÁGINA</Eyebrow>
            <nav className="flex flex-col gap-2 rounded-lg bg-[#e9eff5] px-5 py-4 text-[13px] leading-5 text-[#503c77]">
              {d.toc.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <a
                    href={`#${item.id}`}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span
                      className="material-symbols-outlined shrink-0 text-[9px] leading-none no-underline"
                      aria-hidden
                    >
                      arrow_forward
                    </span>
                    <span className="underline underline-offset-2">
                      {item.label}
                    </span>
                  </a>
                  {"children" in item && item.children ? (
                    <div className="ml-4 flex flex-col gap-2">
                      {item.children.map((child) => (
                        <a
                          key={`${item.id}-${child.id}-${child.label}`}
                          href={`#${child.id}`}
                          className="inline-flex items-center gap-1.5"
                        >
                          <span
                            className="material-symbols-outlined shrink-0 text-[9px] leading-none no-underline"
                            aria-hidden
                          >
                            arrow_forward
                          </span>
                          <span className="underline underline-offset-2">
                            {child.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* ¿Qué es? */}
      <section id="que-es" className="scroll-mt-20 bg-white px-5 pb-10 md:px-8">
        <Reveal delay={80}>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Eyebrow>{d.queEs.eyebrow}</Eyebrow>
            <SectionTitle>{d.queEs.title}</SectionTitle>
          </div>
          <div className="text-[16px] leading-[25px] text-[#442748]">
            {d.queEs.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>
                <RichText text={p} />
              </p>
            ))}
            <p className="mt-1">
              <RichText text={d.queEs.bacteriaIntro} />
            </p>
            <ul className="mt-4 list-disc space-y-0 pl-6">
              {d.queEs.bacterias.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <PersonStat {...d.queEs.stat} />
        </div>
        </Reveal>
      </section>

      {/* Síntomas */}
      <section
        id="sintomas"
        className="scroll-mt-20 bg-white px-5 py-12 md:px-8 md:py-16"
      >
        <Reveal delay={100}>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Eyebrow>{d.sintomas.eyebrow}</Eyebrow>
            <SectionTitle>{d.sintomas.title}</SectionTitle>
          </div>
          <div className="text-[16px] leading-[26px] text-[#442748]">
            <p>
              <RichText text={d.sintomas.body} />
            </p>
            <ul className="mt-4 list-disc space-y-0 pl-6">
              {d.sintomas.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        </Reveal>
      </section>

      {/* Urgency bar */}
      <section className="bg-[#503c77]">
        <Reveal delay={150}>
        <div className="mx-auto flex max-w-7xl border-l-4 border-[#DD876E] px-4 py-16 md:px-8">
          <p className="max-w-2xl text-[20px] font-medium leading-snug text-white">
            La meningitis es una{" "}
            <strong className="font-bold text-[#DD876E]">urgencia médica</strong>{" "}
            y{" "}
            <strong className="font-bold text-white">
              requiere consulta y hospitalización
            </strong>{" "}
            inmediata
            <sup className="ml-0.5 text-[0.65em] font-semibold leading-none text-white">
              1
            </sup>
            .
          </p>
        </div>
        </Reveal>
      </section>

      {/* Grupos de riesgo */}
      <section
        id="grupos-riesgo"
        className="scroll-mt-20 bg-white px-5 py-16 md:px-8"
      >
        <Reveal delay={80}>
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.gruposRiesgo.eyebrow}</Eyebrow>
              <SectionTitle>{d.gruposRiesgo.title}</SectionTitle>
            </div>
            <p className="text-[16px] leading-[26px] text-[#442748]">
              <RichText text={d.gruposRiesgo.body} />
            </p>
          </div>
          <div className="flex flex-col gap-6 rounded-[12px] border border-[#e2e8f0] bg-white p-4 shadow-[2px_2px_6px_rgba(54,50,118,0.1)]">
            {d.gruposRiesgo.items.map((item) => (
              <div key={item.title} className="flex flex-col gap-1">
                <h3 className="text-[16px] font-bold leading-6 text-[#503c77]">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-5 text-[#442748]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* Meningococo */}
      <section
        id="meningococo"
        className="scroll-mt-20 bg-[rgba(166,192,214,0.25)] px-5 py-16 md:px-8"
      >
        <Reveal delay={100}>
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.meningococo.eyebrow}</Eyebrow>
              <SectionTitle>{d.meningococo.title}</SectionTitle>
            </div>
            <p className="text-[16px] leading-[26px] text-[#442748]">
              <RichText text={d.meningococo.body} />
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-[18px] font-bold text-[#442748]">
                {d.meningococo.serogruposTitle}
              </h3>
              <div className="flex flex-col gap-2 text-[16px] leading-[25px] text-[#442748]">
                {d.meningococo.serogruposBody.map((p) => (
                  <p key={p.slice(0, 40)}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
              <SerogruposBadges
                letters={d.meningococo.serogrupos}
                highlight={d.meningococo.highlightSerogrupo}
              />
            </div>

            <CasosChart
              title={d.meningococo.chartTitle}
              rows={d.meningococo.chart}
            />
          </div>
        </div>
        </Reveal>
      </section>

      {/* 95% Malbrán */}
      <section className="bg-[#503c77] px-5 py-12 md:px-8">
        <Reveal delay={150}>
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <p className="shrink-0 text-[40px] font-black leading-[42px] text-[#dd876e]">
              {d.meningococo.malbranStat.pct}
            </p>
            <p className="text-[16px] leading-[26px] text-white">
              <RichText
                text={d.meningococo.malbranStat.text}
                strongClassName="font-bold text-white"
              />
            </p>
          </div>
          <p className="text-right text-[10px] leading-[14px] text-white/55">
            {d.meningococo.malbranStat.source}
          </p>
        </div>
        </Reveal>
      </section>

      {/* Secuelas */}
      <section
        id="secuelas"
        className="scroll-mt-20 bg-[#EEECF2] px-5 py-16 md:px-8"
      >
        <Reveal delay={80}>
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Eyebrow>{d.secuelas.eyebrow}</Eyebrow>
            <SectionTitle>
              <RichText text={d.secuelas.title} />
            </SectionTitle>
          </div>
          <ul className="grid grid-cols-3 gap-y-10">
            {d.secuelas.items.map((item) => (
              <li
                key={item.label}
                className="flex flex-col items-center gap-2 px-1 text-center"
              >
                <div className="relative size-16 shrink-0 overflow-hidden">
                  {item.composite ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.icon}
                      alt=""
                      width={64}
                      height={64}
                      className="size-16"
                    />
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/causas/bacteriana/secuela-circle.svg"
                        alt=""
                        width={64}
                        height={64}
                        className="absolute inset-0 size-16"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.icon}
                        alt=""
                        width={40}
                        height={40}
                        className="absolute left-3 top-3 size-10"
                      />
                    </>
                  )}
                </div>
                <p className="text-[13px] leading-5 text-[#442748]">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
        </Reveal>
      </section>

      {/* Quote evolución */}
      <section className="bg-[#503c77] px-5 py-16 md:px-8">
        <Reveal delay={100}>
        <p className="mx-auto max-w-2xl text-[18px] font-medium leading-[28px] text-white">
          <RichText
            text={d.quote}
            strongClassName="font-bold text-white"
            citeClassName="ml-0.5 text-[0.85em] font-[inherit] leading-none text-white"
          />
        </p>
        </Reveal>
      </section>

      {/* Stat secuelas */}
      <section className="bg-white px-5 py-12 md:px-8">
        <Reveal delay={150}>
        <div className="mx-auto max-w-2xl">
          <PersonStat {...d.secuelas.stat} tone="plain" />
        </div>
        </Reveal>
      </section>

      {/* Vacunación */}
      <section
        id="vacunacion"
        className="scroll-mt-20 bg-[#EEECF2] px-5 py-16 md:px-8"
      >
        <Reveal delay={80}>
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.vacunacion.eyebrow}</Eyebrow>
              <SectionTitle>{d.vacunacion.title}</SectionTitle>
            </div>
            <div className="flex flex-col gap-4 text-[15px] leading-6 text-[#442748]">
              {d.vacunacion.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>
                  <RichText text={p} />
                </p>
              ))}
              <ul className="flex flex-col gap-2">
                {d.vacunacion.bullets.map((b) => (
                  <li key={b.title} className="flex gap-2.5">
                    <span
                      className="mt-2 size-2 shrink-0 rounded-full bg-[#503c77]"
                      aria-hidden
                    />
                    <p>
                      <strong className="font-bold text-[#442748]">
                        {b.title}
                      </strong>
                      <RichText text={b.body} />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[18px] font-bold text-[#503c77]">
              <RichText text={d.vacunacion.esquemasTitle} />
            </h3>
            <div className="flex flex-col gap-5 rounded-[12px] border border-[#e2e8f0] bg-[rgba(80,60,119,0.1)] p-5">
              {d.vacunacion.esquemas.map((esquema, idx) => (
                <div
                  key={esquema.badge}
                  className={`flex flex-col gap-4 ${
                    idx === 0 ? "border-b border-[#dbe1e7] pb-5" : ""
                  }`}
                >
                  <span className="w-fit rounded-br-lg rounded-tl-lg bg-[#DD876E] px-3 py-1.5 text-[11px] font-bold text-white">
                    {esquema.badge}
                  </span>
                  <ul className="flex flex-col gap-2">
                    {esquema.doses.map((dose) => (
                      <li key={dose} className="flex gap-2.5">
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#503c77]"
                          aria-hidden
                        />
                        <span className="text-[14px] leading-5 text-[#442748]">
                          {dose}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[18px] font-bold text-[#503c77]">
              {d.vacunacion.serogrupoB.title}
            </h3>
            <p className="text-[15px] leading-6 text-[#442748]">
              <RichText text={d.vacunacion.serogrupoB.body} />
            </p>
            <ul className="flex flex-col gap-3 rounded-[14px] border border-[#e2e8f0] bg-[rgba(80,60,119,0.1)] px-5 py-[18px]">
              {d.vacunacion.serogrupoB.conditions.map((c) => (
                <li key={c} className="flex gap-2.5">
                  <span
                    className="mt-2 size-2 shrink-0 rounded-full bg-[#503c77]"
                    aria-hidden
                  />
                  <span className="text-[14px] leading-5 text-[#442748]">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </Reveal>
      </section>

      {/* Prevención */}
      <section
        id="prevencion"
        className="scroll-mt-20 bg-[#EEECF2] px-5 py-16 md:px-8"
      >
        <Reveal delay={100}>
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.prevencion.eyebrow}</Eyebrow>
              <SectionTitle>{d.prevencion.title}</SectionTitle>
            </div>
            <p className="text-[16px] leading-[26px] text-[#442748]">
              <RichText text={d.prevencion.body} />
            </p>
          </div>
          <Link
            href={d.prevencion.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-white text-[15px] font-bold text-[#503c77] shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition hover:bg-white/90"
          >
            {d.prevencion.ctaLabel}
          </Link>
        </div>
        </Reveal>
      </section>

      <CausaOtrasCausas items={d.otrasCausas} />
    </>
  );
}
