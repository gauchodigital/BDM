import type { ReactNode } from "react";

/**
 * Negritas **así** y citas [1] / [1,3] → <sup>.
 */
export function RichText({
  text,
  className = "",
  strongClassName = "font-semibold text-[#442748]",
  citeClassName = "ml-0.5 text-[0.85em] font-[inherit] leading-none text-[#503C77]",
}: {
  text: string;
  className?: string;
  /** Classes for `**bold**` spans (default: Figma “oscuro”). */
  strongClassName?: string;
  /** Classes for citation superscripts like [1]. */
  citeClassName?: string;
}): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[\d+(?:[.,]\d+)*\])/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className={strongClassName}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        const cite = part.match(/^\[(\d+(?:[.,]\d+)*)\]$/);
        if (cite) {
          return (
            <sup key={i} className={citeClassName}>
              {cite[1].replace(/\./g, ",")}
            </sup>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
