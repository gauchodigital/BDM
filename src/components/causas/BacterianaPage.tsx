import type { ReactNode } from "react";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import { VacunasCtaSection } from "@/components/home/VacunasCtaSection";
import { BacterianaSintomas } from "@/components/causas/BacterianaSintomas";
import { CausaOtrasCausas } from "@/components/causas/CausaOtrasCausas";
import { CentrosVacunacionBlock } from "@/components/vacunacion/CentrosVacunacionBlock";
import { BACTERIANA } from "@/lib/bacterianaContent";
import type { CentroVacunacion } from "@/lib/centrosData";
import type { VacunacionData } from "@/lib/vacunacionData";

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
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex flex-col items-center gap-2 overflow-hidden rounded-2xl px-5 py-6 ${
        dark ? "bg-[#503c77]" : "bg-[#e9eff5]"
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
            height={28}
            className="size-7"
          />
        ))}
      </div>
      <div className="w-full text-center">
        <p
          className={`text-[22px] font-bold ${
            dark ? "text-white" : "text-[#503c77]"
          }`}
        >
          {ratio}
        </p>
        <p
          className={`mt-1 text-[13px] leading-5 ${
            dark ? "text-white/80" : "text-[#442748]"
          }`}
        >
          <RichText text={label} />
        </p>
      </div>
    </div>
  );
}

