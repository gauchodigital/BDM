"use client";

import { useState } from "react";
import type { VacunaEtapa } from "@/lib/vacunacionData";

export function VacunasEtapasPanel({
  etapas,
  selectLabel,
}: {
  etapas: VacunaEtapa[];
  selectLabel: string;
}) {
  const [activeId, setActiveId] = useState(etapas[0]?.id ?? "");
  const active = etapas.find((e) => e.id === activeId) ?? etapas[0];

  if (!active) return null;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <p className="text-[11px] font-bold uppercase leading-normal tracking-[1.3px] text-primary">
        {selectLabel}
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {etapas.map((etapa) => {
            const isActive = etapa.id === active.id;
            return (
              <button
                key={etapa.id}
                type="button"
                onClick={() => setActiveId(etapa.id)}
                className={`inline-flex h-9 items-center gap-1 rounded-[22px] px-3 py-1.5 text-[13px] font-bold leading-[16.8px] transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "border border-light bg-white px-2 text-dark/50 hover:text-dark/80"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] leading-none ${
                    isActive ? "text-white" : "text-dark/50"
                  }`}
                >
                  {etapa.icon}
                </span>
                {etapa.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-primary p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[32px] leading-none text-white">
                {active.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-bold leading-[22px] text-white">
                  {active.bannerTitle}
                </p>
                <p className="text-[13px] font-normal leading-5 text-white">
                  {active.bannerSubtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 rounded-2xl border border-light bg-white p-5">
            {active.grupos.map((grupo) => (
              <div key={grupo.id} className="flex flex-col gap-4">
                <span className="inline-flex w-fit items-center rounded-bl-lg rounded-tr-lg bg-secondary px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2px] text-white">
                  {grupo.badge}
                </span>
                <ul className="flex flex-col gap-2">
                  {grupo.vacunas.map((v) => (
                    <li
                      key={`${grupo.id}-${v.nombre}`}
                      className="rounded-xl border border-light bg-white p-3"
                    >
                      <p className="text-[16px] font-bold leading-[22px] text-primary">
                        {v.nombre}
                      </p>
                      <p className="text-[15px] leading-6 text-dark">
                        {v.detalle}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
