"use client";

import { useState } from "react";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import type { DatoTabData } from "@/lib/datosData";

export function DatosSection({ items }: { items: DatoTabData[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = items.find((i) => i.id === activeId) ?? items[0];

  if (!items.length || !active) return null;

  const paragraphs = active.body.split(/\n\n+/).filter(Boolean);

  return (
    <section id="datos" className="section-pad scroll-mt-16 bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="max-w-2xl lg:max-w-none">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              Conocé los detalles
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold leading-tight text-primary md:text-[2.5rem]">
              Datos sobre la meningitis
            </h2>
          </Reveal>

          <Reveal delay={80} className="mt-6 flex flex-wrap gap-3 md:gap-5">
            {items.map((item) => {
              const isActive = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-[13px] leading-none transition ${
                    isActive
                      ? "bg-[#503C77] font-bold text-white"
                      : "border border-[#A6C0D6] bg-white font-bold text-[#442748]/50 hover:text-[#442748]/80"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </Reveal>

          <Reveal delay={120}>
            <article className="mt-5 rounded-[12px] border border-[#A6C0D6] bg-white p-4 md:p-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12 lg:p-10">
              <h3 className="text-[20px] font-extrabold leading-tight text-primary md:text-[24px] lg:text-[28px]">
                {active.title}
              </h3>
              <div className="mt-3 space-y-3 lg:mt-0 lg:space-y-4">
                {paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 48)}
                    className="text-[14px] leading-[1.6] text-muted md:text-[15px] lg:text-[17px] lg:leading-[1.7]"
                  >
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