export function BacterianaPage({
  centros,
  centrosCopy,
}: {
  centros: CentroVacunacion[];
  centrosCopy: VacunacionData["centros"];
}) {
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
          <div className="flex flex-col gap-2">
            <Chip label={d.badge} color="accent" />
            <h1 className="text-[32px] font-black leading-normal text-[#503c77]">
              {d.title}
            </h1>
          </div>
          <div className="flex flex-col gap-1 text-[16px] leading-[26px] text-[#442748]">
            {d.intro.map((p) => (
              <p key={p.slice(0, 48)}>
                <RichText text={p} />
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Eyebrow>EN ESTA PÁGINA</Eyebrow>
            <nav className="flex flex-col gap-2 rounded-lg bg-[#e9eff5] px-5 py-4 text-[13px] leading-5 text-[#503c77] shadow-[2px_2px_2px_rgba(0,0,0,0.15)]">
              {d.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="hover:underline"
                >
                  → {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* ¿Qué es? */}
      <section id="que-es" className="scroll-mt-20 bg-white px-5 pb-10 md:px-8">
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
            <ul className="mt-1 list-disc space-y-0 pl-6">
              {d.queEs.bacterias.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <PersonStat {...d.queEs.stat} />
        </div>
      </section>

      {/* Urgency bar */}
      <section className="bg-[#503c77]">
        <div className="border-l-4 border-[#DD876E] px-5 py-10 md:px-8">
          <p className="mx-auto max-w-2xl text-[16px] leading-snug text-white">
            <RichText
              text={d.urgency}
              strongClassName="font-bold text-[#DD876E]"
            />
          </p>
        </div>
      </section>

      {/* Síntomas */}
      <section
        id="sintomas"
        className="scroll-mt-20 bg-white px-5 py-16 md:px-8"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.sintomas.eyebrow}</Eyebrow>
              <SectionTitle>{d.sintomas.title}</SectionTitle>
            </div>
            <div className="text-[16px] leading-[26px] text-[#442748]">
              <p>{d.sintomas.lead}</p>
              <p>
                <RichText text={d.sintomas.body} />
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.sintomas.selectLabel}</Eyebrow>
              <p className="text-[13px] leading-[18px] text-[#442748]">
                {d.sintomas.selectHint}
              </p>
            </div>
          </div>
          <BacterianaSintomas />
        </div>
      </section>

      <VacunasCtaSection />

      {/* Grupos de riesgo */}
      <section
        id="grupos-riesgo"
        className="scroll-mt-20 bg-white px-5 py-16 md:px-8"
      >
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
      </section>

      {/* Transmisión */}
      <section
        id="transmision"
        className="scroll-mt-20 bg-white px-5 pb-12 md:px-8"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Eyebrow>{d.transmision.eyebrow}</Eyebrow>
            <SectionTitle>{d.transmision.title}</SectionTitle>
          </div>
          <p className="text-[16px] leading-[26px] text-[#442748]">
            <RichText text={d.transmision.body} />
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-[#44274b] px-5 py-16 md:px-8">
        <p className="mx-auto max-w-2xl text-[18px] leading-[28px] text-white">
          <RichText
            text={d.quote}
            strongClassName="font-bold text-[#DD876E]"
          />
        </p>
      </section>

      {/* Meningococo */}
      <section
        id="meningococo"
        className="scroll-mt-20 bg-[rgba(166,192,214,0.25)] px-5 py-16 md:px-8"
      >
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
              <div className="flex items-center justify-between gap-1">
                {d.meningococo.serogrupos.map((letter) => {
                  const highlight = letter === d.meningococo.highlightSerogrupo;
                  const noRing = letter === "X";
                  if (noRing) {
                    return (
                      <span
                        key={letter}
                        className="flex size-14 items-center justify-center text-[20px] font-black text-[#442748]"
                      >
                        {letter}
                      </span>
                    );
                  }
                  return (
                    <div
                      key={letter}
                      className={`flex size-14 items-center justify-center rounded-full border-[3px] border-solid text-[20px] font-black ${
                        highlight
                          ? "border-[#DD876E] text-[#DD876E]"
                          : "border-[#442748] text-[#442748]"
                      }`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[12px] border border-[#e2e8f0] bg-white p-4 shadow-[2px_2px_4px_rgba(51,51,51,0.15)]">
              <h3 className="text-[15px] font-bold text-[#442748]">
                {d.meningococo.chartTitle}
              </h3>
              <div className="flex flex-col gap-5">
                {d.meningococo.chart.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[13px] font-medium text-[#442748]">
                      <span>{row.label}</span>
                      <span>{row.pct}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e9eff5]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.pct}%`,
                          backgroundColor: row.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 95% Malbrán */}
      <section className="bg-[#503c77] px-5 py-12 md:px-8">
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
      </section>

      {/* Secuelas */}
      <section
        id="secuelas"
        className="scroll-mt-20 bg-[rgba(166,192,214,0.25)] px-5 py-16 md:px-8"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          <div className="flex flex-col gap-6">
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
          <PersonStat {...d.secuelas.stat} tone="dark" />
        </div>
      </section>

      {/* Vacunación */}
      <section
        id="vacunacion"
        className="scroll-mt-20 bg-[rgba(166,192,214,0.25)] px-5 pb-16 pt-4 md:px-8"
      >
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
            <div className="flex flex-col gap-5 rounded-[12px] border border-[#e2e8f0] bg-white p-5 shadow-[2px_2px_4px_rgba(51,51,51,0.15)]">
              {d.vacunacion.esquemas.map((esquema, idx) => (
                <div
                  key={esquema.badge}
                  className={`flex flex-col gap-4 ${
                    idx === 0 ? "border-b border-[#dbe1e7] pb-5" : ""
                  }`}
                >
                  <span className="w-fit rounded-br-lg rounded-tl-lg bg-[#503c77] px-3 py-1.5 text-[11px] font-bold text-white">
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
            <ul className="flex flex-col gap-3 rounded-[12px] border border-[#e2e8f0] bg-white p-[18px] shadow-[2px_2px_4px_rgba(51,51,51,0.15)]">
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
      </section>

      {/* Prevención */}
      <section
        id="prevencion"
        className="scroll-mt-20 bg-[#e9eff5] px-5 py-16 md:px-8"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Eyebrow>{d.prevencion.eyebrow}</Eyebrow>
            <SectionTitle>{d.prevencion.title}</SectionTitle>
          </div>
          <p className="text-[16px] leading-[26px] text-[#442748]">
            <RichText text={d.prevencion.body} />
          </p>
        </div>
      </section>

      <CentrosVacunacionBlock {...centrosCopy} centros={centros} />

      <CausaOtrasCausas items={d.otrasCausas} />
    </>
  );
}
