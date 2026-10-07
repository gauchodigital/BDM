import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { TRACK } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "cta" | "ghost" | "onPrimary";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:brightness-110 border border-transparent",
  secondary:
    "bg-white text-primary border border-primary hover:bg-primary/5",
  cta: "bg-accent text-on-accent hover:brightness-105 border border-transparent",
  ghost: "bg-transparent text-dark underline-offset-4 hover:underline border-0 px-0",
  onPrimary:
    "bg-white text-primary border border-white hover:bg-white/90",
};

type Common = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  trackEvent?: string;
  trackLocation?: string;
};

type ButtonAsButton = Common &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  external?: boolean;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    children,
    className = "",
    trackEvent,
    trackLocation,
  } = props;

  const base =
    `inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-medium font-[family-name:var(--font-body)] transition-all active:scale-[0.98] ${TRACK.ctaClass} ${variantClass[variant]} ${className}`;

  const dataAttrs = {
    ...(trackEvent ? { "data-track": trackEvent } : {}),
    ...(trackLocation ? { "data-location": trackLocation } : {}),
  };

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (external || href.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={base}
          {...dataAttrs}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={base} {...dataAttrs}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={base} {...dataAttrs} {...rest}>
      {children}
    </button>
  );
}
