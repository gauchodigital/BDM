export const FUNGICA = {
  badge: "POCO FRECUENTE",
  badgeColor: "primary" as const,
  title: "Meningitis fúngica",
  breadcrumb: "Meningitis fúngica",
  intro:
    "Es muy poco frecuente, no se transmite de persona a persona y generalmente se produce en personas con el **sistema inmune debilitado.**[5]",
  queEs: {
    eyebrow: "CONOCÉ LA meningitis fúngica",
    title: "¿Qué es la meningitis fúngica?",
    paragraphs: [
      "La meningitis fúngica o micótica es la inflamación de las meninges después de que una infección micótica se propaga. En personas con el sistema inmunitario debilitado, una infección fúngica (por hongos) puede comenzar en otra parte del cuerpo y luego extenderse a las zonas cercanas al cerebro y la médula espinal.",
      "Por ejemplo, la **inhalación de esporas fúngicas presentes en el ambiente** puede provocar una infección pulmonar, que posteriormente podría extenderse y dar lugar a una meningitis fúngica[5].",
    ],
  },
  gruposRiesgo: {
    eyebrow: "GRUPOS DE RIESGO",
    title: "¿Quiénes tienen mayor riesgo?[5]",
    body: "Cualquier persona puede contraer meningitis fúngica, pero algunas personas tienen un mayor riesgo. Entre ellas:",
    items: [
      {
        lead: "Las personas con el sistema inmunitario debilitado",
        rest: " son las que generalmente desarrollan meningitis fúngica. Ciertas afecciones médicas, como el HIV en fase avanzada y el cáncer, aumentan el riesgo.",
      },
      {
        lead: "Quienes consumen medicamentos que pueden debilitar el sistema inmunológico,",
        rest: " como por ejemplo, aquellos administrados después del trasplante de órganos o medicamentos antifactor de necrosis tumoral (TNF). También quienes consumen esteroides (por ej. prednisona).",
      },
      {
        lead: "Las personas que se someten a intervenciones quirúrgicas,",
        rest: " aunque es muy poco frecuente.",
      },
      {
        lead: "Los bebés prematuros",
        rest: " con un peso muy bajo al nacer tienen un mayor riesgo de contraer una infección fúngica por Candida en el torrente sanguíneo. Estas infecciones pueden extenderse al cerebro.",
      },
      {
        lead: "Vivir en determinadas zonas",
        rest: " puede aumentar el riesgo de sufrir infecciones fúngicas pulmonares. Estas infecciones pueden extenderse al cerebro o a la médula espinal.",
      },
    ],
  },
  tratamiento: {
    eyebrow: "TRATAMIENTO",
    title: "¿Cómo se trata?[5]",
    paragraphs: [
      "Los profesionales de la salud tratan la meningitis fúngica con **medicamentos antifúngicos en dosis elevadas**, que a menudo se administran directamente en una por vía intravenosa. Posteriormente, los pacientes también deben tomar medicamentos antifúngicos por vía oral.",
      "La duración total del tratamiento depende del sistema inmunitario de cada persona y del tipo de hongo que provoque la infección. El tratamiento suele ser más prolongado en personas con un sistema inmunitario debilitado y puede extenderse de por vida.",
    ],
    alert: {
      title: "No hay vacunas disponibles",
      body: "No existe vacuna para proteger contra la meningitis fúngica. Es potencialmente mortal si no se trata adecuadamente.[17]",
    },
  },
  prevencion: {
    eyebrow: "PREVENCIÓN",
    title: "¿Cuándo buscar atención médica de emergencia?",
    body: "Cualquier persona con síntomas de meningitis debe consultar a un profesional de la salud de inmediato. Solo un profesional de la salud puede determinar si tiene meningitis, cuál es la causa y determinar cuál es el mejor tratamiento para su caso[4].",
    ctaLabel: "Conocer más sobre los síntomas",
    ctaHref: "/sintomas",
  },
  otrasCausas: [
    {
      href: "/causas/bacteriana",
      label: "Bacteriana",
      bg: "#FFF0F6",
      text: "#DD876E",
    },
    {
      href: "/causas/viral",
      label: "Viral",
      bg: "#E6D4FE",
      text: "#503C77",
    },
    {
      href: "/causas/parasitaria",
      label: "Parásitos",
      bg: "#DDDDDD",
      text: "#64748B",
    },
  ],
} as const;
