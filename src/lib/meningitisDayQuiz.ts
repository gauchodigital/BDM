/** Contenido de prueba del quiz de campaña — se puede editar sin tocar la UI. */

export const QUIZ_COUNTDOWN_SECONDS = 3;

export const QUIZ_CTA_HREF = "/causas/bacteriana";
export const QUIZ_CTA_LABEL = "Conocé más sobre meningitis bacteriana";

export const QUIZ_OPTIONS = [
  {
    id: "A",
    label: "La meningitis bacteriana puede avanzar rápidamente.",
  },
  {
    id: "B",
    label: "Si los síntomas son leves, siempre se puede esperar en casa.",
  },
  {
    id: "C",
    label: "La meningitis solo puede afectar a los más chicos.",
  },
] as const;

export type QuizOptionId = (typeof QUIZ_OPTIONS)[number]["id"];

export const QUIZ_CORRECT_ID: QuizOptionId = "A";

export const QUIZ_COPY = {
  eyebrow: "5 de octubre · Día Mundial de la Meningitis",
  teaseTitle: "¿Cuánto sabés realmente sobre meningitis?",
  teaseHint: "Pensá tu respuesta…",
  question: "¿Cuál de estas afirmaciones sobre meningitis creés que es verdadera?",
  correctTitle: "¡Sí, es verdad!",
  correctBody:
    "La meningitis bacteriana puede avanzar rápidamente. Por eso, ante síntomas compatibles, es importante consultar de inmediato.",
  correctFooter: "Informarse también es una forma de prevenir.",
  wrongTitle: "No era esa, pero ahora ya lo sabés.",
  wrongBody:
    "La meningitis bacteriana puede avanzar rápidamente y requiere atención médica urgente.",
  wrongFooter: "Aprovechá el Día Mundial de la Meningitis para seguir informándote.",
} as const;

export function isQuizAnswerCorrect(id: QuizOptionId): boolean {
  return id === QUIZ_CORRECT_ID;
}
