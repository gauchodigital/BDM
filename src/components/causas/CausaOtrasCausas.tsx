import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { CausaCardLink } from "@/lib/causaCardColors";

function Eyebrow({
  children,
  className = "text-[#dd876e]",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-extrabold uppercase leading-[16.8px] tracking-[1.3px] ${className}`}
    >
      {children}
    </p>
  );
}

export function CausaOtrasCausas({
  items,
  eyebrow = "explorá OTRAS CAUSAS",
  eyebrowClassName = "text-[#dd876e]",
  containerClassName = "max-w-2xl",
}: {
  items: readonly CausaCardLink[];
  eyebrow?: string;
  eyebrowClassName?: string;
  containerClassName?: string;
}) {
  return (
    <section className="bg-white px-5 py-16 md:px-8">
      <Reveal delay={80}>
        <div
          className={`mx-auto flex w-full flex-col gap-4 ${containerClassName}`}
        >
        <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>
        <div className="grid grid-cols-3 gap-2 lg:gap-4">
          {items.map((causa) => (
            <Link
              key={causa.label}
              href={causa.href}
              className="flex h-[72px] flex-col items-start justify-between rounded-[12px] px-3 py-3.5 transition hover:brightness-95 lg:h-[132px] lg:rounded-2xl lg:px-5 lg:py-6"
              style={{ backgroundColor: causa.bg, color: causa.text }}
            >
              <span className="text-[13px] font-bold leading-none lg:text-[18px]">
                {causa.label}
              </span>
              <span
                aria-hidden
                className="block size-3 shrink-0 lg:size-4"
                style={{
                  backgroundColor: causa.text,
                  WebkitMaskImage: "url(/brand/icons/arrow-right.svg)",
                  maskImage: "url(/brand/icons/arrow-right.svg)",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
            </Link>
          ))}
        </div>
        </div>
      </Reveal>
    </section>
  );
}
