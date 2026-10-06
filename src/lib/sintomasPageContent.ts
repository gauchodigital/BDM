/** Contenido estático de la página /sintomas (tabs secundarios + transmisión). */

import type { SintomaData } from "@/lib/sintomasData";

export const SINTOMAS_PAGE = {
  hero: {
    title: "Síntomas habituales de la meningitis",
    body: "Las manifestaciones clínicas de los pacientes con meningitis varían en función de la causa, la evolución de la enfermedad, la edad y otros factores[1,3]. Reconocer los síntomas a tiempo puede salvar una vida.",
  },
  phases: {
    early: {
      badge: "Primeras 12hs · Síntomas inespecíficos[28]",
      lead: "Pueden confundirse con otras enfermedades. Prestá atención si aparecen juntos.",
    },
    alarm: {
      badge: "Pasadas las 12hs · Señales de alarma[28]",
      lead: "Si aparecen estos síntomas, buscá atención médica de inmediato.",
    },
    warning:
      "Ante la presencia de estos síntomas, consultá al médico o pediatra. La meningitis es una urgencia médica y requiere de hospitalización inmediata.",
  },
  propaga: {
    title: "¿Cómo se propaga?",
    body: "La meningitis se transmite, en la mayoría de los casos, **por vía respiratoria** desde una persona enferma o desde portadores asintomáticos por medio de la tos, los estornudos, los besos y también al compartir utensilios.[7]",
  },
} as const;

export type SintomasTabId =
  | "habituales"
  | "lactantes"
  | "recien-nacidos"
  | "bacteriana"
  | "menos-frecuentes";

export const SINTOMAS_TABS: { id: SintomasTabId; label: string }[] = [
  { id: "habituales", label: "Síntomas habituales" },
  { id: "lactantes", label: "En lactantes" },
  { id: "recien-nacidos", label: "En recién nacidos" },
  { id: "bacteriana", label: "Meningitis bacteriana" },
  { id: "menos-frecuentes", label: "Menos frecuentes" },
];

export type SintomaExtraItem = {
  label: string;
  description: string;
  icon: string;
};

export const RECIEN_NACIDOS_CONTENT = {
  title: "Síntomas en recién nacidos",
  intro: "A veces, los lactantes presentan síntomas distintos de los adultos:",
  items: [
    {
      label: "Fiebre",
      description: "",
      icon: "/causas/bacteriana/sintomas/lactantes-fiebre.png",
    },
    {
      label: "Llanto constante",
      description: "",
      icon: "/causas/bacteriana/sintomas/lactantes-irritacion.png",
    },
    {
      label: "Somnolencia o irritabilidad excesiva",
      description: "",
      icon: "/causas/bacteriana/sintomas/lactantes-somnolencia.png",
    },
    {
      label: "Dificultad para despertar del sueño",
      description: "",
      icon: "/causas/bacteriana/sintomas/lactantes-somnolencia.png",
    },
    {
      label: "Lentitud o inactividad",
      description: "",
      icon: "/causas/bacteriana/sintomas/lactantes-rigidez.png",
    },
  ] as SintomaExtraItem[],
  viral: {
    eyebrow: "Conocé la meningitis viral",
    title: "¿Qué es?",
    body: "La meningitis es la inflamación de las membranas protectoras del cerebro y la médula espinal que puede estar provocada por una infección viral.\n\nHay muchos virus que pueden causar meningitis, entre ellos, los virus del herpes, de la influenza, etc.",
  },
} as const;

export const LACTANTES_SUBTABS = [
  { id: "lactantes-rn", label: "En lactantes y recién nacidos" },
  { id: "ninos-adultos", label: "Niños y adultos" },
] as const;

/** Timeline adultos / Niños y adultos. */
export const ADULTOS_TIMELINE: SintomaData[] = [
  {
    id: "fiebre",
    label: "Fiebre",
    description: "",
    icon: "/brand/sintomas/fiebre.png",
    phase: "early",
    visible: true,
  },
  {
    id: "dolor-cabeza",
    label: "Dolor de cabeza",
    description: "",
    icon: "/brand/sintomas/dolor-cabeza.png",
    phase: "early",
    visible: true,
  },
  {
    id: "nauseas",
    label: "Náuseas o vómitos",
    description: "",
    icon: "/brand/sintomas/nauseas.png",
    phase: "early",
    visible: true,
  },
  {
    id: "irritabilidad",
    label: "Irritabilidad",
    description: "",
    icon: "/brand/sintomas/irritabilidad.png",
    phase: "early",
    visible: true,
  },
  {
    id: "somnolencia",
    label: "Somnolencia",
    description: "",
    icon: "/brand/sintomas/somnolencia.png",
    phase: "early",
    visible: true,
  },
  {
    id: "cuello-rigido",
    label: "Cuello rígido",
    description: "",
    icon: "/brand/sintomas/cuello-rigido.png",
    phase: "alarm",
    visible: true,
  },
  {
    id: "rechazo-luz",
    label: "Rechazo a la luz",
    description: "",
    icon: "/brand/sintomas/rechazo-luz.png",
    phase: "alarm",
    visible: true,
  },
  {
    id: "petequias",
    label: "Petequias",
    description:
      "Erupciones de la piel de color rojo o púrpura oscuro.",
    icon: "/brand/sintomas/petequias.png",
    phase: "alarm",
    visible: true,
  },
];

