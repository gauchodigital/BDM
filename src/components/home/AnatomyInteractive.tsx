"use client";

import Image from "next/image";
import { useId, useState } from "react";

type LayerId = "craneo" | "meninges" | "cerebro";

const LAYERS: {
  id: LayerId;
  index: string;
  title: string;
  subtitle: string;
  badge?: string;
  dotClass: string;
  accent: string;
  rowActive: string;
  rowActiveMobile: string;
  diagramBg: string;
  diagramBgActive: string;
  diagramText: string;
  glow: string;
  heightPct: number;
}[] = [
  {
    id: "craneo",
    index: "01",
    title: "Cráneo",
    subtitle: "Protección ósea externa",
    dotClass: "bg-[#E8E4EC]",
    accent: "#503C77",
    rowActive: "bg-white",
    rowActiveMobile: "bg-[#EBE6F0]",
    diagramBg: "bg-[#E6E6E8]",
    diagramBgActive: "bg-[#CFCFD6]",
    diagramText: "text-[#503C77]",
    glow: "rgba(80,60,119,0.22)",
    heightPct: 22,
  },
  {
    id: "meninges",
    index: "02",
    title: "Meninges",
    subtitle: "3 capas de membrana protectora",
    badge: "SE INFLAMAN",
    dotClass: "bg-meninges",
    accent: "#6ECFF6",
    rowActive: "bg-white",
    rowActiveMobile: "bg-[#CFEFFB]",
    diagramBg: "bg-[#B9E5F8]",
    diagramBgActive: "bg-[#6ECFF6]",
    diagramText: "text-white",
    glow: "rgba(110,207,246,0.35)",
    heightPct: 18,
  },
  {
    id: "cerebro",
    index: "03",
    title: "Cerebro",
    subtitle: "Órgano afectado por la inflamación",
    dotClass: "bg-cerebro",
    accent: "#E8A898",
    rowActive: "bg-white",
    rowActiveMobile: "bg-[#F5D5CC]",
    diagramBg: "bg-[#F5CFC4]",
    diagramBgActive: "bg-[#E8A898]",
    diagramText: "text-white",
    glow: "rgba(232,168,152,0.35)",
    heightPct: 60,
  },
];

function getLayer(id: LayerId) {
  return LAYERS.find((l) => l.id === id) ?? LAYERS[1];
}

