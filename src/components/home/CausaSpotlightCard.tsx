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

const RING: Record<CausaTagColor, string> = {
  accent: "group-hover:ring-[#DD876E]/25",
  primary: "group-hover:ring-primary/20",
  secondary: "group-hover:ring-secondary/25",
  light: "group-hover:ring-secondary/25",
};

export function CausaSpotlightCard({ causa }: { causa: CausaData }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, visible: false });

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

  const glow = SPOTLIGHT[causa.tagColor];

  return (
    <Link
      ref={ref}
      href={`/causas/${causa.slug}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative flex h-full cursor-pointer flex-col gap-2.5 overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white p-5 shadow-[0_2px_12px_rgba(68,39,75,0.08)] ring-1 ring-transparent transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#D8D4DE] hover:shadow-[0_12px_32px_rgba(80,60,119,0.14)] ${RING[causa.tagColor]}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity: spot.visible ? 1 : 0,
          background: spot.visible
            ? `radial-gradient(circle 160px at ${spot.x}px ${spot.y}px, ${glow} 0%, transparent 70%)`
            : undefined,
        }}
      />

      <div className="relative z-[1] flex h-full flex-col gap-2.5">
        <Chip label={causa.tagLabel} color={causa.tagColor} />
        <h3 className="text-[26px] font-extrabold leading-tight text-primary transition-colors duration-300 group-hover:text-[#442748] lg:text-[22px]">
          {causa.title}
        </h3>
        <p className="text-[14px] leading-[1.6] text-muted lg:flex-1">
          <RichText text={causa.description} />
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-2.5 group-hover:text-[#DD876E]">
          Leer más
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
