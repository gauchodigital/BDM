"use client";

import { Fragment, useState } from "react";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import type { DatoTabData } from "@/lib/datosData";

function DatosContent({ active }: { active: DatoTabData }) {
  const paragraphs = active.body.split(/\n\n+/).filter(Boolean);

  return (
    <div key={active.id} className="animate-fade-up">
      <div className="space-y-4">
        {paragraphs.map((p) => (
          <p
            key={p.slice(0, 48)}
            className="text-[15px] leading-[1.65] text-muted md:text-[16px] md:leading-[1.7] lg:text-[17px]"
          >
            {p.split("\n").map((line, i, lines) => (
              <Fragment key={`${i}-${line.slice(0, 24)}`}>
                <RichText text={line} />
                {i < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}

export function DatosSection({ items }: { items: DatoTabData[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = items.find((i) => i.id === activeId) ?? items[0];

  if (!items.length || !active) return null;

  return (
    <section
      id="datos"
      className="section-pad scroll-mt-16 bg-white"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            Conocé los detalles
          </p>
          <h2 className="mt-3 max-w-xl text-[28px] font-extrabold leading-tight text-primary md:text-[2.5rem]">
            Datos sobre la meningitis
          </h2>
        </Reveal>

        {/* Mobile */}
        <Reveal delay={80} className="mt-6 lg:hidden">
          <div
            role="tablist"
            aria-label="Temas sobre la meningitis"
            className="flex flex-wrap gap-2"
          >
            {items.map((item) => {
              const isActive = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(item.id)}
                  className={`rounded-full px-5 py-3 text-center text-[13px] font-bold leading-none transition-all duration-200 ${
                    isActive
                      ? "bg-[#503C77] text-white shadow-[0_4px_12px_rgba(80,60,119,0.22)]"
                      : "border border-[#E2E8F0] bg-white text-[#442748]/45"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <article className="mt-4 overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white p-4">
            <h3 className="text-[18px] font-extrabold leading-tight text-primary">
              {active.title}
            </h3>
            <div className="mt-3">
              <DatosContent active={active} />
            </div>
          </article>
        </Reveal>

        {/* Desktop */}
        <Reveal delay={100} className="mt-8 hidden lg:block">
          <article className="overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white">
            <div className="grid grid-cols-[minmax(0,15.5rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
              <nav
                aria-label="Temas sobre la meningitis"
                className="flex flex-col gap-1 border-r border-[#F0EDF5] bg-[#FAF9FC] p-3"
              >
                {items.map((item) => {
                  const isActive = item.id === active.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`rounded-[12px] px-3.5 py-3.5 text-left text-[13px] font-bold leading-snug transition-all duration-200 ${
                        isActive
                          ? "bg-[#503C77] text-white shadow-[0_2px_12px_rgba(80,60,119,0.18)]"
                          : "text-[#442748]/45 hover:bg-white/70 hover:text-[#442748]/70"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="flex flex-col justify-center px-8 py-8 xl:px-10 xl:py-10">
                <h3 className="text-[22px] font-extrabold leading-tight text-primary xl:text-[26px]">
                  {active.title}
                </h3>
                <div className="mt-1 h-0.5 w-10 rounded-full bg-accent" />
                <div className="mt-5 max-w-2xl">
                  <DatosContent active={active} />
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
