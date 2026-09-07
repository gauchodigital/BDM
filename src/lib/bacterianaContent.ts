export const BACTERIANA = {
  badge: "MÁS GRAVE",
  title: "Meningitis bacteriana",
  breadcrumb: "Meningitis bacteriana",
  intro: [
    "**Es la más grave de todas y puede causar la muerte en pocas horas o dejar discapacidades severas**.[1]",
    "En nuestro país se han incluido vacunas para algunas variantes a fin de disminuir la cantidad de casos y la mortalidad, así como también disminuir las secuelas graves y permanentes.[8]",
  ],
  toc: [
    { id: "que-es", label: "¿Qué es la meningitis bacteriana?" },
    { id: "sintomas", label: "Síntomas" },
    { id: "grupos-riesgo", label: "Grupos de riesgo" },
    {
      id: "meningococo",
      label: "Meningitis por meningococo",
      children: [
        { id: "meningococo", label: "¿Qué es?" },
        { id: "secuelas", label: "Secuelas" },
        { id: "prevencion", label: "Prevención" },
      ],
    },
  ],
  queEs: {
    eyebrow: "CONOCÉ LA meningitis bacteriana",
    title: "¿Qué es?",
    paragraphs: [
      "La meningitis bacteriana es el **tipo de infección más grave que afecta a las meninges** (el tejido que recubre el cerebro y la médula espinal)[1].",
    ],
    bacteriaIntro: "Algunos tipos de bacterias que causan la meningitis son[1]:",
    bacterias: [
      "Meningococo (Neisseria Meningitidis)",
      "Neumococo (Streptococo pneumoniae)",
      "Haemophilous Influenzae tipo b",
      "Streptococo del grupo B",
    ],
    stat: {
      ratio: "1 de cada 6",
      label: "personas que contraen meningitis bacteriana muere[1]",
      total: 6,
      active: 1,
      activeIcon: "/causas/bacteriana/person-active.svg",
      inactiveIcon: "/causas/bacteriana/person-inactive.svg",
    },
  },
  sintomas: {
    eyebrow: "¿cómo reconocerla?",
    title: "Síntomas de la meningitis bacteriana",
    body: "Las bacterias causantes de meningitis pueden provocar otros síntomas si infectan la sangre del torrente circulatorio, que pueden desembocar rápidamente en septicemia. Los síntomas más habituales son[1]:",
    items: [
      "Frío en manos y pies",
      "Presión arterial baja",
      "Respiración más rápida de lo habitual",
      "Erupciones de la piel de color rojo o púrpura oscuro (petequias) que no desaparece al estirar la piel",
    ],
  },
  gruposRiesgo: {
    eyebrow: "¿a quiénes afecta?",
    title: "Grupos de riesgo",
    body: "La meningitis puede contagiarse a cualquier edad. Sin embargo, las meningitis bacterianas afectan con más frecuencia a los **niños de hasta cinco años de edad**.[9]",
    items: [
      {
        title: "Meningococo",
        body: "Es más frecuente en menores de un año (con picos entre los 3 y 5 meses), pero también afecta a adolescentes y a adultos jóvenes.",
      },
      {
        title: "Neumococo",
        body: "Es más frecuente entre los 2 meses y los 3 años, volviendo a aumentar el riesgo a partir de los 65 años.",
      },
      {
        title: "Haemophilous Influenzae",
        body: "Afecta, en general, a niños de 2 meses a 3 años.",
      },
    ],
  },
  meningococo: {
    eyebrow: "informate sobre el meningococo",
    title: "Meningitis por Meningococo",
    body: "El **meningococo** o **Neisseria meningitidis** es una de las principales causas de meningitis en todo el mundo. Esta bacteria es la responsable de la **Enfermedad Meningocócica Invasiva (EMI)**, que ocurre cuando el meningococo invade la vía sanguínea (\"septicemia\").[10]",
    serogruposTitle: "Serogrupos",
    serogruposBody: [
      "El meningococo se clasifica en 12 tipos (\"serogrupos\"), de los cuales 6 son los causantes de la meningitis por meningococo[11].",
      "En Argentina contamos con **vacunas** para prevenir los **5 serogrupos más frecuentes**.[12,13]",
    ],
    serogrupos: ["A", "B", "C", "W", "X", "Y"] as const,
    highlightSerogrupo: "B",
    chartTitle: "Casos en Argentina 2024",
    chart: [
      { label: "Serogrupo B", pct: 74, color: "#503c77" },
      { label: "Serogrupo C", pct: 11, color: "#6d6aae" },
      { label: "Serogrupo W", pct: 7, color: "#a6c0d6" },
      { label: "Serogrupo Y", pct: 6, color: "#dd876e" },
      { label: "No agrupables", pct: 2, color: "#94a3b8" },
    ],
    malbranStat: {
      pct: "95%",
      text: "de los casos de meningococo en **menores de 1 año** fue por el **serogrupo B**, en el período 2022–2024 en Argentina.[14]",
    },
  },
  secuelas: {
    eyebrow: "posibles COMPLICACIONES",
    title: "Secuelas[15]",
    items: [
      {
        label: "Pérdida de la capacidad auditiva",
        icon: "/causas/bacteriana/secuela-auditiva-icon.svg",
        composite: false,
      },
      {
        label: "Complicaciones neurológicas",
        icon: "/causas/bacteriana/secuela-neuro-full.svg",
        composite: true,
      },
      {
        label: "Complicaciones cutáneas",
        icon: "/causas/bacteriana/secuela-cutanea-icon.svg",
        composite: false,
      },
      {
        label: "Pérdida de una o más extremidades",
        icon: "/causas/bacteriana/secuela-extremidades-full.svg",
        composite: true,
      },
      {
        label: "Fallo renal: puede requerir diálisis",
        icon: "/causas/bacteriana/secuela-renal-full.svg",
        composite: true,
      },
      {
        label: "Complicaciones psicosociales",
        icon: "/causas/bacteriana/secuela-psico-full.svg",
        composite: true,
      },
    ],
    stat: {
      ratio: "1 de cada 5",
      label: "sobrevivientes pueden tener secuelas permanentes.[5]",
      total: 5,
      active: 1,
      highlightIndex: 1,
      activeIcon: "/causas/bacteriana/person-active-coral.svg",
      inactiveIcon: "/causas/bacteriana/person-inactive-secondary.svg",
    },
  },
  quote:
    "La **evolución de la meningitis por meningococo suele ser rápida** e incluso con un tratamiento adecuado, algunos pacientes pueden fallecer entre las **primeras 24 a 48 horas de la aparición de los síntomas**.[10]",
  vacunacion: {
    eyebrow: "medidas de prevención",
    title: "Vacunación contra el meningococo",
    paragraphs: [
      "La vacunación es el **método más efectivo para prevenir** la meningitis por meningococo[16].",
      "En el Calendario Nacional de Inmunizaciones está incluida, desde 2017, la vacuna para los serogrupos A, C, W e Y[12]. Esta vacuna se incorporó:",
    ],
    bullets: [
      {
        title: "En lactantes",
        body: ": con el objetivo de lograr una protección directa en este grupo[12].",
      },
      {
        title: "En adolescentes",
        body: ": con el objetivo de proteger de forma directa a este grupo y, a su vez, de forma indirecta al resto de la población, ya que gracias a la vacunación disminuye la transmisión de la bacteria[12].",
      },
    ],
    esquemasTitle: "Esquemas de vacunación[8]",
    esquemas: [
      {
        badge: "ESQUEMA LACTANTES",
        doses: [
          "1° dosis: 3 meses de edad.",
          "2° dosis: 5 meses de edad.",
          "3° dosis (refuerzo): 15 meses de edad.",
        ],
      },
      {
        badge: "ESQUEMA ADOLESCENTES",
        doses: ["1 dosis: nacidos en 2015"],
      },
    ],
    serogrupoB: {
      title: "Vacuna para el serogrupo B",
      body: "Existe además otra **vacuna para la prevención contra el serogrupo B** que está disponible según indicación médica. En el Calendario Nacional de Vacunación se encuentra disponible para aquellas personas que presenten las siguientes condiciones de riesgo:[13]",
      conditions: [
        "Asplenia anatómica o funcional",
        "Déficit de factores terminales del complemento (C5–C9)",
        "Pacientes bajo tratamiento con anticuerpos monoclonales humanizados que inhiban la activación del complemento terminal",
        "Niños con infección por VIH/sida (menores de 18 años)",
        "Trabajadores que manipulen o procesen cultivos bacteriológicos con potencial exposición a Neisseria meningitidis",
      ],
    },
  },
  prevencion: {
    eyebrow: "OTROS CONSEJOS",
    title: "Prevención",
    body: "Además de las vacunas, **otras medidas de prevención son**: lavarse las manos, taparse la nariz al estornudar o toser y mantener una buena ventilación dentro de la casa[17].",
    ctaLabel: "Calendario de Vacunación",
    ctaHref: "/vacunacion#calendario",
  },
  otrasCausas: [
    {
      href: "/causas/viral",
      label: "Viral",
      bg: "#F3F0F8",
      text: "#503C77",
    },
    {
      href: "/causas/fungica",
      label: "Fúngica",
      bg: "#F0E6FE",
      text: "#503C77",
    },
    {
      href: "/causas/parasitaria",
      label: "Parasitaria",
      bg: "#DDDDDD",
      text: "#64748B",
    },
  ],
} as const;
