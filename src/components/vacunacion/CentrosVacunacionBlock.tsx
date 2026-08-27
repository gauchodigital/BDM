"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  TIPOS_VACUNATORIO,
  barriosDe,
  filtrarCentros,
  localidadesDe,
  mapsDirectionsUrl,
  mapsEmbedQuery,
  mapsSearchUrl,
  type CentroVacunacion,
} from "@/lib/centrosData";

function DisclaimerText({ text }: { text: string }): ReactNode {
  const parts = text.split(/(hacé click acá\.?)/i);
  return (
    <>
      {parts.map((part, i) => {
        if (/^hacé click acá\.?$/i.test(part)) {
          return (
            <Link
              key={i}
              href="/contacto"
              className="underline underline-offset-2 hover:opacity-90"
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function SelectField({
  id,
  label,
  value,
  placeholder,
  options,
  allowEmpty = true,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  options: string[];
  allowEmpty?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[16px] font-normal leading-normal tracking-[0.08px] text-white lg:text-[15px] lg:font-semibold lg:text-dark"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          disabled={disabled}
          className="h-[52px] w-full appearance-none rounded-lg border border-[#E5E5E5] bg-[#fafafa] py-2 pl-4 pr-10 text-[16px] tracking-[0.08px] text-dark shadow-[0_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-primary disabled:opacity-70"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {allowEmpty ? <option value="">{placeholder}</option> : null}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/vacunacion/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          className="pointer-events-none absolute right-2 top-1/2 size-6 -translate-y-1/2"
        />
      </div>
    </div>
  );
}

export function CentrosVacunacionBlock({
  eyebrow,
  title,
  body,
  paso1Label,
  placeholder,
  provincias,
  disclaimer,
  centros,
}: {
  eyebrow: string;
  title: string;
  body: string;
  paso1Label: string;
  placeholder: string;
  provincias: string[];
  disclaimer: string;
  centros: CentroVacunacion[];
}) {
  const [provincia, setProvincia] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [barrio, setBarrio] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [showMap, setShowMap] = useState(false);
  const [searched, setSearched] = useState(false);

  const localidades = useMemo(
    () => localidadesDe(centros, provincia),
    [centros, provincia],
  );
  const barrios = useMemo(
    () => barriosDe(centros, provincia, localidad),
    [centros, provincia, localidad],
  );
  const resultados = useMemo(
    () => filtrarCentros(centros, { provincia, localidad, barrio, tipo }),
    [centros, provincia, localidad, barrio, tipo],
  );

  const disclaimerParagraphs = disclaimer.split(/\n\n+/).filter(Boolean);
  const mapQuery = mapsEmbedQuery(provincia, localidad);

  const needsBarrio = Boolean(localidad && barrios.length > 0);
  const totalSteps = 4;
  let currentStep = 1;
  if (provincia) currentStep = 2;
  if (localidad) currentStep = needsBarrio && !barrio ? 3 : 4;
  const progress = (currentStep / totalSteps) * 100;

  function handleProvincia(value: string) {
    setProvincia(value);
    setLocalidad("");
    setBarrio("");
    setTipo("Todos");
    setShowMap(false);
    setSearched(false);
  }

  function handleLocalidad(value: string) {
    setLocalidad(value);
    setBarrio("");
    setTipo("Todos");
    setShowMap(false);
    setSearched(false);
  }

  function handleBuscar() {
    if (!provincia) {
      document.getElementById("provincia-vacunacion")?.focus();
      return;
    }
    if (!localidad) {
      document.getElementById("localidad-vacunacion")?.focus();
      return;
    }
    setSearched(true);
    document.getElementById("centros-resultados")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const showResults = searched && Boolean(localidad);

  const formInner = (
    <div className="flex flex-col gap-6 lg:gap-6">
      <SelectField
        id="provincia-vacunacion"
        label={paso1Label}
        value={provincia}
        placeholder={placeholder}
        options={provincias}
        onChange={handleProvincia}
      />

      {provincia ? (
        <SelectField
          id="localidad-vacunacion"
          label="Paso 2: elegí tu localidad"
          value={localidad}
          placeholder="Seleccioná una localidad"
          options={localidades}
          onChange={handleLocalidad}
        />
      ) : null}

      {localidad && barrios.length > 0 ? (
        <SelectField
          id="barrio-vacunacion"
          label="Paso 3: elegí tu barrio"
          value={barrio}
          placeholder="Seleccioná un barrio"
          options={barrios}
          onChange={setBarrio}
        />
      ) : null}

      {localidad ? (
        <SelectField
          id="tipo-vacunacion"
          label="Paso 4: elegí dónde querés vacunarte"
          value={tipo}
          allowEmpty={false}
          options={["Todos", ...TIPOS_VACUNATORIO]}
          onChange={setTipo}
        />
      ) : null}

      <button
        type="button"
        onClick={handleBuscar}
        className="inline-flex h-[52px] w-full items-center justify-center rounded-lg bg-accent text-[15px] font-bold uppercase tracking-wide text-white transition hover:brightness-105 lg:mt-2"
      >
        Buscar centros
      </button>
    </div>
  );

  return (
    <section className="bg-primary">
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-14 md:px-8 md:pb-14 md:pt-16">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-14">
          {/* Copy */}
          <div className="flex flex-col lg:h-full">
            <p className="text-[10px] font-semibold uppercase leading-[16.8px] tracking-[0.13px] text-accent lg:text-[11px] lg:font-bold lg:tracking-[0.12em]">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-[28px] font-black leading-8 tracking-[0.07px] text-[#feeafa] lg:mt-3 lg:text-[40px] lg:leading-[1.1] lg:tracking-[0.02em] lg:text-white">
              {title}
            </h2>
            <p className="mt-4 text-[16px] leading-normal tracking-[0.08px] text-white lg:max-w-md lg:leading-[1.6] lg:text-white/90">
              {body}
            </p>

            <div className="mt-8 hidden max-w-md space-y-3 rounded-[12px] bg-[#3D2E5C] p-5 text-[10px] leading-[14px] text-white/85 lg:mt-auto lg:block">
              {disclaimerParagraphs.map((p) => (
                <p key={p.slice(0, 48)}>
                  <DisclaimerText text={p} />
                </p>
              ))}
            </div>
          </div>

          {/* Form: mobile on purple; desktop white card */}
          <div className="lg:rounded-[16px] lg:bg-white lg:p-8 lg:shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
            <div className="mb-4 lg:mb-0">
              <p className="hidden text-[12px] font-bold uppercase tracking-[0.08em] text-muted lg:block">
                Paso {currentStep} de {totalSteps}: selección
              </p>
              <div
                className="h-[3px] w-full overflow-hidden rounded-full bg-white/35 lg:mt-3 lg:h-1.5 lg:bg-[#E8E4EC]"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-valuenow={currentStep}
                aria-label="Progreso del buscador de centros"
              >
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 lg:mt-8">{formInner}</div>
          </div>
        </div>

        <div id="centros-resultados" className="mt-12 scroll-mt-24 lg:mt-16">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-[22px] font-bold leading-7 text-white md:text-[28px]">
                Resultados
              </h3>
              {showResults ? (
                <span className="inline-flex rounded-full bg-accent px-3 py-1 text-[13px] font-bold text-on-accent">
                  {resultados.length}{" "}
                  {resultados.length === 1 ? "resultado" : "resultados"}
                </span>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setShowMap((v) => !v)}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-white px-4 py-2.5 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[20px] leading-none">
                map
              </span>
              {showMap ? "Ocultar mapa" : "Mostrar mapa"}
            </button>

            {showMap ? (
              <div className="overflow-hidden rounded-xl bg-white">
                <iframe
                  title="Mapa de centros de vacunación"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=12&output=embed`}
                  className="h-[280px] w-full border-0 md:h-[380px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}

            {showResults && resultados.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {resultados.map((centro) => (
                  <li
                    key={centro.id}
                    className="flex flex-col gap-3 rounded-xl bg-white p-5"
                  >
                    <div>
                      <p className="text-[16px] font-bold leading-snug text-primary">
                        {centro.nombre}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {centro.tipo}
                      </p>
                    </div>
                    <p className="flex items-start gap-2 text-[14px] leading-snug text-dark">
                      <span className="material-symbols-outlined mt-0.5 text-[18px] leading-none text-muted">
                        location_on
                      </span>
                      {centro.direccion}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-1">
                      <a
                        href={mapsDirectionsUrl(centro)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary underline underline-offset-2"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none text-accent">
                          location_on
                        </span>
                        Cómo llegar
                      </a>
                      <a
                        href={mapsSearchUrl(centro)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary underline underline-offset-2"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none text-accent">
                          location_on
                        </span>
                        Ver en el mapa
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {showResults && resultados.length === 0 ? (
              <p className="text-[15px] text-white/80">
                No encontramos centros con esos filtros. Probá otra localidad o
                tipo.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-16 lg:hidden md:px-8">
        <div className="max-w-3xl space-y-3 text-[10px] leading-[14px] text-white">
          {disclaimerParagraphs.map((p) => (
            <p key={p.slice(0, 48)}>
              <DisclaimerText text={p} />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