/** Timeline En lactantes y recién nacidos. */
export const LACTANTES_RN_TIMELINE: SintomaData[] = [
  {
    id: "lac-fiebre",
    label: "Fiebre",
    description: "",
    icon: "/causas/bacteriana/sintomas/lactantes-fiebre.png",
    phase: "early",
    visible: true,
  },
  {
    id: "lac-rechazo-alimento",
    label: "Rechazo al alimento",
    description: "",
    icon: "/causas/bacteriana/sintomas/lactantes-alimentacion.png",
    phase: "early",
    visible: true,
  },
  {
    id: "lac-irritabilidad",
    label: "Irritabilidad y llanto continuo",
    description: "",
    icon: "/causas/bacteriana/sintomas/lactantes-irritacion.png",
    phase: "early",
    visible: true,
  },
  {
    id: "lac-somnolencia",
    label: "Somnolencia",
    description: "",
    icon: "/causas/bacteriana/sintomas/lactantes-somnolencia.png",
    phase: "early",
    visible: true,
  },
  {
    id: "lac-cuello-rigido",
    label: "Cuello rígido",
    description: "",
    icon: "/brand/sintomas/cuello-rigido.png",
    phase: "alarm",
    visible: true,
  },
  {
    id: "lac-rechazo-luz",
    label: "Rechazo a la luz",
    description: "",
    icon: "/brand/sintomas/rechazo-luz.png",
    phase: "alarm",
    visible: true,
  },
  {
    id: "lac-petequias",
    label: "Petequias",
    description: "Erupciones de la piel de color rojo o púrpura oscuro.",
    icon: "/brand/sintomas/petequias.png",
    phase: "alarm",
    visible: true,
  },
  {
    id: "lac-fontanela",
    label: "Fontanela abultada",
    description: "Parte superior de la cabeza del bebé[1].",
    icon: "/brand/sintomas/fontanela.png",
    phase: "alarm",
    visible: true,
  },
];

export function splitTimeline(items: SintomaData[]) {
  return {
    early: items.filter((s) => s.phase === "early"),
    alarm: items.filter((s) => s.phase === "alarm"),
  };
}

/** Tabs que no usan early/alarm del JSON principal. */
export const SINTOMAS_TAB_CONTENT: Record<
  "bacteriana" | "menos-frecuentes",
  {
    intro: string;
    items: SintomaExtraItem[];
    ctaHref?: string;
    ctaLabel?: string;
  }
> = {
  bacteriana: {
    intro:
      "La meningitis bacteriana es la más grave y puede progresar en pocas horas. Estos son síntomas frecuentes en mayores de 2 años.[1,3]",
    ctaHref: "/causas/bacteriana",
    ctaLabel: "Ver meningitis bacteriana",
    items: [
      {
        label: "Dolor de cabeza intenso",
        description: "Cefalea fuerte y persistente.",
        icon: "/causas/bacteriana/sintomas/mayores-dolor-cabeza.png",
      },
      {
        label: "Fiebre alta",
        description: "Aparición súbita de temperatura elevada.",
        icon: "/causas/bacteriana/sintomas/mayores-fiebre.png",
      },
      {
        label: "Rigidez de cuello",
        description: "Dolor o imposibilidad de flexionar el cuello hacia el pecho.",
        icon: "/causas/bacteriana/sintomas/mayores-rigidez-cuello.png",
      },
      {
        label: "Náuseas y vómitos",
        description: "Sin causa alimentaria clara.",
        icon: "/causas/bacteriana/sintomas/mayores-nauseas.png",
      },
      {
        label: "Rechazo a la luz",
        description: "Fotofobia o molestia intensa ante la luz.",
        icon: "/causas/bacteriana/sintomas/mayores-rechazo-luz.png",
      },
      {
        label: "Confusión",
        description: "Alteración del estado mental o desorientación.",
        icon: "/causas/bacteriana/sintomas/mayores-confusion.png",
      },
      {
        label: "Convulsiones",
        description: "Pueden aparecer en el curso de la enfermedad.",
        icon: "/causas/bacteriana/sintomas/mayores-convulsiones.png",
      },
      {
        label: "Escalofríos",
        description: "Temblor o sensación de frío intenso.",
        icon: "/causas/bacteriana/sintomas/mayores-escalofrios.png",
      },
    ],
  },
  "menos-frecuentes": {
    intro:
      "Algunos signos aparecen con menos frecuencia, pero también requieren atención médica urgente si se presentan junto a otros síntomas de meningitis.",
    items: [
      {
        label: "Confusión o desorientación",
        description: "Cambios en el estado de conciencia o dificultad para razonar.",
        icon: "/causas/bacteriana/sintomas/mayores-confusion.png",
      },
      {
        label: "Convulsiones",
        description: "Crisis convulsivas asociadas al cuadro infeccioso.",
        icon: "/causas/bacteriana/sintomas/mayores-convulsiones.png",
      },
      {
        label: "Escalofríos",
        description: "Temblores o sensación intensa de frío.",
        icon: "/causas/bacteriana/sintomas/mayores-escalofrios.png",
      },
      {
        label: "Erupción cutánea",
        description:
          "Manchas rojizas o moradas que no desaparecen al presionar (petequias).",
        icon: "/brand/sintomas/petequias.png",
      },
    ],
  },
};
