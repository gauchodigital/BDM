"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ageBadge,
  getVaccinePlan,
  monthsBetween,
  vaccineItemKey,
  type AccumulateMode,
  type Vaccine,
  type VaccineBucket,
} from "@/lib/autotestVaccines";

type Tone = "primary" | "accent" | "sky";

const TONE: Record<
  Tone,
  {
    sectionLabel: string;
    card: string;
    badge: string;
    check: string;
    empty: string;
    iconBg: string;
    name: string;
    nameDone: string;
  }
> = {
  primary: {
    sectionLabel: "text-[#503C77]",
    card: "bg-[#F3F0F8]",
    badge: "bg-[#503C77]/10 text-[#503C77]",
    check: "bg-[#503C77] border-[#503C77] text-white",
    empty: "border-[#503C77]/40 bg-white text-transparent",
    iconBg: "bg-[#503C77] text-white",
    name: "text-[#503C77]",
    nameDone: "text-[#503C77]/45 line-through",
  },
  accent: {
    sectionLabel: "text-[#DD876E]",
    card: "bg-[#FDF0EC]",
    badge: "bg-[#DD876E]/15 text-[#DD876E]",
    check: "bg-[#DD876E] border-[#DD876E] text-white",
    empty: "border-[#DD876E]/50 bg-white text-transparent",
    iconBg: "bg-[#DD876E] text-white",
    name: "text-[#DD876E]",
    nameDone: "text-[#DD876E]/50 line-through",
  },
  sky: {
    sectionLabel: "text-[#6D6AAE]",
    card: "bg-[#EEECF2]",
    badge: "bg-[#6D6AAE]/15 text-[#6D6AAE]",
    check: "bg-[#6D6AAE] border-[#6D6AAE] text-white",
    empty: "border-[#6D6AAE]/40 bg-white text-transparent",
    iconBg: "bg-[#6D6AAE] text-white",
    name: "text-[#6D6AAE]",
    nameDone: "text-[#6D6AAE]/50 line-through",
  },
};

type Group = {
  key: string;
  bucketId: VaccineBucket["id"];
  title: string;
  subtitle: string;
  tone: Tone;
  checkable: boolean;
  items: Vaccine[];
};

function bucketTone(id: VaccineBucket["id"]): Tone {
  if (id === "anteriores") return "primary";
  if (id === "siguientes") return "sky";
  return "accent";
}

function makeGroups(buckets: VaccineBucket[]): Group[] {
  const groups: Group[] = [];
  for (const b of buckets) {
    if (b.calendario.length > 0) {
      groups.push({
        key: `${b.id}-cal`,
        bucketId: b.id,
        title: b.title,
        subtitle: `${b.rangeLabel} · Calendario Nacional`,
        tone: bucketTone(b.id),
        checkable: b.checkable,
        items: b.calendario,
      });
    }
    if (b.recomendadas.length > 0) {
      groups.push({
        key: `${b.id}-rec`,
        bucketId: b.id,
        title:
          b.id === "siguientes"
            ? "Próximas recomendadas"
            : b.id === "anteriores"
              ? "Recomendadas anteriores"
              : "Vacunas recomendadas",
        subtitle: `${b.rangeLabel} · Vacunación particular`,
        tone: bucketTone(b.id),
        checkable: b.checkable,
        items: b.recomendadas,
      });
    }
  }
  return groups;
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
  checkable,
  onToggle,
}: {
  v: Vaccine;
  tone: Tone;
  done: boolean;
  checkable: boolean;
  onToggle: () => void;
}) {
  const t = TONE[tone];
  if (!checkable) {
    return (
      <div
        className={`flex w-full items-center gap-3 rounded-[12px] p-3.5 text-left ${t.card}`}
      >
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${t.iconBg}`}
          aria-hidden
        >
          <span className="material-symbols-outlined text-[22px] leading-none">
            event
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[14px] font-bold leading-tight ${t.name}`}>
            {v.name}
          </span>
          <span className="mt-0.5 block text-[12px] leading-snug text-muted">
            {v.detail}
          </span>
        </span>
      </div>
    );
  }

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
            done ? t.nameDone : t.name
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

