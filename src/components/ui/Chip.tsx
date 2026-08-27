import type { CausaTagColor } from "@/lib/causasData";

/** Badge secundario: más chico que el título de la causa */
const colorMap: Record<CausaTagColor, string> = {
  accent: "bg-[#DD876E] text-white", // MÁS GRAVE
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
      className={`inline-flex h-6 w-fit shrink-0 items-center justify-center self-start rounded-full px-2.5 text-[10px] font-bold uppercase leading-none tracking-[0.06em] ${colorMap[color]} ${className}`}
    >
      {label}
    </span>
  );
}
