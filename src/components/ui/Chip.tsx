import type { CausaTagColor } from "@/lib/causasData";

/** Specs Figma badge (ej. POCO FRECUENTE): h≈28, radius 99, fill según tipo */
const colorMap: Record<CausaTagColor, string> = {
  accent: "bg-[#DD876E] text-[#442748]", // MÁS GRAVE
  primary: "bg-[#503C77] text-white", // MÁS FRECUENTE
  secondary: "bg-[#6D6AAE] text-white", // POCO FRECUENTE
  light: "bg-[#6D6AAE] text-white",
};

export function Chip({
  label,
  color = "primary",
  className = "",
}: {
  label: string;
  color?: CausaTagColor;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex h-7 w-fit shrink-0 items-center justify-center self-start rounded-[99px] px-3 text-[11px] font-bold uppercase leading-none tracking-[0.04em] ${colorMap[color]} ${className}`}
    >
      {label}
    </span>
  );
}
