"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ageBadge,
  monthsBetween,
  recommendVaccines,
  type Vaccine,
  type VaccineReco,
} from "@/lib/autotestVaccines";

type Tone = "primary" | "accent";

const TONE: Record<
  Tone,
  {
    sectionLabel: string;
    card: string;
    badge: string;
    check: string;
    empty: string;
    iconBg: string;
    hex: string;
  }
> = {
  primary: {
    sectionLabel: "text-[#503C77]",
    card: "bg-[#F3F0F8]",
    badge: "bg-[#503C77]/10 text-[#503C77]",
    check: "bg-[#503C77] border-[#503C77] text-white",
    empty: "border-[#503C77]/40 bg-white text-transparent",
    iconBg: "bg-[#503C77] text-white",
    hex: "#503C77",
  },
  accent: {
    sectionLabel: "text-[#DD876E]",
    card: "bg-[#FDF0EC]",
    badge: "bg-[#DD876E]/15 text-[#DD876E]",
    check: "bg-[#DD876E] border-[#DD876E] text-white",
    empty: "border-[#DD876E]/50 bg-white text-transparent",
    iconBg: "bg-[#DD876E] text-white",
    hex: "#DD876E",
  },
};

type Group = {
  id: string;
  title: string;
  subtitle: string;
  tone: Tone;
  items: Vaccine[];
};

function makeGroups(reco: VaccineReco): Group[] {
  return [
    {
      id: "cal",
      title: "Calendario Nacional",
      subtitle: "Gratuitas y obligatorias en Argentina",
      tone: "primary" as const,
      items: reco.calendario,
    },
    {
      id: "rec",
      title: "Vacunas Recomendadas",
      subtitle: "Argentina, vacunación particular",
      tone: "accent" as const,
      items: reco.recomendadas,
    },
  ].filter((g) => g.items.length > 0);
}

function Progress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div>
      <div className="flex items-center">
        {([1, 2, 3] as const).map((s, i) => (
          <span key={s} className="flex items-center">
            {i > 0 ? (
              <span
                className={`mx-1 h-0.5 w-8 rounded-full transition-colors ${
                  step >= s ? "bg-[#503C77]" : "bg-[#D6CFE0]"
                }`}
                aria-hidden
              />
            ) : null}
            <span
              className={`size-2.5 shrink-0 rounded-full transition-colors ${
                step >= s ? "bg-[#503C77]" : "bg-[#D6CFE0]"
              }`}
              aria-hidden
            />
          </span>
        ))}
      </div>
      <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#DD876E]">
        Paso {step} de 3
      </p>
    </div>
  );
}

