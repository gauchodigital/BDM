import Link from "next/link";
import { LogoManito } from "@/components/layout/LogoManito";
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
      className={`inline-flex items-center ${className}`}
      aria-label={SITE_NAME}
    >
      <LogoManito
        variant={variant === "dark" ? "purple" : "white"}
        className="h-9 w-auto"
      />
    </Link>
  );
}
