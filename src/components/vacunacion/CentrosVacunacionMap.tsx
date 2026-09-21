"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import "./mapa-vacunatorios.css";

const MAPS_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  "AIzaSyBWMgpuf6kUK7eyheo1pUPx69nEhqMk86w";

declare global {
  interface Window {
    initVacunatoriosMap?: () => void;
    vacunatoriosMapInstance?: { map?: { getDiv?: () => HTMLElement } };
    google?: { maps?: { event?: { trigger: (map: unknown, name: string) => void } } };
  }
}

const DISCLAIMER_LINK_CLASS =
  "break-all text-accent underline underline-offset-2 hover:brightness-110";

function DisclaimerText({ text }: { text: string }): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (!/^https?:\/\//.test(part)) {
          return <span key={i}>{part}</span>;
        }
        const href = part.replace(/[.,;:]+$/, "");
        const trail = part.slice(href.length);
        return (
          <span key={i}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={DISCLAIMER_LINK_CLASS}
            >
              {href}
            </a>
            {trail}
          </span>
        );
      })}
    </>
  );
}

function FilterSelect({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
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
        {children}
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

const selectClassName =
  "h-[52px] w-full appearance-none rounded-lg border border-[#E5E5E5] bg-[#fafafa] py-2 pl-4 pr-10 text-[16px] tracking-[0.08px] text-dark shadow-[0_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-primary disabled:opacity-70";

export function CentrosVacunacionMap({
  eyebrow,
  title,
  body,
  paso1Label,
  placeholder,
  disclaimer,
}: {
  eyebrow: string;
  title: string;
  body: string;
  paso1Label: string;
  placeholder: string;
  disclaimer: string;
}) {
  const [showMap, setShowMap] = useState(false);
  const [step, setStep] = useState(1);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [showLocalidad, setShowLocalidad] = useState(false);
  const [showBarrio, setShowBarrio] = useState(false);
  const [showTipo, setShowTipo] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function startMap() {
      if (cancelled) return;
      if (window.vacunatoriosMapInstance) return;
      window.initVacunatoriosMap?.();
    }

    function loadScript(src: string, attr: string): Promise<void> {
      const existing = document.querySelector(`script[${attr}]`);
      if (existing) {
        return existing.getAttribute("data-loaded") === "1"
          ? Promise.resolve()
          : new Promise((resolve, reject) => {
              existing.addEventListener("load", () => resolve());
              existing.addEventListener("error", () => reject());
            });
      }
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.setAttribute(attr, "true");
        script.onload = () => {
          script.setAttribute("data-loaded", "1");
          resolve();
        };
        script.onerror = () => reject(new Error(src));
        document.body.appendChild(script);
      });
    }

    loadScript("/mapa/js/vacunatorios.js?v=menor-si", "data-bdm-vacunatorios")
      .then(() => {
        if (cancelled) return;
        if (window.google?.maps) {
          startMap();
          return;
        }
        const g = document.createElement("script");
        g.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&v=weekly&callback=initVacunatoriosMap`;
        g.async = true;
        g.defer = true;
        g.setAttribute("data-bdm-gmaps", "true");
        document.body.appendChild(g);
      })
      .catch((err) => {
        console.error("No se pudo cargar el mapa de vacunatorios", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!showMap) return;
    const map = window.vacunatoriosMapInstance?.map;
    if (map && window.google?.maps?.event) {
      window.setTimeout(() => {
        window.google?.maps?.event?.trigger(map, "resize");
      }, 80);
    }
  }, [showMap]);

  useEffect(() => {
    const ids = [
      "filtroProvincia",
      "filtroLocalidad",
      "filtroBarrio",
      "filtroTipo",
    ];
    const els = ids
      .map((id) => document.getElementById(id) as HTMLSelectElement | null)
      .filter((el): el is HTMLSelectElement => Boolean(el));

    const onChange = () => syncStep();
    els.forEach((el) => el.addEventListener("change", onChange));
    const attrObs = new MutationObserver(onChange);
    els.forEach((el) =>
      attrObs.observe(el, {
        childList: true,
        attributes: true,
        attributeFilter: ["disabled"],
      }),
    );

    const lista = document.getElementById("listaResultados");
    const listObs = new MutationObserver(() => {
      if (!lista) return;
      if (lista.querySelector(".sin-resultados")) {
        setResultCount(null);
        return;
      }
      const n = lista.querySelector(".counter-number")?.textContent;
      setResultCount(n ? Number(n) : null);
    });
    if (lista) listObs.observe(lista, { childList: true, subtree: true });

    const onCardClick = (e: Event) => {
      const card = (e.target as HTMLElement | null)?.closest?.(".card-vacunatorio");
      if (card) setShowMap(true);
    };
    lista?.addEventListener("click", onCardClick);

    return () => {
      els.forEach((el) => el.removeEventListener("change", onChange));
      attrObs.disconnect();
      listObs.disconnect();
      lista?.removeEventListener("click", onCardClick);
    };
  }, []);

  function syncStep() {
    const valueOf = (id: string) =>
      (document.getElementById(id) as HTMLSelectElement | null)?.value ?? "";
    const provincia = valueOf("filtroProvincia");
    const localidad = valueOf("filtroLocalidad");
    const barrioEl = document.getElementById("filtroBarrio") as HTMLSelectElement | null;
    const barrioHasOptions =
      Boolean(barrioEl) &&
      !barrioEl!.disabled &&
      barrioEl!.options.length > 1;

    const barrio = valueOf("filtroBarrio");

    setShowLocalidad(Boolean(provincia));
    setShowBarrio(Boolean(provincia && localidad && barrioHasOptions));
    setShowTipo(
      Boolean(provincia && localidad && (!barrioHasOptions || barrio)),
    );

    if (!provincia) setStep(1);
    else if (!localidad) setStep(2);
    else if (barrioHasOptions && !barrio) setStep(3);
    else setStep(4);
  }

  function handleBuscar() {
    const provincia = document.getElementById("filtroProvincia") as HTMLSelectElement | null;
    if (!provincia?.value) {
      provincia?.focus();
      return;
    }
    document.getElementById("centros-resultados-titulo")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const disclaimerParagraphs = disclaimer.split(/\n\n+/).filter(Boolean);
  const progress = (step / 4) * 100;

  return (
    <section className="bg-primary">
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-14 md:px-8 md:pb-16 md:pt-16">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-14">
          <Reveal>
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
              <div className="mt-10 hidden max-w-md space-y-3 rounded-[12px] bg-[#3D2E5C] p-5 text-[10px] leading-[14px] text-white/85 lg:mt-12 lg:block">
                {disclaimerParagraphs.map((p) => (
                  <p key={p.slice(0, 48)}>
                    <DisclaimerText text={p} />
                  </p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} from="right">
            <div
              className="lg:rounded-[16px] lg:bg-white lg:p-8 lg:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
              onChange={syncStep}
            >
              <div className="mb-4 lg:mb-0">
                <p className="hidden text-[12px] font-bold uppercase tracking-[0.08em] text-muted lg:block">
                  Paso {step} de 4: selección
                </p>
                <div
                  className="h-[3px] w-full overflow-hidden rounded-full bg-white/35 lg:mt-3 lg:h-1.5 lg:bg-[#E8E4EC]"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={4}
                  aria-valuenow={step}
                  aria-label="Progreso del buscador de centros"
                >
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-6">
                <FilterSelect id="filtroProvincia" label={paso1Label}>
                  <select id="filtroProvincia" className={selectClassName} required>
                    <option value="">{placeholder}</option>
                  </select>
                </FilterSelect>
                <div className={showLocalidad ? "" : "hidden"}>
                  <FilterSelect id="filtroLocalidad" label="Paso 2: elegí tu localidad">
                    <select id="filtroLocalidad" className={selectClassName}>
                      <option value="">Todas las localidades</option>
                    </select>
                  </FilterSelect>
                </div>
                <div className={showBarrio ? "" : "hidden"}>
                  <FilterSelect id="filtroBarrio" label="Paso 3: elegí tu barrio">
                    <select id="filtroBarrio" className={selectClassName}>
                      <option value="">Todos los barrios</option>
                    </select>
                  </FilterSelect>
                </div>
                <div className={showTipo ? "" : "hidden"}>
                  <FilterSelect id="filtroTipo" label="Paso 4: elegí dónde querés vacunarte">
                    <select id="filtroTipo" className={selectClassName}>
                      <option value="">Seleccioná un tipo</option>
                    </select>
                  </FilterSelect>
                </div>
                <button
                  type="button"
                  onClick={handleBuscar}
                  className="inline-flex h-[52px] w-full items-center justify-center rounded-lg bg-accent text-[15px] font-bold uppercase tracking-wide text-white transition hover:brightness-105 lg:mt-2"
                >
                  Buscar centros
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-12 lg:mt-16">
          <div id="centros-resultados" className="relative flex flex-col gap-5">
            <div
              id="centros-resultados-titulo"
              className="flex scroll-mt-36 flex-wrap items-center gap-3"
            >
              <h3 className="text-[22px] font-bold leading-7 text-white md:text-[28px]">
                Resultados
              </h3>
              {resultCount != null ? (
                <span className="inline-flex rounded-full bg-accent px-3 py-1 text-[13px] font-bold text-on-accent">
                  {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
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

            <div
              className={
                showMap
                  ? "overflow-hidden rounded-xl bg-white"
                  : "pointer-events-none absolute left-[-9999px] h-[280px] w-[280px] overflow-hidden opacity-0"
              }
            >
              <div id="mapa" />
            </div>

            <div id="listaResultados" className="lista-resultados">
              <div className="loading">Cargando vacunatorios...</div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 max-w-3xl space-y-3 text-[10px] leading-[14px] text-white/85 lg:hidden">
          {disclaimerParagraphs.map((p) => (
            <p key={`mobile-${p.slice(0, 48)}`}>
              <DisclaimerText text={p} />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