function VaccineCard({
  v,
  tone,
  done,
  onToggle,
}: {
  v: Vaccine;
  tone: Tone;
  done: boolean;
  onToggle: () => void;
}) {
  const t = TONE[tone];
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      className={`flex w-full items-center gap-3 rounded-[12px] p-3.5 text-left transition-colors ${
        done ? "bg-white ring-1 ring-[#E5E0EC]" : t.card
      }`}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
          done ? "bg-[#E5E0EC] text-[#503C77]/50" : t.iconBg
        }`}
        aria-hidden
      >
        <span className="material-symbols-outlined text-[22px] leading-none">
          vaccines
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[14px] font-bold leading-tight ${
            done ? "text-[#503C77]/45 line-through" : "text-[#503C77]"
          }`}
        >
          {v.name}
        </span>
        <span className="mt-0.5 block text-[12px] leading-snug text-muted">
          {v.detail}
        </span>
      </span>
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          done ? t.check : t.empty
        }`}
        aria-hidden
      >
        <span className="material-symbols-outlined text-[16px] leading-none">
          check
        </span>
      </span>
    </button>
  );
}

/* ── Imagen PNG ─────────────────────────────────────────────────────── */

const IMG_FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const LOGO_SRC = "/brand/logo-bdm-wordmark-white.png";
const PURPLE = "#503C77";

const SHARE_WARNING =
  "Este resultado es orientativo y únicamente contempla las vacunas dentro del Calendario Nacional de Vacunación. Siempre consultá con el médico para confirmar qué vacunas son las recomendadas según edad y condición clínica particular.";

const SHARE_LEGAL_LINES = [
  "NP-AR-MNU-WCNT-260001 - Agosto 2026.",
  "Para mayor información consulte a su médico.",
  "GSK Biopharma Argentina SA Av del Libertador 7202, Piso 4, CABA, Buenos Aires, Argentina.",
  "Para consultas sobre nuestros productos, consultas de calidad o reporte de eventos adversos puede comunicarse al 0800-220-4752. Para reportar eventos adversos de nuestros productos envíe un correo a: bua-farmacovigilancia-rx@gsk.com",
  "© 2026 GSK y sus afiliadas o licenciantes",
];

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });
}

function wrapText(
  measure: CanvasRenderingContext2D,
  text: string,
  font: string,
  maxW: number,
) {
  measure.font = font;
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (measure.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

async function buildCanvas(
  pendingCount: number,
  groups: { title: string; items: Vaccine[] }[],
) {
  const logo = await loadImage(LOGO_SRC);
  const scale = Math.min(3, Math.max(2, window.devicePixelRatio || 2));
  const W = 720;
  const PAD = 32;
  const contentW = W - PAD * 2;
  const cardTextX = PAD + 28;
  const cardTextMaxW = contentW - 40;

  const measure = document.createElement("canvas").getContext("2d")!;
  const fCount = `700 16px ${IMG_FONT}`;
  const fIntro = `400 16px ${IMG_FONT}`;
  const fName = `700 16px ${IMG_FONT}`;
  const fDetail = `400 14px ${IMG_FONT}`;
  const fGroup = `800 12px ${IMG_FONT}`;
  const fWarning = `400 13px ${IMG_FONT}`;
  const fLegal = `400 11px ${IMG_FONT}`;
  const fHeaderTitle = `700 17px ${IMG_FONT}`;
  const wrap = (text: string, font: string, maxW: number) =>
    wrapText(measure, text, font, maxW);
  const textW = (text: string, font: string) => {
    measure.font = font;
    return measure.measureText(text).width;
  };

  const headerH = 72;
  const LOGO_H = 38;
  const LOGO_W = (logo.naturalWidth / logo.naturalHeight) * LOGO_H;

  type CardOp = {
    nameLines: string[];
    detailLines: string[];
    h: number;
  };
  type GroupOp = {
    title: string;
    cards: CardOp[];
    h: number;
  };

  const groupOps: GroupOp[] = [];
  for (const g of groups) {
    const cards: CardOp[] = g.items.map((it) => {
      const nameLines = wrap(it.name, fName, cardTextMaxW);
      const detailLines = wrap(it.detail, fDetail, cardTextMaxW);
      const h =
        14 + nameLines.length * 22 + (detailLines.length ? 2 : 0) +
        detailLines.length * 18 + 14;
      return { nameLines, detailLines, h };
    });
    const cardsH = cards.reduce((sum, c, i) => sum + c.h + (i > 0 ? 10 : 0), 0);
    const h = 22 + cardsH;
    groupOps.push({ title: g.title.toUpperCase(), cards, h });
  }

  const listH =
    groupOps.reduce((sum, g, i) => sum + g.h + (i > 0 ? 24 : 0), 0) + 8;

  const warningLines = wrap(SHARE_WARNING, fWarning, contentW - 52);
  const warningH = 18 + warningLines.length * 19 + 18;

  const legalLines = SHARE_LEGAL_LINES.flatMap((t) =>
    wrap(t, fLegal, contentW),
  );
  const legalPad = 20;
  const legalH = legalPad + 32 + 10 + legalLines.length * 15 + legalPad;

  const introSub = "Revisá el listado y tomá acción.";
  const countLabel = `${pendingCount} ${
    pendingCount === 1 ? "vacuna" : "vacunas"
  } por aplicar.`;
  const introOneLine =
    textW(countLabel, fCount) + textW(` ${introSub}`, fIntro) <= contentW;
  const introH = introOneLine ? 24 : 48;
  const footerGap = 32;

  const H =
    headerH + 24 + introH + 20 + listH + 20 + warningH + footerGap + legalH;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.textBaseline = "top";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Header
  ctx.fillStyle = PURPLE;
  ctx.fillRect(0, 0, W, headerH);
  ctx.drawImage(logo, PAD, (headerH - LOGO_H) / 2, LOGO_W, LOGO_H);
  ctx.fillStyle = "#ffffff";
  ctx.font = fHeaderTitle;
  const headerTitle = "Vacunas pendientes";
  const headerTitleW = textW(headerTitle, fHeaderTitle);
  ctx.fillText(headerTitle, W - PAD - headerTitleW, (headerH - 17) / 2);

  // Intro
  let y = headerH + 24;
  ctx.fillStyle = PURPLE;
  ctx.font = fCount;
  ctx.fillText(countLabel, PAD, y);
  if (introOneLine) {
    const countW = textW(countLabel, fCount);
    ctx.fillStyle = "#442748";
    ctx.font = fIntro;
    ctx.fillText(` ${introSub}`, PAD + countW, y);
  } else {
    ctx.fillStyle = "#442748";
    ctx.font = fIntro;
    ctx.fillText(introSub, PAD, y + 26);
  }
  y += introH + 20;

  // Listado
  for (let gi = 0; gi < groupOps.length; gi++) {
    const g = groupOps[gi]!;
    if (gi > 0) y += 24;

    ctx.fillStyle = PURPLE;
    ctx.beginPath();
    ctx.arc(PAD + 5, y + 6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = fGroup;
    ctx.fillText(g.title, PAD + 16, y);
    y += 22;

    for (const card of g.cards) {
      ctx.fillStyle = "#F3F0F8";
      roundRectPath(ctx, PAD, y, contentW, card.h, 12);
      ctx.fill();
      ctx.fillStyle = PURPLE;
      ctx.beginPath();
      ctx.arc(PAD + 14, y + card.h / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      let ty = y + 14;
      ctx.fillStyle = PURPLE;
      ctx.font = fName;
      for (const l of card.nameLines) {
        ctx.fillText(l, cardTextX, ty);
        ty += 22;
      }
      ty += 2;
      ctx.fillStyle = "#6A7488";
      ctx.font = fDetail;
      for (const l of card.detailLines) {
        ctx.fillText(l, cardTextX, ty);
        ty += 18;
      }
      y += card.h + 10;
    }
  }

  // Aviso
  y += 10;
  roundRectPath(ctx, PAD, y, contentW, warningH, 12);
  ctx.fillStyle = "#FFF5F5";
  ctx.fill();

  const warnIconX = PAD + 14;
  const warnIconY = y + 18;
  ctx.fillStyle = "#EF4444";
  ctx.beginPath();
  ctx.moveTo(warnIconX + 8, warnIconY);
  ctx.lineTo(warnIconX + 16, warnIconY + 14);
  ctx.lineTo(warnIconX, warnIconY + 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 10px ${IMG_FONT}`;
  ctx.fillText("!", warnIconX + 6, warnIconY + 2);

  ctx.fillStyle = "#7F1D1D";
  ctx.font = fWarning;
  let wy = y + 18;
  for (const l of warningLines) {
    ctx.fillText(l, PAD + 44, wy);
    wy += 19;
  }

  // Pie legal
  const legalY = y + warningH + footerGap;
  ctx.fillStyle = PURPLE;
  ctx.fillRect(0, legalY, W, legalH);
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 28px ${IMG_FONT}`;
  ctx.fillText("GSK", PAD, legalY + legalPad);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, legalY + legalPad + 36);
  ctx.lineTo(W - PAD, legalY + legalPad + 36);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = fLegal;
  let ly = legalY + legalPad + 46;
  for (const l of legalLines) {
    ctx.fillText(l, PAD, ly);
    ly += 15;
  }

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((res) => canvas.toBlob(res, "image/png"));
}

async function downloadImage(canvas: HTMLCanvasElement) {
  const blob = await canvasToBlob(canvas);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vacunas-pendientes-bdm.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function googleCalendarUrl(pendingNames: string[]): string {
  const title = encodeURIComponent("Recordatorio: vacunas pendientes");
  const details = encodeURIComponent(
    `Vacunas pendientes (Basta de Meningitis):\n• ${pendingNames.join("\n• ")}\n\nResultado orientativo — consultá con tu médico o pediatra.`,
  );
  const start = new Date();
  start.setDate(start.getDate() + 7);
  start.setHours(10, 0, 0, 0);
  const end = new Date(start);
  end.setHours(11, 0, 0, 0);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${fmt(start)}/${fmt(end)}`;
}