const IMG_FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
/** Manito oficial (mismo asset que la nav). */
const LOGO_SRC = "/brand/logo-manito-white.png";
const GSK_LOGO_SRC = "/brand/logo-gsk-footer.png";
const BRAND_NAME = "BastaDeMeningitis";
const PURPLE = "#503C77";

const SHARE_WARNING =
  "Este resultado es orientativo: contempla las vacunas del Calendario Nacional de Vacunación y algunas recomendadas fuera de él (vacunación particular). Siempre consultá con el médico para confirmar qué vacunas corresponden según edad y condición clínica particular.";

const SHARE_LEGAL_LINES = [
  "NP-AR-MNU-WCNT-260001 - Septiembre 2026.",
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
  const [logo, gskLogo] = await Promise.all([
    loadImage(LOGO_SRC),
    loadImage(GSK_LOGO_SRC),
  ]);
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
  const LOGO_H = 44;
  const LOGO_W = (logo.naturalWidth / logo.naturalHeight) * LOGO_H;
  const fBrand = `700 15px ${IMG_FONT}`;
  const GSK_H = 32;
  const GSK_W = (gskLogo.naturalWidth / gskLogo.naturalHeight) * GSK_H;

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
        14 +
        nameLines.length * 22 +
        (detailLines.length ? 2 : 0) +
        detailLines.length * 18 +
        14;
      return { nameLines, detailLines, h };
    });
    const cardsH = cards.reduce((sum, c, i) => sum + c.h + (i > 0 ? 10 : 0), 0);
    groupOps.push({ title: g.title.toUpperCase(), cards, h: 22 + cardsH });
  }

  const listH =
    groupOps.reduce((sum, g, i) => sum + g.h + (i > 0 ? 24 : 0), 0) + 8;

  const warningLines = wrap(SHARE_WARNING, fWarning, contentW - 52);
  const warningH = 18 + warningLines.length * 19 + 18;

  const legalLines = SHARE_LEGAL_LINES.flatMap((t) =>
    wrap(t, fLegal, contentW),
  );
  const legalPad = 20;
  const legalH = legalPad + GSK_H + 10 + legalLines.length * 15 + legalPad;

  const introSub =
    pendingCount > 0
      ? "Revisá el listado y tomá acción."
      : "Estas son las próximas a recibir.";
  const countLabel =
    pendingCount > 0
      ? `${pendingCount} ${pendingCount === 1 ? "vacuna" : "vacunas"} por aplicar.`
      : "¡Estás al día!";
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

  ctx.fillStyle = PURPLE;
  ctx.fillRect(0, 0, W, headerH);
  const logoY = (headerH - LOGO_H) / 2;
  ctx.drawImage(logo, PAD, logoY, LOGO_W, LOGO_H);
  ctx.fillStyle = "#ffffff";
  ctx.font = fBrand;
  ctx.fillText(
    BRAND_NAME,
    PAD + LOGO_W + 10,
    (headerH - 15) / 2,
  );
  ctx.font = fHeaderTitle;
  const headerTitle = "Vacunas pendientes";
  ctx.fillText(
    headerTitle,
    W - PAD - textW(headerTitle, fHeaderTitle),
    (headerH - 17) / 2,
  );

  let y = headerH + 24;
  ctx.fillStyle = PURPLE;
  ctx.font = fCount;
  ctx.fillText(countLabel, PAD, y);
  if (introOneLine) {
    ctx.fillStyle = "#442748";
    ctx.font = fIntro;
    ctx.fillText(` ${introSub}`, PAD + textW(countLabel, fCount), y);
  } else {
    ctx.fillStyle = "#442748";
    ctx.font = fIntro;
    ctx.fillText(introSub, PAD, y + 26);
  }
  y += introH + 20;

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

  const legalY = y + warningH + footerGap;
  ctx.fillStyle = PURPLE;
  ctx.fillRect(0, legalY, W, legalH);
  ctx.drawImage(gskLogo, PAD, legalY + legalPad, GSK_W, GSK_H);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, legalY + legalPad + GSK_H + 8);
  ctx.lineTo(W - PAD, legalY + legalPad + GSK_H + 8);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = fLegal;
  let ly = legalY + legalPad + GSK_H + 18;
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

