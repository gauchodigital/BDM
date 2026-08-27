"use client";

import { useState } from "react";
import type { VacunaEtapa } from "@/lib/vacunacionData";

/** Idle/active usan prefijo lg: — en mobile el activo sigue siendo primary. */
const ETAPA_STYLE: Record<
  string,
  { idle: string; active: string; dot: string }
> = {
  embarazadas: {
    idle: "lg:border-0 lg:bg-[#F8E4DE] lg:text-[#8B4A3C]",
    active:
      "lg:bg-[#F0C4B8] lg:text-[#442748] lg:ring-2 lg:ring-[#E07A6A]/35",
    dot: "bg-[#E07A6A]",
  },
  "recien-nacidos": {
    idle: "lg:border-0 lg:bg-[#D6E4EF] lg:text-primary",
    active: "lg:bg-light lg:text-primary lg:ring-2 lg:ring-primary/25",
    dot: "bg-light",
  },
  "hasta-1-anio": {
    idle: "lg:border-0 lg:bg-[#E8E2F0] lg:text-primary",
    active: "lg:bg-primary lg:text-white lg:ring-2 lg:ring-primary/30",
    dot: "bg-primary",
  },
  "hasta-2-anios": {
    idle: "lg:border-0 lg:bg-[#D4EBE8] lg:text-[#2F6B64]",
    active: "lg:bg-[#5BA8A0] lg:text-white lg:ring-2 lg:ring-[#5BA8A0]/35",
    dot: "bg-[#5BA8A0]",
  },
  "nacidos-2021": {
    idle: "lg:border-0 lg:bg-[#F5EDC8] lg:text-[#6B5A1A]",
    active: "lg:bg-[#E8C84A] lg:text-[#442748] lg:ring-2 lg:ring-[#E8C84A]/40",
    dot: "bg-[#E8C84A]",
  },
  "nacidos-2018": {
    idle: "lg:border-0 lg:bg-[#EDEAF2] lg:text-primary",
    active: "lg:bg-[#C8C0D8] lg:text-primary lg:ring-2 lg:ring-secondary/35",
    dot: "bg-secondary",
  },
  "jovenes-adultos": {
    idle: "lg:border-0 lg:bg-[#E8E8EC] lg:text-dark",
    active: "lg:bg-[#9A96A8] lg:text-white lg:ring-2 lg:ring-[#9A96A8]/35",
    dot: "bg-[#9A96A8]",
  },
};

const FALLBACK = {
  idle: "",
  active: "lg:bg-primary lg:text-white",
  dot: "bg-primary",
};

function chipLabel(etapa: VacunaEtapa, desktop: boolean) {
  if (!desktop) return etapa.label;
  if (etapa.id === "embarazadas") return etapa.bannerTitle;
  if (etapa.id === "hasta-1-anio") return etapa.bannerTitle;
  if (etapa.id === "hasta-2-anios") return etapa.bannerTitle;
  if (etapa.id === "nacidos-2021") return "Nacidos en 2021";
  if (etapa.id === "nacidos-2018") return "Nacidos en 2015";
  return etapa.label;
}

export function VacunasEtapasPanel({
  etapas,
  selectLabel,
  activeId: controlledId,
  onActiveIdChange,
}: {
  etapas: VacunaEtapa[];
  selectLabel: string;
  activeId?: string;
  onActiveIdChange?: (id: string) => void;
}) {
  const [internalId, setInternalId] = useState(etapas[0]?.id ?? "");
  const activeId = controlledId ?? internalId;
  const setActiveId = onActiveIdChange ?? setInternalId;
  const active = etapas.find((e) => e.id === activeId) ?? etapas[0];

  if (!active) return null;

  const activeStyle = ETAPA_STYLE[active.id] ?? FALLBACK;

  return (
    <div className="mt-8 flex flex-col gap-6 lg:mt-10">
      <p className="text-[11px] font-bold uppercase leading-normal tracking-[1.3px] text-muted">
        {selectLabel}
      </p>

      <div className="flex flex-wrap gap-2 lg:gap-3">
        {etapas.map((etapa) => {
          const isActive = etapa.id === active.id;
          const style = ETAPA_STYLE[etapa.id] ?? FALLBACK;

          return (
            <button
              key={etapa.id}
              type="button"
              onClick={() => setActiveId(etapa.id)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-[22px] px-3 py-1.5 text-[13px] font-bold leading-[16.8px] transition lg:h-10 lg:px-4 ${
                isActive
                  ? `bg-primary text-white max-lg:bg-primary max-lg:text-white ${style.active}`
                  : `border border-light bg-white text-dark/50 hover:text-dark/80 max-lg:border max-lg:border-light max-lg:bg-white ${style.idle}`
              }`}
            >
              <span className="material-symbols-outlined text-[22px] leading-none lg:text-[24px]">
                {etapa.icon}
              </span>
              <span className="lg:hidden">{chipLabel(etapa, false)}</span>
              <span className="hidden lg:inline">{chipLabel(etapa, true)}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 lg:hidden">
        <div className="rounded-xl bg-primary p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary">
              <span className="material-symbols-outlined text-[24px] leading-none">
                {active.icon}
              </span>
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
          {active.grupos.map((grupo, gi) => (
            <div key={grupo.id} className="flex flex-col gap-4">
              <span
                className={`inline-flex w-fit items-center rounded-bl-lg rounded-tr-lg px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2px] text-white ${
                  gi === 0 ? "bg-primary" : "bg-secondary"
                }`}
              >
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
                    {v.detalle ? (
                      <p className="text-[15px] leading-6 text-dark">
                        {v.detalle}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`hidden gap-6 lg:grid ${
          active.grupos.length > 1
            ? "lg:grid-cols-2"
            : "lg:max-w-2xl lg:grid-cols-1"
        }`}
      >
        {active.grupos.map((grupo, idx) => (
          <article
            key={grupo.id}
            className="flex flex-col gap-5 rounded-[16px] border border-[#E8E4EC] bg-white p-6 shadow-[0_4px_20px_rgba(68,39,75,0.06)]"
          >
            <div className="flex items-center gap-3">
              <span
                className={`size-3 shrink-0 rounded-full ${
                  idx === 0 ? activeStyle.dot : "bg-primary"
                }`}
                aria-hidden
              />
              <h3 className="text-[18px] font-bold uppercase tracking-[0.04em] text-primary">
                {grupo.badge}
              </h3>
            </div>
            <ul className="flex flex-col gap-3">
              {grupo.vacunas.map((v) => (
                <li
                  key={`${grupo.id}-${v.nombre}`}
                  className="rounded-xl border border-[#E5E5E5] bg-white p-4"
                >
                  <p className="text-[16px] font-bold leading-[22px] text-accent">
                    {v.nombre}
                  </p>
                  {v.detalle ? (
                    <p className="mt-1 text-[14px] leading-[1.5] text-muted">
                      {v.detalle}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
