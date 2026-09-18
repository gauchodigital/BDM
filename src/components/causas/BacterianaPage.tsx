import type { ReactNode } from "react";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import { RevealSection } from "@/components/ui/RevealSection";
import { CausaOtrasCausas } from "@/components/causas/CausaOtrasCausas";
import { CasosChart } from "@/components/causas/CasosChart";
import { SerogruposBadges } from "@/components/causas/SerogruposBadges";
import { BACTERIANA } from "@/lib/bacterianaContent";

const WRAP = "mx-auto w-full max-w-7xl px-5 md:px-8";
const PANEL =
  "rounded-[12px] border-0 bg-transparent p-0 md:border md:border-[#D8D4DE] md:p-8";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-extrabold uppercase leading-[16.8px] tracking-[1.3px] text-[#dd876e]">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[28px] font-black leading-8 text-[#503c77] lg:text-[32px] lg:leading-9">
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
  highlightIndex,
}: {
  ratio: string;
  label: string;
  total: number;
  active: number;
  activeIcon: string;
  inactiveIcon: string;
  tone?: "light" | "dark" | "plain";
  highlightIndex?: number;
}) {
  const dark = tone === "dark";
  const plain = tone === "plain";
  const start = highlightIndex ?? 0;
  return (
    <div
      className={`flex flex-col items-center overflow-hidden ${
        plain ? "gap-3 py-6 lg:gap-5 lg:py-10" : "gap-2 py-6"
      } ${
        dark
          ? "rounded-2xl bg-[#503c77] px-5"
          : plain
            ? "bg-transparent px-0"
            : "rounded-2xl border border-[#D8D4DE] bg-[#EEECF2] px-5"
      }`}
    >
      <div
        className={`flex items-end justify-center ${
          plain ? "gap-2 lg:gap-3.5" : "gap-1.5"
        }`}
      >
        {Array.from({ length: total }, (_, i) => {
          const isActive = i >= start && i < start + active;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={isActive ? activeIcon : inactiveIcon}
              alt=""
              width={28}
              height={plain ? 30 : 28}
              className={
                plain
                  ? "h-[30px] w-7 shrink-0 lg:h-[44px] lg:w-10"
                  : "size-7 shrink-0"
              }
            />
          );
        })}
      </div>
      <div className="w-full text-center">
        <p
          className={`font-black ${
            plain ? "text-[22px] lg:text-[40px] lg:leading-none" : "text-[22px]"
          } ${dark ? "text-white" : "text-[#503c77]"}`}
        >
          {ratio}
        </p>
        <p
          className={`font-normal ${
            plain
              ? "mt-2 text-[13px] leading-5 lg:mt-3 lg:text-[16px] lg:leading-6"
              : "mt-1 text-[13px] leading-5"
          } ${
            dark
              ? "text-white/80"
              : plain
                ? "text-[#6D6AAE] lg:whitespace-nowrap"
                : "text-[#442748]"
          }`}
        >
          <RichText text={label} />
        </p>
      </div>
    </div>
  );
}

