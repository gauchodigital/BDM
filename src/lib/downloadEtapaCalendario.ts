import type { VacunaEtapa } from "@/lib/vacunacionData";

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const PURPLE = "#503C77";
const SECONDARY = "#6D6AAE";
const DARK = "#442748";
const MUTED = "#5C5670";
const LINE = "#E5E5E5";

function roundRect(
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

function wrap(
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

/** PNG de la etapa activa (header + grupos + cards), estilo Figma mobile. */
export function buildEtapaCalendarioCanvas(etapa: VacunaEtapa): HTMLCanvasElement {
  const scale = Math.min(3, Math.max(2, window.devicePixelRatio || 2));
  const W = 720;
  const PAD = 28;
  const contentW = W - PAD * 2;
  const measure = document.createElement("canvas").getContext("2d")!;

  const fTitle = `800 28px ${FONT}`;
  const fSub = `400 18px ${FONT}`;
  const fBadge = `700 12px ${FONT}`;
  const fName = `700 22px ${FONT}`;
  const fDetail = `400 18px ${FONT}`;

  type Op =
    | { t: "header"; h: number }
    | { t: "badge"; text: string; y: number; tone: "primary" | "secondary" }
    | {
        t: "card";
        nameLines: string[];
        detailLines: string[];
        y: number;
        h: number;
      };

  const ops: Op[] = [];
  const titleLines = wrap(measure, etapa.bannerTitle, fTitle, contentW - 70);
  const subLines = wrap(measure, etapa.bannerSubtitle, fSub, contentW - 70);
  const headerH = 28 + 44 + 12 + titleLines.length * 34 + 8 + subLines.length * 24 + 28;
  ops.push({ t: "header", h: headerH });

  let y = headerH + 28;
  for (let gi = 0; gi < etapa.grupos.length; gi++) {
    const grupo = etapa.grupos[gi]!;
    ops.push({
      t: "badge",
      text: grupo.badge,
      y,
      tone: "primary",
    });
    y += 44;
    for (const v of grupo.vacunas) {
      const nameLines = wrap(measure, v.nombre, fName, contentW - 40);
      const detailLines = v.detalle
        ? wrap(measure, v.detalle, fDetail, contentW - 40)
        : [];
      const h =
        20 +
        nameLines.length * 28 +
        (detailLines.length ? 6 + detailLines.length * 24 : 0) +
        20;
      ops.push({ t: "card", nameLines, detailLines, y, h });
      y += h + 12;
    }
    y += 20;
  }
  y += PAD;
  const H = y;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.textBaseline = "top";

  // Fondo blanco + borde suave
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 0, 0, W, H, 24);
  ctx.fill();
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, W - 2, H - 2, 24);
  ctx.stroke();

  for (const op of ops) {
    if (op.t === "header") {
      ctx.fillStyle = PURPLE;
      // header con esquinas superiores redondeadas
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(W - 24, 0);
      ctx.quadraticCurveTo(W, 0, W, 24);
      ctx.lineTo(W, op.h);
      ctx.lineTo(0, op.h);
      ctx.lineTo(0, 24);
      ctx.quadraticCurveTo(0, 0, 24, 0);
      ctx.closePath();
      ctx.fill();

      // icono círculo
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(PAD + 22, 28 + 22, 22, 0, Math.PI * 2);
      ctx.fill();
      // silueta simple
      ctx.fillStyle = PURPLE;
      ctx.beginPath();
      ctx.arc(PAD + 22, 28 + 16, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(PAD + 22, 28 + 36, 12, 10, 0, Math.PI, 0);
      ctx.fill();

      let ty = 28;
      ctx.fillStyle = "#ffffff";
      ctx.font = fTitle;
      for (const l of titleLines) {
        ctx.fillText(l, PAD + 60, ty);
        ty += 34;
      }
      ty += 8;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = fSub;
      for (const l of subLines) {
        ctx.fillText(l, PAD + 60, ty);
        ty += 24;
      }
    } else if (op.t === "badge") {
      measure.font = fBadge;
      const tw = measure.measureText(op.text).width;
      const bw = tw + 28;
      const bh = 32;
      ctx.fillStyle = op.tone === "primary" ? PURPLE : SECONDARY;
      roundRect(ctx, PAD, op.y, bw, bh, 8);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = fBadge;
      ctx.fillText(op.text, PAD + 14, op.y + 10);
    } else {
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, PAD, op.y, contentW, op.h, 14);
      ctx.fill();
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 1.5;
      roundRect(ctx, PAD, op.y, contentW, op.h, 14);
      ctx.stroke();

      let ty = op.y + 20;
      ctx.fillStyle = PURPLE;
      ctx.font = fName;
      for (const l of op.nameLines) {
        ctx.fillText(l, PAD + 20, ty);
        ty += 28;
      }
      ty += 6;
      ctx.fillStyle = DARK;
      ctx.font = fDetail;
      for (const l of op.detailLines) {
        ctx.fillStyle = MUTED;
        ctx.fillText(l, PAD + 20, ty);
        ty += 24;
      }
    }
  }

  return canvas;
}

export async function downloadEtapaCalendario(etapa: VacunaEtapa) {
  const canvas = buildEtapaCalendarioCanvas(etapa);
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/png"),
  );
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `calendario-${etapa.id}-bdm.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
