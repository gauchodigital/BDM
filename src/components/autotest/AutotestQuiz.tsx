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

function buildCanvas(
  age: string,
  groups: { title: string; hex: string; items: Vaccine[] }[],
) {
  const scale = Math.min(3, Math.max(2, window.devicePixelRatio || 2));
  const W = 720;
  const PAD = 40;
  const contentW = W - PAD * 2;
  const textX = PAD + 46;
  const textMaxW = contentW - 46 - 16;

  const measure = document.createElement("canvas").getContext("2d")!;
  const fName = `700 20px ${IMG_FONT}`;
  const fDetail = `400 15px ${IMG_FONT}`;
  const fGroup = `800 14px ${IMG_FONT}`;
  const wrap = (text: string, font: string, maxW: number) => {
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
  };

  const headerH = 120;
  type Op =
    | { t: "group"; text: string; hex: string; y: number }
    | {
        t: "card";
        nameLines: string[];
        detailLines: string[];
        hex: string;
        y: number;
        h: number;
      };
  const ops: Op[] = [];
  let y = headerH + 26;
  for (const g of groups) {
    ops.push({ t: "group", text: g.title.toUpperCase(), hex: g.hex, y });
    y += 30;
    for (const it of g.items) {
      const nameLines = wrap(it.name, fName, textMaxW);
      const detailLines = wrap(it.detail, fDetail, textMaxW);
      const h = 16 + nameLines.length * 25 + 3 + detailLines.length * 20 + 16;
      ops.push({ t: "card", nameLines, detailLines, hex: g.hex, y, h });
      y += h + 10;
    }
    y += 14;
  }
  const footerLines = wrap(
    "Resultado orientativo — consultá con tu médico o pediatra para confirmar tu calendario de vacunación.",
    fDetail,
    contentW,
  );
  y += 6;
  const footerY = y;
  y += footerLines.length * 20 + PAD;
  const H = y;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.textBaseline = "top";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#503C77";
  ctx.fillRect(0, 0, W, headerH);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = `800 12px ${IMG_FONT}`;
  ctx.fillText("BASTA DE MENINGITIS", PAD, 26);
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 26px ${IMG_FONT}`;
  ctx.fillText("Vacunas pendientes", PAD, 48);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = `400 14px ${IMG_FONT}`;
  ctx.fillText(age, PAD, 84);

  for (const op of ops) {
    if (op.t === "group") {
      ctx.fillStyle = op.hex;
      ctx.font = fGroup;
      ctx.fillText(op.text, PAD, op.y);
    } else {
      ctx.fillStyle = "#F7F3FB";
      roundRectPath(ctx, PAD, op.y, contentW, op.h, 14);
      ctx.fill();
      ctx.fillStyle = op.hex;
      ctx.beginPath();
      ctx.arc(PAD + 23, op.y + op.h / 2, 7, 0, Math.PI * 2);
      ctx.fill();
      let ty = op.y + 16;
      ctx.fillStyle = "#442748";
      ctx.font = fName;
      for (const l of op.nameLines) {
        ctx.fillText(l, textX, ty);
        ty += 25;
      }
      ty += 3;
      ctx.fillStyle = "#6A7488";
      ctx.font = fDetail;
      for (const l of op.detailLines) {
        ctx.fillText(l, textX, ty);
        ty += 20;
      }
    }
  }
  ctx.fillStyle = "#9aa0ac";
  ctx.font = fDetail;
  let fy = footerY;
  for (const l of footerLines) {
    ctx.fillText(l, PAD, fy);
    fy += 20;
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
              <p className="mt-3 text-[15px] leading-[1.55] text-dark">
                <strong className="font-bold text-[#503C77]">
                  {pendingCount}{" "}
                  {pendingCount === 1 ? "vacuna" : "vacunas"} por aplicar.
                </strong>{" "}
                Revisá el listado y tomá acción.
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {pendingGroups.flatMap((g) =>
                  g.items.map((v) => (
                    <li
                      key={`${g.id}-${v.name}`}
                      className="rounded-[12px] bg-[#F3F0F8] px-4 py-3"
                    >
                      <p className="text-[14px] font-bold text-[#503C77]">
                        {v.name}
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted">{v.detail}</p>
                    </li>
                  )),
                )}
              </ul>

              <div className="mt-5 flex gap-3 rounded-[12px] bg-[#FEF2F2] p-4">
                <span
                  className="material-symbols-outlined shrink-0 text-[22px] text-[#EF4444]"
                  aria-hidden
                >
                  warning
                </span>
                <p className="text-[13px] leading-[1.5] text-[#7F1D1D]">
                  Este resultado es orientativo. Siempre consultá con tu médico
                  o pediatra para confirmar el calendario de vacunación.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const canvas = buildCanvas(
                    age,
                    pendingGroups.map((g) => ({
                      title: g.title,
                      hex: TONE[g.tone].hex,
                      items: g.items,
                    })),
                  );
                  void downloadImage(canvas);
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
