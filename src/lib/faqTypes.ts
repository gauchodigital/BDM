export const FAQ_CATEGORIES = [
  { id: "por-que-vacunarse", label: "¿Por qué vacunarse?" },
  { id: "calendario", label: "Calendario de vacunación" },
  { id: "que-son", label: "¿Qué son las vacunas?" },
  { id: "meningitis", label: "La meningitis" },
] as const;

export type FaqCategoryId = (typeof FAQ_CATEGORIES)[number]["id"];

export interface FaqData {
  id: string;
  category: FaqCategoryId | string;
  question: string;
  answer: string;
  visible: boolean;
}
