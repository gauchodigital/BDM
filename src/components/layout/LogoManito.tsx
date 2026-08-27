import Image from "next/image";

/** Manito BDM — PNG exportado de Figma (no SVG recreado). */
export function LogoManito({
  variant = "white",
  className = "h-10 w-10",
  priority = false,
  width = 86,
  height = 94,
}: {
  variant?: "white" | "purple";
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  const src =
    variant === "white"
      ? "/brand/logo-manito-white.png"
      : "/brand/logo-manito.png";

  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      priority={priority}
      className={`object-contain ${className}`}
      aria-hidden
    />
  );
}
