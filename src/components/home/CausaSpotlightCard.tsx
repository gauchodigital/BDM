"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import type { CausaData, CausaTagColor } from "@/lib/causasData";

const SPOTLIGHT: Record<CausaTagColor, string> = {
  accent: "rgba(221,135,110,0.22)",
  primary: "rgba(80,60,119,0.2)",
  secondary: "rgba(109,106,174,0.22)",
  light: "rgba(109,106,174,0.22)",
};

const CARD_THEME: Record<
  CausaTagColor,
  { shell: string; ring: string; ctaHover: string }
> = {
  accent: {
    shell:
      "border-[#F0C4B8]/60 bg-gradient-to-br from-[#FDF0EC] via-white to-white",
    ring: "group-hover:ring-[#DD876E]/20",
    ctaHover: "group-hover:text-[#DD876E]",
  },
  primary: {
    shell:
      "border-[#D8D4DE]/80 bg-gradient-to-br from-[#F3F0F8] via-white to-white",
    ring: "group-hover:ring-primary/15",
    ctaHover: "group-hover:text-[#DD876E]",
  },
  secondary: {
    shell:
      "border-[#D8D4DE]/80 bg-gradient-to-br from-[#F0EDF8] via-white to-white",
    ring: "group-hover:ring-secondary/20",
    ctaHover: "group-hover:text-secondary",
  },
  light: {
    shell:
      "border-[#D8D4DE]/80 bg-gradient-to-br from-[#F0EDF8] via-white to-white",
    ring: "group-hover:ring-secondary/20",
    ctaHover: "group-hover:text-secondary",
  },
};

const ACCENT_BAR: Record<CausaTagColor, string> = {
  accent: "bg-[#DD876E]",
  primary: "bg-primary",
  secondary: "bg-secondary",
  light: "bg-secondary",
};

export function CausaSpotlightCard({
  causa,
  ctaLabel = "Aprendé más",
  showExternalIcon = false,
}: {
  causa: CausaData;
  ctaLabel?: string;
  showExternalIcon?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, visible: false });
  const theme = CARD_THEME[causa.tagColor];
  const glow = SPOTLIGHT[causa.tagColor];

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    });
  }, []);

  const onLeave = useCallback(() => {
    setSpot((s) => ({ ...s, visible: false }));
  }, []);

  return (
    <Link
      ref={ref}
      href={`/causas/${causa.slug}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border p-6 shadow-[0_4px_24px_rgba(80,60,119,0.07)] ring-1 ring-transparent transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(80,60,119,0.12)] ${theme.shell} ${theme.ring}`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${ACCENT_BAR[causa.tagColor]}`}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity: spot.visible ? 1 : 0,
          background: spot.visible
            ? `radial-gradient(circle 180px at ${spot.x}px ${spot.y}px, ${glow} 0%, transparent 70%)`
            : undefined,
        }}
      />

      <div className="relative z-[1] flex h-full flex-col gap-3 pl-1">
        <Chip label={causa.tagLabel} color={causa.tagColor} />
        <h3 className="text-[24px] font-extrabold leading-tight text-primary transition-colors duration-300 group-hover:text-[#442748] md:text-[26px] lg:text-[22px]">
          {causa.title}
        </h3>
        <p className="text-[14px] leading-[1.65] text-muted lg:flex-1">
          <RichText text={causa.description} />
        </p>
        <span
          className={`mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-2.5 ${theme.ctaHover}`}
        >
          {ctaLabel}
          {showExternalIcon ? (
            <span
              className="material-symbols-outlined text-[16px] leading-none"
              aria-hidden
            >
              open_in_new
            </span>
          ) : (
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}
