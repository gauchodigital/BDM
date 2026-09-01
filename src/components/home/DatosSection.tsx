"use client";

import { useState } from "react";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import type { DatoTabData } from "@/lib/datosData";

const TAB_ICONS: Record<string, string> = {
  transmision: "air",
  "grupos-riesgo": "groups",
  diagnostico: "stethoscope",
};

function TabIcon({ id }: { id: string }) {
  const icon = TAB_ICONS[id] ?? "info";
  return (
    <span className="material-symbols-outlined text-[20px] leading-none">
      {icon}
    </span>
  );
}

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
            <RichText text={p} />
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
      className="section-pad scroll-mt-16 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F6FB_55%,#FFFFFF_100%)]"
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
          <div className="flex w-full items-center gap-0.5 rounded-full bg-[#F0EDF5] p-1">
            {items.map((item) => {
              const isActive = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-center text-[11px] leading-tight transition-all duration-200 sm:px-3 sm:text-[12px] ${
                    isActive
                      ? "bg-white font-medium text-[#503C77] shadow-[0_1px_4px_rgba(68,39,72,0.08)]"
                      : "font-normal text-[#7A7585]"
                  }`}
                >
                  <TabIcon id={item.id} />
                  <span className="hidden min-[380px]:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          <article className="mt-4 overflow-hidden rounded-[16px] bg-white p-5 shadow-[0_8px_32px_rgba(80,60,119,0.08)] ring-1 ring-[#E8E4EF]">
            <div className="flex items-center gap-2.5 border-b border-[#F0EDF5] pb-4">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#F0EDF5] text-[#503C77]">
                <TabIcon id={active.id} />
              </span>
              <h3 className="text-[18px] font-extrabold leading-tight text-primary">
                {active.title}
              </h3>
            </div>
            <div className="mt-4">
              <DatosContent active={active} />
            </div>
          </article>
        </Reveal>

        {/* Desktop */}
        <Reveal delay={100} className="mt-8 hidden lg:block">
          <article className="overflow-hidden rounded-[20px] bg-white shadow-[0_12px_48px_rgba(80,60,119,0.1)] ring-1 ring-[#E8E4EF]">
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
                      className={`group flex items-center gap-3 rounded-[12px] px-3.5 py-3.5 text-left transition-all duration-200 ${
                        isActive
                          ? "bg-white text-[#503C77] shadow-[0_2px_12px_rgba(80,60,119,0.1)] ring-1 ring-[#E8E4EF]"
                          : "text-[#7A7585] hover:bg-white/70 hover:text-[#503C77]"
                      }`}
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                          isActive
                            ? "bg-[#503C77] text-white"
                            : "bg-[#EDE9F3] text-[#7A78BB] group-hover:bg-[#E5DFF0] group-hover:text-[#503C77]"
                        }`}
                      >
                        <TabIcon id={item.id} />
                      </span>
                      <span
                        className={`text-[14px] leading-snug ${
                          isActive ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {item.label}
                      </span>
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
