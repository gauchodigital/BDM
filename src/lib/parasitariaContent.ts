export const PARASITARIA = {
  badge: "POCO FRECUENTE",
  badgeColor: "secondary" as const,
  title: "Meningitis parasitaria",
  breadcrumb: "Meningitis por parásitos",
  toc: [
    { id: "que-es", label: "¿Qué es?" },
    { id: "sintomas", label: "Síntomas" },
    { id: "tratamiento", label: "Tratamiento" },
    { id: "prevencion", label: "Prevención" },
  ],
  intro:
    "Los parásitos pueden causar meningitis o afectar el cerebro y el sistema nervioso de otras maneras.",
  queEs: {
    eyebrow: "CONOCÉ LA meningitis parasitaria",
    title: "¿Qué es?",
    paragraphs: [
      "Aunque la meningitis parasitaria es menos común que la meningitis viral y bacteriana, sigue siendo una **amenaza seria para la salud.**[6]",
      "Algunas personas pueden tener un mayor riesgo de infección debido al lugar donde viven o viajan, exponiéndose a ambientes donde estos parásitos son más prevalentes. **El diagnóstico de la meningitis parasitaria puede ser difícil**, y lamentablemente, no existen tratamientos específicos para combatirla, lo que complica aún más su manejo y tratamiento adecuado.[6]",
    ],
  },
  tratamiento: {
    eyebrow: "TRATAMIENTO",
    title: "¿Cómo se trata?",
    paragraphs: [
      "A menudo se necesitan medicamentos como los esteroides para reducir la reacción del organismo ante el parásito.",
      "No todos los pacientes necesitan un tratamiento con medicamentos antiparasitarios. Se pueden utilizar analgésicos para los dolores de cabeza[6].",
    ],
  },
  prevencion: {
    eyebrow: "PREVENCIÓN",
    title: "¿Cuándo buscar atención médica de emergencia?",
    body: "Cualquier persona con síntomas de meningitis debe consultar a un profesional de la salud de inmediato. Solo un profesional de la salud puede asegurar si tiene meningitis, cuál es la causa y determinar cuál es el mejor tratamiento para su caso[4].",
    ctaLabel: "Conocer más sobre los síntomas",
    ctaHref: "/sintomas",
  },
  otrasCausasEyebrow: "OTRAS CAUSAS",
  otrasCausas: [
    {
      href: "/causas/bacteriana",
      label: "Bacteriana",
      bg: "#FFF0F6",
      text: "#DD876E",
    },
    {
      href: "/causas/fungica",
      label: "Hongos",
      bg: "#E6D4FE",
      text: "#503C77",
    },
    {
      href: "/causas/viral",
      label: "Viral",
      bg: "#F0E6FE",
      text: "#503C77",
    },
  ],
} as const;
