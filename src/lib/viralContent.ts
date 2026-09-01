export const VIRAL = {
  badge: "MÁS FRECUENTE",
  title: "Meningitis viral",
  breadcrumb: "Meningitis por virus",
  intro:
    "Si bien las meningitis virales tienden a ser menos graves que otros tipos, los síntomas iniciales suelen ser muy parecidos a los síntomas habituales de la meningitis.[4]",
  queEs: {
    eyebrow: "CONOCÉ LA meningitis viral",
    title: "¿Qué es?",
    body: "La meningitis es la inflamación de las membranas protectoras del cerebro y la médula espinal que puede estar provocada por una infección viral. Hay muchos virus que pueden causar meningitis, entre ellos, los virus del herpes, de la influenza, etc.[4]",
  },
  gruposRiesgo: {
    eyebrow: "¿a quiénes afecta?",
    title: "Grupos de riesgo[4]",
    body: "Cualquier persona puede contraer meningitis viral. Sin embargo, los siguientes **factores pueden aumentar el riesgo de padecerla**.",
    items: [
      {
        title: "Edad",
        bullets: [
          "Los niños menores de 5 años tienen un mayor riesgo de contraer meningitis viral.",
          "Los bebés menores de 1 mes son los que tienen más probabilidades de presentar una enfermedad grave si contraen meningitis viral.",
        ],
      },
      {
        title: "Afecciones médicas",
        body: "Las personas con un sistema inmunitario debilitado tienen un mayor riesgo de contraer meningitis viral y de que la enfermedad sea grave. Las enfermedades, algunos medicamentos (como la quimioterapia) y los trasplantes recientes de órganos o de médula ósea.",
      },
    ],
  },
  tratamiento: {
    eyebrow: "tratamiento",
    title: "¿Cómo se trata?",
    paragraphs: [
      "En la mayoría de los casos, no existe un tratamiento específico para la meningitis viral. En general, las personas con meningitis viral leve suelen recuperarse por sí solas en un plazo de **7 a 10 días**.",
      "Quienes desarrollan una meningitis viral grave, o que corren el riesgo de desarrollarla, pueden necesitar hospitalización.",
      "Para algunos tipos de meningitis virales existen **tratamientos con medicación antiviral**[4].",
    ],
  },
  prevencion: {
    eyebrow: "PREVENCIÓN",
    title: "¿Cuándo buscar atención médica de emergencia?",
    body: "Cualquier persona con síntomas de meningitis debe consultar a un profesional de la salud de inmediato. Solo un profesional de la salud puede asegurar si tiene meningitis, cuál es la causa y determinar cuál es el mejor tratamiento para su caso[4].",
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
      href: "/causas/fungica",
      label: "Fúngica",
      bg: "#F0E6FE",
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
