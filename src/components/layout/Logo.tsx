import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/siteLinks";

export function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label={SITE_NAME}
    >
      <Image
        src="/brand/logo-manito-white.png"
        alt=""
        width={58}
        height={64}
        className={`h-8 w-auto ${variant === "dark" ? "brightness-0 saturate-100" : ""}`}
        style={
          variant === "dark"
            ? { filter: "brightness(0) saturate(100%) invert(22%) sepia(24%) saturate(1200%) hue-rotate(220deg)" }
            : undefined
        }
      />
    </Link>
  );
}
