"use client";

import Image from "next/image";
import { useId, useState } from "react";

type LayerId = "craneo" | "meninges" | "cerebro";

const LAYERS: {
  id: LayerId;
  title: string;
  subtitle: string;
  badge?: string;
  dotClass: string;
  rowActive: string;
  diagramBg: string;
  diagramBgActive: string;
  diagramText: string;
  /** Vertical share of the circular stack (percent). */
  heightPct: number;
}[] = [
  {
    id: "craneo",
    title: "Cráneo",
    subtitle: "Protección ósea externa",
    dotClass: "bg-[#E8E4EC]",
    rowActive: "bg-[#EBE6F0]",
    diagramBg: "bg-[#E6E6E8]",
    diagramBgActive: "bg-[#CFCFD6]",
    diagramText: "text-[#503C77]",
    heightPct: 22,
  },
  {
    id: "meninges",
    title: "Meninges",
    subtitle: "3 capas de membrana protectora",
    badge: "SE INFLAMAN",
    dotClass: "bg-meninges",
    rowActive: "bg-[#CFEFFB]",
    diagramBg: "bg-[#B9E5F8]",
    diagramBgActive: "bg-[#6ECFF6]",
    diagramText: "text-white",
    heightPct: 18,
  },
  {
    id: "cerebro",
    title: "Cerebro",
    subtitle: "Órgano afectado por la inflamación",
    dotClass: "bg-cerebro",
    rowActive: "bg-[#F5D5CC]",
    diagramBg: "bg-[#F5CFC4]",
    diagramBgActive: "bg-[#E8A898]",
    diagramText: "text-white",
    heightPct: 60,
  },
];

function LayerStack({
  active,
  onSelect,
  className = "",
}: {
  active: LayerId;
  onSelect: (id: LayerId) => void;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto aspect-square w-full ${className}`}>
      <div className="absolute inset-0 overflow-hidden rounded-full border border-solid border-[#7A78BB] bg-[#7A78BB]">
        <div className="flex h-full flex-col gap-1">
          {/* Espacio superior — mismo color que el borde */}
          <div className="min-h-[9%] shrink-0" aria-hidden />
          {LAYERS.map((layer) => {
            const selected = active === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => onSelect(layer.id)}
                aria-pressed={selected}
                className={`relative flex min-h-0 w-full items-center justify-center overflow-hidden transition-all duration-300 ease-out ${
                  selected ? layer.diagramBgActive : layer.diagramBg
                } ${selected ? "shadow-[inset_0_0_0_2px_rgba(122,120,187,0.45)]" : ""}`}
                style={{ flex: `${layer.heightPct} 1 0%` }}
              >
                {!selected ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-white/35 transition-opacity duration-300"
                  />
                ) : null}
                <span
                  className={`relative z-10 text-[13px] uppercase tracking-[0.08em] transition-all duration-300 sm:text-[14px] ${layer.diagramText} ${
                    selected
                      ? "font-extrabold drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]"
                      : "font-bold opacity-45"
                  }`}
                >
                  {layer.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AnatomyInteractive({ className = "" }: { className?: string }) {
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
                    ? `${item.rowActive} ring-1 ring-inset ring-[#7A78BB]/25`
                    : "bg-white opacity-45 hover:opacity-70"
                }`}
              >
                <span
                  className={`mt-0.5 size-8 shrink-0 rounded-full box-border transition-all duration-300 ${item.dotClass} ${
                    selected
                      ? "scale-110 border-2 border-solid border-[#7A78BB] shadow-[0_0_0_3px_rgba(122,120,187,0.2)]"
                      : item.id === "meninges"
                        ? "scale-95 border border-solid border-meninges-stroke opacity-60"
                        : "scale-95 border border-solid border-transparent opacity-60"
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-bold leading-snug text-[#442748]">
                      {item.title}
                    </p>
                    {item.badge ? (
                      <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
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
          <LayerStack active={active} onSelect={setActive} className="max-w-[164px] sm:max-w-[194px]" />
        </div>
      </div>
    </div>
  );
}