function LayerStack({
  active,
  onSelect,
  className = "",
  interactive = false,
}: {
  active: LayerId;
  onSelect: (id: LayerId) => void;
  className?: string;
  interactive?: boolean;
}) {
  const layer = getLayer(active);

  return (
    <div className={`relative mx-auto aspect-square w-full ${className}`}>
      <div
        className="pointer-events-none absolute inset-[-12%] rounded-full opacity-80 blur-2xl transition-[background] duration-500"
        style={{ background: `radial-gradient(circle, ${layer.glow} 0%, transparent 70%)` }}
        aria-hidden
      />
      <div className="absolute inset-0 overflow-hidden rounded-full border border-[#7A78BB]/80 bg-[#7A78BB] shadow-[0_12px_32px_rgba(80,60,119,0.18)]">
        <div className="flex h-full flex-col gap-1">
          <div className="min-h-[9%] shrink-0" aria-hidden />
          {LAYERS.map((item) => {
            const selected = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                onMouseEnter={interactive ? () => onSelect(item.id) : undefined}
                aria-pressed={selected}
                className={`relative flex min-h-0 w-full items-center justify-center overflow-hidden transition-all duration-500 ease-out ${
                  selected ? item.diagramBgActive : item.diagramBg
                } ${interactive ? "cursor-pointer" : ""} ${
                  selected
                    ? "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]"
                    : interactive
                      ? "lg:hover:brightness-[1.04]"
                      : ""
                }`}
                style={{ flex: `${item.heightPct} 1 0%` }}
              >
                {!selected ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-white/35 transition-opacity duration-300"
                  />
                ) : null}
                <span
                  className={`relative z-10 text-[13px] uppercase tracking-[0.08em] transition-all duration-300 sm:text-[14px] ${item.diagramText} ${
                    selected
                      ? "font-extrabold drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]"
                      : "font-bold opacity-45"
                  }`}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AnatomyMobile({ className = "" }: { className?: string }) {
  const [active, setActive] = useState<LayerId>("meninges");
  const labelId = useId();

  return (
    <div className={className}>
      <ul
        className="overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white"
        role="listbox"
        aria-labelledby={labelId}
        aria-activedescendant={`${labelId}-${active}`}
      >
        <span id={labelId} className="sr-only">
          Capas del cráneo
        </span>
        {LAYERS.map((item, i) => {
          const selected = active === item.id;
          return (
            <li key={item.id} role="none">
              <button
                type="button"
                role="option"
                id={`${labelId}-${item.id}`}
                aria-selected={selected}
                onClick={() => setActive(item.id)}
                className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-all duration-300 ${
                  i > 0 ? "border-t border-[#E5E5E5]" : ""
                } ${
                  selected
                    ? `${item.rowActiveMobile} ring-1 ring-inset ring-[#7A78BB]/25`
                    : "bg-white opacity-50 hover:opacity-75"
                }`}
              >
                <span
                  className={`mt-0.5 size-8 shrink-0 rounded-full box-border transition-all duration-300 ${item.dotClass} ${
                    selected
                      ? "scale-110 border-2 border-solid border-[#7A78BB] shadow-[0_0_0_3px_rgba(122,120,187,0.2)]"
                      : item.id === "meninges"
                        ? "scale-95 border border-solid border-meninges-stroke opacity-70"
                        : "scale-95 border border-solid border-transparent opacity-70"
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-bold leading-snug text-[#442748]">
                      {item.title}
                    </p>
                    {item.badge ? (
                      <span className="ml-auto shrink-0 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[13px] leading-snug text-muted">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mx-auto mt-8 flex w-full max-w-[360px] items-center justify-center gap-2 sm:max-w-[430px] sm:gap-3">
        <div className="flex w-[50%] shrink-0 items-center justify-center">
          <Image
            src="/home/anatomia-cerebro.webp"
            alt="Corte del cráneo, las meninges y el cerebro."
            width={800}
            height={900}
            className="h-auto w-[88%] max-w-[190px] object-contain sm:max-w-[210px]"
            sizes="(max-width: 640px) 170px, 210px"
          />
        </div>
        <div className="flex w-[50%] shrink-0 items-center justify-center">
          <LayerStack
            active={active}
            onSelect={setActive}
            className="max-w-[164px] sm:max-w-[194px]"
          />
        </div>
      </div>
    </div>
  );
}

function AnatomyDesktop({ className = "" }: { className?: string }) {
  const [active, setActive] = useState<LayerId>("meninges");
  const labelId = useId();
  const current = getLayer(active);

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-[#D8D0E6] bg-[linear-gradient(155deg,#F7F3FB_0%,#FFFFFF_38%,#F2ECF8_100%)] shadow-[0_20px_60px_rgba(80,60,119,0.16),0_4px_16px_rgba(80,60,119,0.08)] ring-1 ring-[#7A78BB]/10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#7A78BB]/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex items-center justify-between gap-4 border-b border-[#E5DDF0] bg-white/50 px-6 py-5 backdrop-blur-sm">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#DD876E]">
            Anatomía interactiva
          </p>
          <p className="mt-1.5 text-[16px] font-bold text-[#503C77] xl:text-[17px]">
            Explorá las capas del sistema nervioso
          </p>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-[#E8E2F0] bg-white px-3.5 py-2 text-[11px] font-semibold text-[#503C77] shadow-sm xl:inline-flex">
          <span className="size-2 animate-pulse rounded-full bg-[#7A78BB]" />
          Pasá el cursor o hacé clic
        </span>
      </div>

      <div className="relative grid grid-cols-[minmax(0,236px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,252px)_minmax(0,1fr)]">
        <div
          className="border-r border-[#E5DDF0] bg-[#FAF8FD]/90 p-4"
          role="listbox"
          aria-labelledby={labelId}
          aria-activedescendant={`${labelId}-${active}`}
        >
          <span id={labelId} className="sr-only">
            Capas del cráneo
          </span>
          <div className="space-y-2">
            {LAYERS.map((item) => {
              const selected = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  id={`${labelId}-${item.id}`}
                  aria-selected={selected}
                  onClick={() => setActive(item.id)}
                  onMouseEnter={() => setActive(item.id)}
                  className={`group relative w-full overflow-hidden rounded-[14px] px-4 py-3.5 text-left transition-all duration-300 ${
                    selected
                      ? "bg-white shadow-[0_10px_28px_rgba(80,60,119,0.14)]"
                      : "bg-transparent hover:bg-white/80"
                  }`}
                >
                  <span
                    className="absolute inset-y-2 left-0 w-[3px] rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: item.accent,
                      opacity: selected ? 1 : 0,
                      transform: selected ? "scaleY(1)" : "scaleY(0.4)",
                    }}
                    aria-hidden
                  />
                  <div className="flex items-start gap-3 pl-1">
                    <span
                      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300 ${
                        selected
                          ? "bg-[#503C77] text-white"
                          : "bg-[#F0ECF4] text-[#7A78BB] group-hover:bg-[#E8E2EF]"
                      }`}
                    >
                      {item.index}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`text-[14px] font-bold leading-snug transition-colors ${
                            selected ? "text-[#442748]" : "text-[#442748]/65"
                          }`}
                        >
                          {item.title}
                        </p>
                        {item.badge ? (
                          <span className="ml-auto shrink-0 rounded-md bg-[#DD876E] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                      <p
                        className={`mt-0.5 text-[12px] leading-snug transition-colors ${
                          selected ? "text-[#6B6570]" : "text-[#6B6570]/70"
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative flex min-h-[320px] flex-col justify-between p-6 xl:min-h-[360px] xl:p-7">
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at 58% 42%, ${current.glow} 0%, transparent 62%)`,
            }}
            aria-hidden
          />

          <div className="relative flex flex-1 items-center justify-center gap-6 xl:gap-9">
            <div className="flex w-[48%] max-w-[240px] items-center justify-center xl:max-w-[260px]">
              <Image
                src="/home/anatomia-cerebro.webp"
                alt=""
                width={800}
                height={900}
                className="h-auto w-full object-contain transition-transform duration-500 ease-out"
                style={{
                  transform: active === "cerebro" ? "scale(1.03)" : "scale(1)",
                  filter:
                    active === "meninges"
                      ? "drop-shadow(0 8px 20px rgba(110,207,246,0.25))"
                      : "drop-shadow(0 8px 20px rgba(80,60,119,0.12))",
                }}
                sizes="260px"
                aria-hidden
              />
            </div>
            <div className="flex w-[44%] max-w-[210px] items-center justify-center xl:max-w-[228px]">
              <LayerStack
                active={active}
                onSelect={setActive}
                interactive
                className="max-w-[210px] xl:max-w-[228px]"
              />
            </div>
          </div>

          <div className="relative mt-5 rounded-[14px] border border-[#E5DDF0] bg-white px-5 py-4 shadow-[0_4px_16px_rgba(80,60,119,0.06)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#DD876E]">
              Capa seleccionada
            </p>
            <p className="mt-1.5 text-[16px] font-bold text-[#503C77]">
              {current.title}
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-[#6B6570]">
              {current.subtitle}
              {current.badge ? (
                <span className="ml-1.5 inline-flex rounded bg-[#FDF0EC] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#DD876E]">
                  {current.badge}
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnatomyInteractive({ className = "" }: { className?: string }) {
  return (
    <>
      <AnatomyMobile className={`lg:hidden ${className}`} />
      <AnatomyDesktop className={`hidden lg:block ${className}`} />
    </>
  );
}
