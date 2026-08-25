import type { ReactNode } from "react";

/**
 * Negritas **así** y citas [1] / [1,3] → <sup>.
 */
export function RichText({
  text,
  className = "",
  strongClassName = "font-bold text-primary",
}: {
  text: string;
  className?: string;
  /** Classes for `**bold**` spans (default keeps brand purple). */
  strongClassName?: string;
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
            <sup key={i} className="text-[0.7em] text-muted">
              {cite[1].replace(/\./g, ",")}
            </sup>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
