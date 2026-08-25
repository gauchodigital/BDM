/** Fondos/textos de cards “explorá otras causas” (por slug). */
export const CAUSA_CARD_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
  bacteriana: { bg: "#FFF0F6", text: "#DD876E" },
  viral: { bg: "#503C77", text: "#503C77" },
  fungica: { bg: "#F0E6FE", text: "#503C77" },
  hongos: { bg: "#E6D4FE", text: "#503C77" },
  parasitaria: { bg: "#DDDDDD", text: "#64748B" },
};

export type CausaCardLink = {
  href: string;
  label: string;
  bg: string;
  text: string;
};
