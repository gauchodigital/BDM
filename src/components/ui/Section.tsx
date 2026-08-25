import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "white" | "cream" | "light" | "primary" | "dark";
}) {
  const tones = {
    white: "bg-white",
    cream: "bg-cream",
    light: "bg-light",
    primary: "bg-primary text-on-primary",
    dark: "bg-dark text-on-dark",
  };

  return (
    <section id={id} className={`section-pad ${tones[tone]} ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  subtitle,
  light = false,
  className = "",
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`mb-8 md:mb-10 max-w-2xl ${className}`}>
      <h2
        className={`text-[1.75rem] md:text-[2.5rem] leading-tight ${
          light ? "text-white" : "text-primary"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-[1.65] ${
            light ? "text-white/80" : "text-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