function TocNav({
  items,
}: {
  items: typeof BACTERIANA.toc;
}) {
  return (
    <nav className="flex flex-col gap-2 rounded-[12px] bg-[#EEECF2] px-5 py-4 text-[13px] leading-5 text-[#503c77]">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          <a
            href={`#${item.id}`}
            className="inline-flex items-center gap-1.5 hover:opacity-80"
          >
            <span
              className="material-symbols-outlined shrink-0 text-[9px] leading-none no-underline"
              aria-hidden
            >
              arrow_forward
            </span>
            <span className="underline underline-offset-2">{item.label}</span>
          </a>
          {"children" in item && item.children ? (
            <div className="ml-4 flex flex-col gap-2">
              {item.children.map((child) => (
                <a
                  key={`${item.id}-${child.id}-${child.label}`}
                  href={`#${child.id}`}
                  className="inline-flex items-center gap-1.5 hover:opacity-80"
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
  );
}

export function BacterianaPage() {
  const d = BACTERIANA;

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#e2e8f0] bg-white py-3"
      >
        <div className={`${WRAP} flex items-center gap-2 text-[13px]`}>
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

      {/* Hero + TOC */}
      <section className="bg-white pb-10 pt-6">
        <div
          className={`${WRAP} flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12`}
        >
          <div className="flex flex-col gap-6">
            <div className="animate-fade-up flex flex-col gap-3">
              <Chip label={d.badge} color="accent" />
              <h1 className="text-[34px] font-black leading-tight text-[#503c77] md:text-[40px] lg:text-[44px]">
                {d.title}
              </h1>
            </div>
            <p className="animate-fade-up animate-delay-1 text-[15px] leading-6 text-[#442748] lg:text-[16px] lg:leading-[26px]">
              <RichText
                text={d.intro[0]}
                strongClassName="font-semibold text-[#442748]"
                citeClassName="ml-0.5 text-[0.65em] font-[inherit] leading-none text-[#442748]"
              />
              <br />
              <span className="text-[#5C5670]">
                <RichText
                  text={d.intro[1]}
                  strongClassName="font-semibold text-[#442748]"
                  citeClassName="ml-0.5 text-[0.65em] font-[inherit] leading-none text-[#5C5670]"
                />
              </span>
            </p>
          </div>

          <aside className="animate-fade-up animate-delay-2 flex flex-col gap-2 lg:sticky lg:top-24">
            <Eyebrow>EN ESTA PÁGINA</Eyebrow>
            <TocNav items={d.toc} />
          </aside>
        </div>
      </section>

      {/* ¿Qué es? + Síntomas */}
      <RevealSection
        className="scroll-mt-20 bg-white pb-16"
        delay={80}
      >
        <div className={`${WRAP} grid gap-8 lg:grid-cols-2 lg:gap-10`}>
          <div id="que-es" className={`${PANEL} flex flex-col gap-6`}>
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
              <p className="mt-4">
                <RichText text={d.queEs.bacteriaIntro} />
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                {d.queEs.bacterias.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <PersonStat {...d.queEs.stat} />
          </div>

          <div id="sintomas" className={`${PANEL} flex flex-col gap-4`}>
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.sintomas.eyebrow}</Eyebrow>
              <SectionTitle>{d.sintomas.title}</SectionTitle>
            </div>
            <div className="text-[16px] leading-[26px] text-[#442748]">
              <p>
                <RichText text={d.sintomas.body} />
              </p>
              <ul className="mt-4 list-disc space-y-1 pl-6">
                {d.sintomas.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Urgency bar */}
      <RevealSection className="bg-[#503c77]" delay={150}>
        <div className={`${WRAP} border-l-4 border-[#DD876E] py-14 md:py-16 lg:border-l-0 lg:py-12`}>
          <p className="mx-auto max-w-4xl text-center text-[18px] font-medium leading-snug text-white md:text-[20px] lg:text-[22px] lg:leading-[30px]">
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
      </RevealSection>

      {/* Grupos de riesgo */}
      <RevealSection
        id="grupos-riesgo"
        className="scroll-mt-20 bg-white py-16"
        delay={80}
      >
        <div className={`${WRAP} flex flex-col gap-8`}>
          <div className="max-w-3xl flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.gruposRiesgo.eyebrow}</Eyebrow>
              <SectionTitle>{d.gruposRiesgo.title}</SectionTitle>
            </div>
            <p className="text-[16px] leading-[26px] text-[#442748]">
              <RichText text={d.gruposRiesgo.body} />
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {d.gruposRiesgo.items.map((item) => (
              <div
                key={item.title}
                className="rounded-[12px] border border-[#e2e8f0] bg-white p-5 shadow-[2px_2px_4px_rgba(51,51,51,0.08)]"
              >
                <h3 className="text-[15px] font-bold leading-6 text-[#503c77]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-5 text-[#442748]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Meningococo */}
      <RevealSection
        id="meningococo"
        className="scroll-mt-20 bg-[#EEECF2] py-16"
        delay={100}
      >
        <div className={WRAP}>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-8">
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
                  <h3 className="text-[18px] font-bold text-[#503C77]">
                    {d.meningococo.serogruposTitle}
                  </h3>
                  <div className="flex flex-col gap-2 text-[16px] leading-[25px] text-[#442748]">
                    {d.meningococo.serogruposBody.map((p) => (
                      <p key={p.slice(0, 40)}>
                        <RichText text={p} />
                      </p>
                    ))}
                  </div>
                </div>
                <SerogruposBadges
                  letters={d.meningococo.serogrupos}
                  highlight={d.meningococo.highlightSerogrupo}
                />
              </div>
            </div>

            <div className="self-start">
              <CasosChart
                title={d.meningococo.chartTitle}
                rows={d.meningococo.chart}
              />
            </div>
          </div>
        </div>
      </RevealSection>

      {/* 95% Malbrán */}
      <RevealSection className="bg-[#503c77] py-12" delay={150}>
        <div className={`${WRAP} flex items-center justify-center gap-4 lg:gap-6`}>
          <p className="shrink-0 text-[40px] font-black leading-none text-[#dd876e] md:text-[48px]">
            {d.meningococo.malbranStat.pct}
          </p>
          <p className="max-w-3xl text-[15px] leading-[26px] text-white md:text-[16px]">
            <RichText
              text={d.meningococo.malbranStat.text}
              strongClassName="font-bold text-white"
              citeClassName="ml-0.5 text-[0.65em] font-[inherit] leading-none text-white"
            />
          </p>
        </div>
      </RevealSection>

      {/* Secuelas */}
      <RevealSection
        id="secuelas"
        className="scroll-mt-20 bg-white py-16"
        delay={80}
      >
        <div className={`${WRAP} flex flex-col gap-10`}>
          <div className="flex flex-col gap-2">
            <Eyebrow>{d.secuelas.eyebrow}</Eyebrow>
            <SectionTitle>
              <RichText text={d.secuelas.title} />
            </SectionTitle>
          </div>
          <ul className="grid grid-cols-3 gap-x-4 gap-y-10 lg:grid-cols-6 lg:gap-x-6">
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
                <p className="text-[12px] leading-5 text-[#442748] md:text-[13px]">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </RevealSection>

      {/* Quote evolución */}
      <RevealSection className="bg-[#503c77] py-16" delay={100}>
        <p className={`${WRAP} mx-auto max-w-4xl text-center text-[20px] font-normal leading-[28px] text-white md:text-[22px]`}>
          <RichText
            text={d.quote}
            strongClassName="font-semibold text-white"
            citeClassName="ml-0.5 text-[0.65em] font-[inherit] leading-none text-white"
          />
        </p>
      </RevealSection>

      {/* Stat secuelas */}
      <RevealSection className="bg-white py-12" delay={150}>
        <div className={WRAP}>
          <PersonStat {...d.secuelas.stat} tone="plain" />
        </div>
      </RevealSection>

      {/* Vacunación */}
      <RevealSection
        id="vacunacion"
        className="scroll-mt-20 bg-[#EEECF2] py-16 lg:py-20"
        delay={80}
      >
        <div
          className={`${WRAP} grid items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-12`}
        >
          {/* Columna izquierda — solo texto */}
          <div className="flex flex-col gap-5">
            <Eyebrow>{d.vacunacion.eyebrow}</Eyebrow>
            <h2 className="text-[26px] font-black leading-tight text-[#503c77] lg:text-[30px] lg:leading-[1.15]">
              {d.vacunacion.title}
            </h2>
            <div className="flex flex-col gap-4 text-[15px] leading-[1.65] text-[#442748]">
              {d.vacunacion.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>
                  <RichText text={p} />
                </p>
              ))}
              <ul className="flex flex-col gap-3">
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

          {/* Columna derecha — esquemas + serogrupo B */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[16px] font-bold text-[#503c77] lg:text-[18px]">
              <RichText text={d.vacunacion.esquemasTitle} />
            </h3>

            <div className="flex flex-col gap-5 rounded-[14px] border border-white bg-[#503C77]/10 p-5 shadow-[2px_2px_4px_rgba(51,51,51,0.15)]">
              {d.vacunacion.esquemas.map((esquema) => (
                <div key={esquema.badge} className="flex flex-col gap-4">
                  <span className="w-fit rounded-[20px] bg-[#DD876E] px-3 py-1.5 text-[10px] font-bold uppercase leading-none tracking-wide text-white sm:text-[11px]">
                    {esquema.badge}
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {esquema.doses.map((dose) => (
                      <li key={dose} className="flex gap-2.5">
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#503c77]"
                          aria-hidden
                        />
                        <span className="text-[13px] font-normal leading-5 text-[#442748] sm:text-[14px]">
                          {dose}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-[16px] font-bold text-[#503c77] lg:text-[18px]">
                {d.vacunacion.serogrupoB.title}
              </h3>
              <div className="flex flex-col gap-3 text-[15px] font-normal leading-[1.65] text-[#442748]">
                {d.vacunacion.serogrupoB.body.split("\n").map((p) => (
                  <p key={p.slice(0, 40)}>
                    <RichText
                      text={p}
                      strongClassName="font-semibold text-[#442748]"
                    />
                  </p>
                ))}
              </div>
              <ul className="flex flex-col gap-3 rounded-[14px] border border-white bg-[#503C77]/10 p-5 shadow-[2px_2px_4px_rgba(51,51,51,0.15)]">
                {d.vacunacion.serogrupoB.conditions.map((c) => (
                  <li key={c} className="flex gap-2.5">
                    <span
                      className="mt-2 size-2 shrink-0 rounded-full bg-[#503c77]"
                      aria-hidden
                    />
                    <span className="text-[14px] font-normal leading-5 text-[#442748]">
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </RevealSection>

      <CausaOtrasCausas items={d.otrasCausas} containerClassName="max-w-7xl" />
    </>
  );
}
