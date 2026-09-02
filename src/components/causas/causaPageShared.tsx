import type { ReactNode } from "react";
import Link from "next/link";
import { RichText } from "@/components/ui/RichText";

export const CAUSA_WRAP = "mx-auto w-full max-w-7xl px-5 md:px-8";
export const CAUSA_PANEL =
  "rounded-[12px] border border-[#D8D4DE] bg-transparent p-6 md:p-8";

export type CausaTocItem = {
  id: string;
  label: string;
  children?: readonly { id: string; label: string }[];
};

export function CausaEyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-extrabold uppercase leading-[16.8px] tracking-[1.3px] text-[#dd876e]">
      {children}
    </p>
  );
}

export function CausaSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[28px] font-black leading-8 text-[#503c77] lg:text-[32px] lg:leading-9">
      {children}
    </h2>
  );
}

export function CausaTocNav({ items }: { items: readonly CausaTocItem[] }) {
  return (
    <nav className="flex flex-col gap-2 rounded-[12px] bg-[#EEECF2] px-5 py-4 text-[13px] leading-5 text-[#503c77]">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          <a
            href={`#${item.id}`}
            className="inline-flex items-center gap-1.5 hover:opacity-80"
          >
            <span
              className="material-symbols-outlined shrink-0 text-[9px] leading-none no-underline"
              aria-hidden
            >
              arrow_forward
            </span>
            <span className="underline underline-offset-2">{item.label}</span>
          </a>
          {item.children ? (
            <div className="ml-4 flex flex-col gap-2">
              {item.children.map((child) => (
                <a
                  key={`${item.id}-${child.id}-${child.label}`}
                  href={`#${child.id}`}
                  className="inline-flex items-center gap-1.5 hover:opacity-80"
                >
                  <span
                    className="material-symbols-outlined shrink-0 text-[9px] leading-none no-underline"
                    aria-hidden
                  >
                    arrow_forward
                  </span>
                  <span className="underline underline-offset-2">
                    {child.label}
                  </span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </nav>
  );
}

export function CausaSintomasPanel() {
  return (
    <div id="sintomas" className={`${CAUSA_PANEL} flex flex-col gap-4`}>
      <div className="flex flex-col gap-2">
        <CausaEyebrow>¿cómo reconocerla?</CausaEyebrow>
        <CausaSectionTitle>Síntomas de la meningitis</CausaSectionTitle>
      </div>
      <p className="text-[16px] leading-[26px] text-[#442748]">
        Los síntomas pueden parecerse a los de un resfriado o gripe, pero suelen
        empeorar rápidamente. Ante cualquier signo de alarma, consultá de
        inmediato a un profesional de la salud.
      </p>
      <Link
        href="/sintomas"
        className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#503c77] underline-offset-2 hover:underline"
      >
        Conocer más sobre los síntomas
        <span aria-hidden className="text-lg leading-none">
          →
        </span>
      </Link>
    </div>
  );
}

export function CausaUrgencyBar() {
  return (
    <div className={`${CAUSA_WRAP} border-l-4 border-[#DD876E] py-14 md:py-16 lg:border-l-0 lg:py-12`}>
      <p className="mx-auto max-w-4xl text-center text-[18px] font-medium leading-snug text-white md:text-[20px] lg:text-[22px] lg:leading-[30px]">
        La meningitis es una{" "}
        <strong className="font-bold text-[#DD876E]">urgencia médica</strong> y{" "}
        <strong className="font-bold text-white">
          requiere consulta y hospitalización
        </strong>{" "}
        inmediata
        <sup className="ml-0.5 text-[0.65em] font-semibold leading-none text-white">
          1
        </sup>
        .
      </p>
    </div>
  );
}

export function CausaPrevencionCta({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className={`${CAUSA_WRAP} flex flex-col items-center gap-8 text-center`}>
      <div className="flex max-w-3xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <CausaEyebrow>{eyebrow}</CausaEyebrow>
          <h2 className="text-[22px] font-bold leading-[28px] text-white md:text-[24px]">
            {title}
          </h2>
        </div>
        <p className="text-[14px] font-normal leading-normal text-white/90 md:text-[15px]">
          <RichText
            text={body}
            strongClassName="font-bold text-white/90"
            citeClassName="ml-0.5 text-[0.85em] font-[inherit] leading-none text-white/90"
          />
        </p>
      </div>
      <Link
        href={ctaHref}
        className="flex h-[52px] w-full max-w-md items-center justify-center gap-2 rounded-[12px] bg-white px-6 text-[15px] font-bold text-[#503c77] transition hover:bg-white/95"
      >
        {ctaLabel}
        <span
          aria-hidden
          className="material-symbols-outlined text-[18px] leading-none"
        >
          arrow_forward
        </span>
      </Link>
    </div>
  );
}
