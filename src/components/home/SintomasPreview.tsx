import Link from "next/link";
import { RichText } from "@/components/ui/RichText";
import type { SintomaData, SintomaPhase } from "@/lib/sintomasData";

const PHASE: Record<
  SintomaPhase,
  {
    badge: string;
    lead: string;
    line: string;
    badgeBg: string;
    badgeText: string;
    badgeRadius: string;
    titleColor: string;
    iconColor: string;
  }
> = {
  early: {
    badge: "Primeras 12hs · Síntomas inespecíficos",
    lead: "Pueden confundirse con otras enfermedades. Preste atención si aparecen juntos.",
    line: "bg-primary",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    badgeRadius: "rounded-[8px]",
    titleColor: "text-primary",
    iconColor: "text-primary",
  },
  alarm: {
    badge: "Pasadas las 12hs · Señales de alarma",
    lead: "Si aparecen estos síntomas, buscá atención médica de inmediato.",
    line: "bg-[#DD876E]",
    badgeBg: "bg-[#DD876E]/15",
    badgeText: "text-[#DD876E]",
    badgeRadius: "rounded-[12px]",
    titleColor: "text-[#DD876E]",
    iconColor: "text-[#DD876E]",
  },
};

function PhaseHeader({ phase }: { phase: SintomaPhase }) {
  const cfg = PHASE[phase];
  return (
    <div className="relative mb-4">
      <span
        className={`absolute top-1 -left-9 z-10 flex h-8 w-8 items-center justify-center rounded-full ${cfg.line} text-white`}
        aria-hidden
      >
        <span className="material-symbols-outlined text-[18px] leading-none">
          schedule
        </span>
      </span>
      <p
        className={`w-full px-4 py-2.5 text-[13px] font-bold leading-snug ${cfg.badgeRadius} ${cfg.badgeBg} ${cfg.badgeText}`}
      >
        {cfg.badge}
      </p>
      <p className="mt-3 text-[13px] leading-[1.55] text-muted">{cfg.lead}</p>
    </div>
  );
}

function SymptomCard({
  item,
  phase,
}: {
  item: SintomaData;
  phase: SintomaPhase;
}) {
  const cfg = PHASE[phase];
  const isSvg = item.icon.endsWith(".svg") || item.icon.startsWith("/");

  return (
    <li className="rounded-[12px] border border-[#A6C0D6] bg-white p-2">
      <div className="flex items-start gap-3">
        {isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.icon}
            alt=""
            width={28}
            height={28}
            className="mt-0.5 h-7 w-7 shrink-0"
            aria-hidden
          />
        ) : (
          <span
            className={`material-symbols-outlined mt-0.5 text-[28px] leading-none ${cfg.iconColor}`}
            aria-hidden
          >
            {item.icon}
          </span>
        )}
        <div className="min-w-0">
          <p className={`text-[13px] font-bold leading-tight ${cfg.titleColor}`}>
            {item.label}
          </p>
          <p className="mt-1 text-[12px] leading-[1.5] text-muted">
            {item.description}
          </p>
        </div>
      </div>
    </li>
  );
}

export function SintomasPreview({
  sintomas,
  showMoreLink = true,
  headingAs = "h2",
}: {
  sintomas: SintomaData[];
  showMoreLink?: boolean;
  headingAs?: "h1" | "h2";
}) {
  const early = sintomas.filter((s) => s.phase === "early");
  const alarm = sintomas.filter((s) => s.phase === "alarm");
  const Heading = headingAs;

  return (
    <section id="sintomas" className="scroll-mt-16 bg-white section-pad">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            ¿Cómo reconocerla?
          </p>
          <Heading className="mt-3 text-[28px] font-black leading-tight text-[#503C77]">
            Síntomas habituales de la meningitis
          </Heading>
          <p className="mt-4 text-[14px] leading-[1.55] text-dark">
            <RichText text="Las manifestaciones clínicas de los pacientes con meningitis varían en función de la causa, la evolución de la enfermedad, la edad y otros factores[1,3]. Reconocer los síntomas a tiempo puede salvar una vida." />
          </p>

          <div className="relative mt-10 pl-10">
            {early.length > 0 && (
              <div className="relative">
                {/* Línea desde el centro del reloj (sin hueco) */}
                <div
                  className="absolute top-5 bottom-0 -left-[21px] w-0.5 bg-primary"
                  aria-hidden
                />
                <PhaseHeader phase="early" />
                <ul className="flex flex-col gap-3 pb-8">
                  {early.map((s) => (
                    <SymptomCard key={s.id} item={s} phase="early" />
                  ))}
                </ul>
              </div>
            )}

            {alarm.length > 0 && (
              <div className="relative">
                {/* Naranja: del centro del reloj al centro del warning */}
                <div
                  className="absolute top-0 bottom-10 -left-[21px] w-0.5 bg-[#DD876E]"
                  aria-hidden
                />
                <PhaseHeader phase="alarm" />
                <ul className="flex flex-col gap-3">
                  {alarm.map((s) => (
                    <SymptomCard key={s.id} item={s} phase="alarm" />
                  ))}
                </ul>

                <div className="relative mt-3">
                  <span
                    className="absolute top-2 -left-9 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#EF4444] text-white"
                    aria-hidden
                  >
                    <span className="material-symbols-outlined text-[18px] leading-none">
                      warning
                    </span>
                  </span>
                  <div className="rounded-[8px] bg-[#FEF2F2] px-4 py-[14px] shadow-[inset_0_0_0_2px_#EF4444]">
                    <p className="text-[12px] font-bold leading-snug text-[#7F1D1D]">
                      Ante la presencia de estos síntomas, consultá al médico o
                      pediatra.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showMoreLink && (
            <Link
              href="/sintomas"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-[10px] bg-primary py-3.5 text-[15px] font-bold text-white transition hover:brightness-110"
            >
              Conocé más
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