function googleCalendarUrl(names: string[]): string {
  const title = encodeURIComponent("Recordatorio: vacunas");
  const details = encodeURIComponent(
    `Vacunas (Basta de Meningitis):\n• ${names.join("\n• ")}\n\nResultado orientativo — consultá con tu médico o pediatra.`,
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

function isoToDisplay(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function formatBirthTyping(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseBirthDisplay(
  display: string,
  todayIso: string,
): { iso: string } | { error: string } | { incomplete: true } {
  const digits = display.replace(/\D/g, "");
  if (digits.length < 8) return { incomplete: true };

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const parsed = new Date(year, month - 1, day);

  if (
    year < 1900 ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return { error: "Esa fecha no es válida." };
  }

  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (iso > todayIso) {
    return { error: "La fecha no puede ser posterior a hoy." };
  }
  return { iso };
}

export type AutotestVariant = "default" | "byAge";

/** Agrupa ítems consecutivos por `stage` (edad de origen), respetando el orden. */
function groupByStage(items: Vaccine[]): { stage: string; items: Vaccine[] }[] {
  const out: { stage: string; items: Vaccine[] }[] = [];
  for (const v of items) {
    const stage = v.stage ?? "";
    const last = out[out.length - 1];
    if (last && last.stage === stage) last.items.push(v);
    else out.push({ stage, items: [v] });
  }
  return out;
}

/**
 * variant="byAge" (/autotestv2, /autotestv3): las "anteriores" acumuladas se
 * muestran agrupadas por edad, con "Marcar todas" por grupo.
 * accumulateMode="until12" (/autotestv2): nace → 12 meses inclusive.
 * accumulateMode="until24" (/autotestv3): nace → 24 meses inclusive.
 * collapsibleMonths (/autotestv3): cada mes se abre/cierra para acortar la lista.
 */
export function AutotestQuiz({
  variant = "default",
  accumulateMode = "windows",
  collapsibleMonths = false,
}: {
  variant?: AutotestVariant;
  accumulateMode?: AccumulateMode;
  collapsibleMonths?: boolean;
} = {}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [birth, setBirth] = useState("");
  const [birthTyped, setBirthTyped] = useState("");
  const [months, setMonths] = useState<number | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [openStages, setOpenStages] = useState<Record<string, boolean>>({});
  const datePickerRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().slice(0, 10);
  const parsedBirth = parseBirthDisplay(birthTyped, today);
  const birthError = "error" in parsedBirth ? parsedBirth.error : null;

  const plan = useMemo(
    () =>
      months === null ? null : getVaccinePlan(months, { accumulateMode }),
    [months, accumulateMode],
  );

  const groups = useMemo(
    () => (plan ? makeGroups(plan.buckets) : []),
    [plan],
  );

  const checkableGroups = useMemo(
    () => groups.filter((g) => g.checkable),
    [groups],
  );

  const upcomingGroups = useMemo(
    () => groups.filter((g) => !g.checkable),
    [groups],
  );

  const pendingGroups = useMemo(
    () =>
      checkableGroups
        .map((g) => ({
          ...g,
          items: g.items.filter((it) => !done[vaccineItemKey(g.key, it)]),
        }))
        .filter((g) => g.items.length > 0),
    [checkableGroups, done],
  );

  const pendingCount = pendingGroups.reduce((n, g) => n + g.items.length, 0);
  const pendingNames = pendingGroups.flatMap((g) => g.items.map((i) => i.name));
  const upcomingNames = upcomingGroups.flatMap((g) =>
    g.items.map((i) => i.name),
  );
  const reminderNames = [...pendingNames, ...upcomingNames];

  useEffect(() => {
    if (step === 1) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const submit = () => {
    const parsed = parseBirthDisplay(birthTyped, today);
    if (!("iso" in parsed)) return;
    setBirth(parsed.iso);
    setMonths(monthsBetween(new Date(`${parsed.iso}T00:00:00`), new Date()));
    setDone({});
    setOpenStages({});
    setStep(2);
  };

  const toggle = (key: string) =>
    setDone((d) => ({ ...d, [key]: !d[key] }));
  const setMany = (keys: string[], value: boolean) =>
    setDone((d) => ({
      ...d,
      ...Object.fromEntries(keys.map((k) => [k, value])),
    }));
  const toggleStage = (stage: string) =>
    setOpenStages((s) => ({ ...s, [stage]: !s[stage] }));

  const reset = () => {
    setStep(1);
    setMonths(null);
    setBirth("");
    setBirthTyped("");
    setDone({});
    setOpenStages({});
  };

  function onBirthTypedChange(value: string) {
    const next = formatBirthTyping(value);
    setBirthTyped(next);
    const parsed = parseBirthDisplay(next, today);
    setBirth("iso" in parsed ? parsed.iso : "");
  }

  function openDatePicker() {
    const el = datePickerRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
      return;
    }
    el.click();
  }

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
              type="text"
              inputMode="numeric"
              autoComplete="bday"
              placeholder="DD/MM/AAAA"
              value={birthTyped}
              onChange={(e) => onBirthTypedChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              aria-invalid={Boolean(birthError)}
              aria-describedby="fecha-nac-ayuda"
              className="w-full rounded-[10px] border border-[#D6DEE8] bg-white px-4 py-3.5 pr-12 text-[15px] text-dark outline-none placeholder:text-[#9A93A8] focus:border-[#503C77]"
            />
            <input
              ref={datePickerRef}
              type="date"
              value={birth}
              max={today}
              min="1900-01-01"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => {
                const iso = e.target.value;
                setBirth(iso);
                setBirthTyped(isoToDisplay(iso));
              }}
              className="pointer-events-none absolute h-0 w-0 opacity-0"
            />
            <button
              type="button"
              onClick={openDatePicker}
              className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#503C77]/70 transition hover:bg-[#F3F0F8] hover:text-[#503C77]"
              aria-label="Elegir fecha en el calendario"
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden>
                calendar_month
              </span>
            </button>
          </div>
          <p id="fecha-nac-ayuda" className="mt-2 text-[13px] leading-snug text-muted">
            Escribí la fecha (DD/MM/AAAA) o usá el calendario.
          </p>
          {birthError ? (
            <p className="mt-1.5 text-[13px] font-medium text-[#C2410C]" role="alert">
              {birthError}
            </p>
          ) : null}

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
            {plan?.isChild
              ? "Marcá las del control anterior y las de ahora. Abajo ves solo las del próximo control."
              : "Marcá las vacunas ya aplicadas. Con las que falten armamos tu lista descargable."}
          </p>

          <div className="mt-6 flex flex-col gap-7">
            {groups.map((g) => {
              const t = TONE[g.tone];
              return (
                <div key={g.key}>
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[14px] font-bold leading-tight ${t.sectionLabel}`}
                      >
                        {g.title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted">
                        {g.subtitle}
                        {!g.checkable ? " · Próximas a recibir" : ""}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${t.badge}`}
                    >
                      {g.items.length}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {variant === "byAge" &&
                    g.bucketId === "anteriores" &&
                    g.items.some((v) => v.stage)
                      ? groupByStage(g.items).map(({ stage, items }) => {
                          const keys = items.map((v) => vaccineItemKey(g.key, v));
                          const allDone = keys.every((k) => !!done[k]);
                          const doneCount = keys.filter((k) => !!done[k]).length;
                          const isOpen = collapsibleMonths
                            ? !!openStages[stage]
                            : true;
                          return (
                            <div
                              key={stage}
                              className={`mt-2 first:mt-0 ${
                                collapsibleMonths
                                  ? "overflow-hidden rounded-[10px] border border-[#503C77]/15 bg-[#F7F5FA]/60"
                                  : ""
                              }`}
                            >
                              <div
                                className={`flex items-center justify-between gap-2 ${
                                  collapsibleMonths ? "px-3 py-2.5" : "mb-2"
                                }`}
                              >
                                {collapsibleMonths ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleStage(stage)}
                                    aria-expanded={isOpen}
                                    className={`flex min-w-0 flex-1 items-center gap-2 text-left text-[12px] font-bold uppercase tracking-[0.08em] ${t.sectionLabel}`}
                                  >
                                    <span
                                      aria-hidden
                                      className={`inline-block text-[10px] transition-transform ${
                                        isOpen ? "rotate-90" : ""
                                      }`}
                                    >
                                      ▶
                                    </span>
                                    <span className="min-w-0 truncate">
                                      {stage}
                                      <span className="ml-1.5 font-semibold normal-case tracking-normal text-muted">
                                        · {doneCount}/{items.length}
                                      </span>
                                    </span>
                                  </button>
                                ) : (
                                  <p
                                    className={`text-[12px] font-bold uppercase tracking-[0.08em] ${t.sectionLabel}`}
                                  >
                                    {stage}
                                    <span className="ml-1.5 font-semibold normal-case tracking-normal text-muted">
                                      · {items.length}
                                    </span>
                                  </p>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setMany(keys, !allDone)}
                                  className={`shrink-0 text-[12px] font-bold underline-offset-2 hover:underline ${t.sectionLabel}`}
                                >
                                  {allDone ? "Desmarcar todas" : "Marcar todas"}
                                </button>
                              </div>
                              {isOpen ? (
                                <div
                                  className={`flex flex-col gap-2.5 ${
                                    collapsibleMonths
                                      ? "border-t border-[#503C77]/10 px-3 py-2.5"
                                      : ""
                                  }`}
                                >
                                  {items.map((v) => {
                                    const key = vaccineItemKey(g.key, v);
                                    return (
                                      <VaccineCard
                                        key={key}
                                        v={v}
                                        tone={g.tone}
                                        checkable={g.checkable}
                                        done={!!done[key]}
                                        onToggle={() => toggle(key)}
                                      />
                                    );
                                  })}
                                </div>
                              ) : null}
                            </div>
                          );
                        })
                      : g.items.map((v) => {
                          const key = vaccineItemKey(g.key, v);
                          return (
                            <VaccineCard
                              key={key}
                              v={v}
                              tone={g.tone}
                              checkable={g.checkable}
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

          {pendingCount > 0 || upcomingNames.length > 0 ? (
            <>
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
                      <div key={g.key}>
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
                              key={vaccineItemKey(g.key, v)}
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
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-[24px] font-extrabold leading-tight text-[#503C77] md:text-[28px]">
                    ¡Esquema al día en tu rango!
                  </h2>
                  <p className="mt-3 text-[15px] leading-[1.55] text-dark">
                    Marcaste las vacunas anteriores y actuales. Revisá las
                    próximas y agendá un recordatorio.
                  </p>
                </>
              )}

              {upcomingGroups.length > 0 ? (
                <div className="mt-6 rounded-[12px] border border-[#6D6AAE]/40 bg-[#EEECF2] p-4">
                  <p className="text-[14px] font-bold text-[#6D6AAE]">
                    Vacunas siguientes
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-[#442748]">
                    Próximo control — conviene anticipar el turno.
                  </p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {upcomingGroups.flatMap((g) =>
                      g.items.map((v) => (
                        <li
                          key={vaccineItemKey(g.key, v)}
                          className="rounded-[10px] bg-white/80 px-3 py-2.5"
                        >
                          <p className="text-[14px] font-bold text-[#503C77]">
                            {v.name}
                          </p>
                          <p className="text-[12px] text-muted">{v.detail}</p>
                        </li>
                      )),
                    )}
                  </ul>
                </div>
              ) : null}

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

              {pendingCount > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    void (async () => {
                      // La imagen lleva todo: pendientes + próximas a recibir.
                      const canvas = await buildCanvas(
                        pendingCount,
                        [...pendingGroups, ...upcomingGroups].map((g) => ({
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
              ) : null}

              {reminderNames.length > 0 ? (
                <a
                  href={googleCalendarUrl(reminderNames)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex w-full items-center justify-center rounded-[10px] py-3.5 text-[15px] font-bold transition ${
                    upcomingNames.length > 0
                      ? `${pendingCount > 0 ? "mt-3" : "mt-6"} bg-[#DD876E] text-white hover:brightness-105`
                      : "mt-3 border-2 border-[#503C77] bg-white text-[#503C77] hover:bg-[#503C77]/5"
                  }`}
                >
                  Agendar un recordatorio
                </a>
              ) : null}
            </>
          ) : (
            <>
              <h2 className="mt-3 text-[24px] font-extrabold leading-tight text-[#503C77] md:text-[28px]">
                ¡Estás al día!
              </h2>
              <p className="mt-3 text-[15px] leading-[1.55] text-dark">
                Marcaste todas las vacunas como aplicadas.
              </p>
              {upcomingGroups.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    void (async () => {
                      const canvas = await buildCanvas(
                        0,
                        upcomingGroups.map((g) => ({
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
              ) : null}
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