export function AutotestQuiz() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [birth, setBirth] = useState("");
  const [months, setMonths] = useState<number | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const today = new Date().toISOString().slice(0, 10);

  const groups = useMemo(
    () => (months === null ? [] : makeGroups(recommendVaccines(months))),
    [months],
  );

  const pendingGroups = useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          items: g.items.filter((it) => !done[`${g.id}::${it.name}`]),
        }))
        .filter((g) => g.items.length > 0),
    [groups, done],
  );

  const pendingCount = pendingGroups.reduce((n, g) => n + g.items.length, 0);
  const pendingNames = pendingGroups.flatMap((g) => g.items.map((i) => i.name));

  useEffect(() => {
    if (step === 1) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const submit = () => {
    if (!birth) return;
    setMonths(monthsBetween(new Date(`${birth}T00:00:00`), new Date()));
    setDone({});
    setStep(2);
  };

  const toggle = (key: string) =>
    setDone((d) => ({ ...d, [key]: !d[key] }));

  const reset = () => {
    setStep(1);
    setMonths(null);
    setBirth("");
    setDone({});
  };

  const age = months !== null ? ageBadge(months) : "";

  return (
    <div className="mx-auto w-full max-w-xl">
      {step === 1 && (
        <div className="rounded-[16px] bg-white p-6 shadow-[0_4px_24px_rgba(80,60,119,0.08)] md:p-8">
          <Progress step={1} />
          <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-[#503C77] md:text-[28px]">
            Completá la fecha de nacimiento
          </h1>
          <p className="mt-3 text-[15px] leading-[1.55] text-dark">
            Ingresá la fecha de nacimiento y te mostramos las vacunas
            recomendadas según el Calendario Nacional de Vacunación.
          </p>

          <label
            htmlFor="fecha-nac"
            className="mt-6 block text-[13px] font-semibold text-[#503C77]"
          >
            Fecha de nacimiento
          </label>
          <div className="relative mt-2">
            <input
              id="fecha-nac"
              type="date"
              value={birth}
              max={today}
              onChange={(e) => setBirth(e.target.value)}
              className="w-full rounded-[10px] border border-[#D6DEE8] bg-white px-4 py-3.5 pr-12 text-[15px] text-dark outline-none focus:border-[#503C77]"
            />
            <span
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#503C77]/50"
              aria-hidden
            >
              <span className="material-symbols-outlined text-[22px]">
                calendar_month
              </span>
            </span>
          </div>

          <button
            type="button"
            disabled={!birth}
            onClick={submit}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#503C77] py-3.5 text-[15px] font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
            <span aria-hidden>→</span>
          </button>
        </div>
      )}

      {step === 2 && months !== null && (
        <div className="rounded-[16px] bg-white p-6 shadow-[0_4px_24px_rgba(80,60,119,0.08)] md:p-8">
          <Progress step={2} />
          <span className="mt-4 inline-flex rounded-full bg-[#503C77]/10 px-3 py-1 text-[13px] font-bold text-[#503C77]">
            {age}
          </span>
          <h2 className="mt-3 text-[24px] font-extrabold leading-tight text-[#503C77] md:text-[28px]">
            Vacunas de calendario
          </h2>
          <p className="mt-3 text-[15px] leading-[1.55] text-dark">
            Marcá las vacunas ya aplicadas. Con las que falten armamos tu lista
            descargable.
          </p>

          <div className="mt-6 flex flex-col gap-7">
            {groups.map((g) => {
              const t = TONE[g.tone];
              return (
                <div key={g.id}>
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[14px] font-bold leading-tight ${t.sectionLabel}`}
                      >
                        {g.title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted">
                        {g.subtitle}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${t.badge}`}
                    >
                      {g.items.length}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {g.items.map((v) => {
                      const key = `${g.id}::${v.name}`;
                      return (
                        <VaccineCard
                          key={v.name}
                          v={v}
                          tone={g.tone}
                          done={!!done[key]}
                          onToggle={() => toggle(key)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setStep(3)}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#503C77] py-3.5 text-[15px] font-bold text-white transition hover:brightness-110"
          >
            Continuar
            <span aria-hidden>→</span>
          </button>
        </div>
      )}

      {step === 3 && months !== null && (
        <div className="rounded-[16px] bg-white p-6 shadow-[0_4px_24px_rgba(80,60,119,0.08)] md:p-8">
          <Progress step={3} />
          <span className="mt-4 inline-flex rounded-full bg-[#503C77]/10 px-3 py-1 text-[13px] font-bold text-[#503C77]">
            {age}
          </span>

          {pendingCount > 0 ? (
            <>
              <h2 className="mt-3 text-[24px] font-extrabold leading-tight text-[#503C77] md:text-[28px]">
                Vacunas pendientes
              </h2>
              <p className="mt-3 text-[16px] leading-[1.5] text-[#442748]">
                <strong className="font-bold text-[#503C77]">
                  {pendingCount}{" "}
                  {pendingCount === 1 ? "vacuna" : "vacunas"} por aplicar.
                </strong>{" "}
                Revisá el listado y tomá acción.
              </p>

              <div className="mt-5 flex flex-col gap-6">
                {pendingGroups.map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full bg-[#503C77]"
                        aria-hidden
                      />
                      <p className="text-[12px] font-extrabold uppercase tracking-wide text-[#503C77]">
                        {g.title}
                      </p>
                    </div>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {g.items.map((v) => (
                        <li
                          key={`${g.id}-${v.name}`}
                          className="flex gap-3 rounded-[12px] bg-[#F3F0F8] px-4 py-3.5"
                        >
                          <span
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#503C77]"
                            aria-hidden
                          />
                          <div>
                            <p className="text-[15px] font-bold text-[#503C77]">
                              {v.name}
                            </p>
                            <p className="mt-0.5 text-[13px] text-muted">
                              {v.detail}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-3 rounded-[12px] bg-[#FFF5F5] p-4">
                <span
                  className="material-symbols-outlined shrink-0 text-[20px] text-[#EF4444]"
                  aria-hidden
                >
                  warning
                </span>
                <p className="text-[13px] leading-[1.55] text-[#7F1D1D]">
                  {SHARE_WARNING}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void (async () => {
                    const canvas = await buildCanvas(
                      pendingCount,
                      pendingGroups.map((g) => ({
                        title: g.title,
                        items: g.items,
                      })),
                    );
                    await downloadImage(canvas);
                  })();
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#503C77] py-3.5 text-[15px] font-bold text-white transition hover:brightness-110"
              >
                Descargar imagen
              </button>
              <a
                href={googleCalendarUrl(pendingNames)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center rounded-[10px] border-2 border-[#503C77] bg-white py-3.5 text-[15px] font-bold text-[#503C77] transition hover:bg-[#503C77]/5"
              >
                Agendar un recordatorio
              </a>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-[24px] font-extrabold leading-tight text-[#503C77] md:text-[28px]">
                ¡Estás al día!
              </h2>
              <p className="mt-3 text-[15px] leading-[1.55] text-dark">
                Marcaste todas las vacunas como aplicadas.
              </p>
            </>
          )}

          <Link
            href="/vacunacion#calendario"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#503C77] py-3.5 text-[15px] font-bold text-white transition hover:brightness-110"
          >
            Ver calendario completo
            <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            onClick={reset}
            className="mt-4 w-full text-center text-[14px] font-medium text-muted underline underline-offset-2 hover:text-[#503C77]"
          >
            Empezar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
