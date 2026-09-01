"use client";

import { useState } from "react";
import type { VacunaEtapa } from "@/lib/vacunacionData";

const ETAPA_THEME: Record<string, string> = {
  embarazadas: "bg-[#F8E4DE] text-[#8B4A3C]",
  "recien-nacidos": "bg-[#D6E4EF] text-primary",
  "hasta-1-anio": "bg-[#E8E2F0] text-primary",
  "hasta-2-anios": "bg-[#D4EBE8] text-[#2F6B64]",
  "nacidos-2021": "bg-[#F5EDC8] text-[#6B5A1A]",
  "nacidos-2018": "bg-[#EDEAF2] text-primary",
  "jovenes-adultos": "bg-[#E8E8EC] text-dark",
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

function VacunaCards({
  vacunas,
  columns = false,
}: {
  vacunas: VacunaEtapa["grupos"][number]["vacunas"];
  columns?: boolean;
}) {
  return (
    <ul
      className={`flex flex-col gap-2 ${columns ? "lg:grid lg:grid-cols-2 lg:gap-3" : ""}`}
    >
      {vacunas.map((v) => (
        <li
          key={v.nombre}
          className="rounded-[12px] border border-[#E8E4EC] bg-white px-4 py-3"
        >
          <p className="text-[15px] font-bold leading-snug text-accent lg:text-[16px]">
            {v.nombre}
          </p>
          {v.detalle ? (
            <p className="mt-0.5 text-[14px] leading-[1.45] text-muted">
              {v.detalle}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
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

  return (
    <div className="mt-8 flex flex-col gap-6 lg:mt-10">
      <p className="text-[11px] font-bold uppercase leading-normal tracking-[1.3px] text-muted">
        {selectLabel}
      </p>

      {/* Mobile tabs */}
      <div className="flex flex-wrap gap-2 lg:hidden">
        {etapas.map((etapa) => {
          const isActive = etapa.id === active.id;
          return (
            <button
              key={etapa.id}
              type="button"
              onClick={() => setActiveId(etapa.id)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-[22px] px-3 py-1.5 text-[13px] font-bold leading-[16.8px] transition-all duration-300 ${
                isActive
                  ? "scale-[1.03] bg-primary text-white shadow-[0_4px_14px_rgba(80,60,119,0.28)]"
                  : "border border-light bg-white text-dark/50 hover:text-dark/80"
              }`}
            >
              <span className="material-symbols-outlined text-[22px] leading-none">
                {etapa.icon}
              </span>
              <span>{chipLabel(etapa, false)}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop tabs — bandeja gris con píldoras de color */}
      <div className="hidden rounded-[14px] bg-[#F0EDF5] p-2.5 lg:block">
        <div className="flex flex-wrap gap-2" role="tablist">
          {etapas.map((etapa) => {
            const isActive = etapa.id === active.id;
            const theme = ETAPA_THEME[etapa.id] ?? "bg-white text-dark";

            return (
              <button
                key={etapa.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(etapa.id)}
                className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[12px] font-bold leading-tight transition-all duration-200 xl:text-[13px] ${
                  isActive
                    ? "bg-primary text-white shadow-[0_4px_14px_rgba(80,60,119,0.3)]"
                    : theme
                }`}
              >
                <span className="material-symbols-outlined text-[20px] leading-none xl:text-[22px]">
                  {etapa.icon}
                </span>
                <span>{chipLabel(etapa, true)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile content */}
      <div key={active.id} className="animate-fade-up flex flex-col gap-4 lg:hidden">
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
              <VacunaCards vacunas={grupo.vacunas} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop content — panel único con grilla 2 columnas */}
      <article
        key={`desktop-${active.id}`}
        className="animate-fade-up hidden rounded-[16px] border border-[#E8E4EC] bg-white p-6 shadow-[0_4px_24px_rgba(80,60,119,0.06)] lg:block xl:p-7"
      >
        {active.grupos.map((grupo, idx) => (
          <div
            key={grupo.id}
            className={
              idx > 0 ? "mt-8 border-t border-[#F0EDF5] pt-8" : undefined
            }
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                className="size-3 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <h3 className="text-[15px] font-bold uppercase tracking-[0.06em] text-primary xl:text-[16px]">
                {grupo.badge}
              </h3>
            </div>
            <VacunaCards vacunas={grupo.vacunas} columns />
          </div>
        ))}
      </article>
    </div>
  );
}
