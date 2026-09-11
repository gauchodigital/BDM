/** Contenido del quiz de campaña — Día Mundial de la Meningitis. */

export const QUIZ_COUNTDOWN_SECONDS = 5;

export const QUIZ_CTA_HREF = "/causas/bacteriana";
export const QUIZ_CTA_LABEL = "Conocé más sobre meningitis bacteriana";

export const QUIZ_OPTIONS = [
  {
    id: "A",
    label: "Es una enfermedad leve similar a una gripe.",
  },
  {
    id: "B",
    label: "Puede evolucionar rápidamente y causar discapacidades severas.",
  },
  {
    id: "C",
    label: "Solo afecta a personas con enfermedades previas.",
  },
] as const;

export type QuizOptionId = (typeof QUIZ_OPTIONS)[number]["id"];

/** Opción correcta: B */
export const QUIZ_CORRECT_ID: QuizOptionId = "B";

export const QUIZ_COPY = {
  /** Campaña activa del 1 sep al 15 oct (ver worldMeningitisDay.ts). */
  eyebrow: "5 de octubre – Día Mundial de la Meningitis",
  teaseTitle: "¿Cuánto sabés sobre la meningitis bacteriana?",
  teaseHint: "Preparate…",
  question:
    "¿Cuál de estas afirmaciones sobre meningitis bacteriana creés que es correcta?",
  correctTitle: "¡Sí, es correcta!",
  correctBody:
    "La meningitis bacteriana puede causar la muerte en pocas horas o dejar discapacidades severas[1]. Por eso, ante la sospecha de meningitis es importante consultar de forma inmediata con un profesional de la salud[1].",
  correctFooter:
    "Aprovechá el Día Mundial de la Meningitis para seguir informándote.",
  wrongTitle: "No era esa, pero ahora ya lo sabés.",
  wrongBody:
    "La meningitis bacteriana puede avanzar rápidamente y requiere atención médica urgente[1].",
  wrongFooter:
    "Aprovechá el Día Mundial de la Meningitis para seguir informándote.",
} as const;

export function isQuizAnswerCorrect(id: QuizOptionId): boolean {
  return id === QUIZ_CORRECT_ID;
}
