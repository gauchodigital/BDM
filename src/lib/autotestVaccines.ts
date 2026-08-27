/** Vacunas orientativas por edad — Calendario Nacional AR. Validar con cliente. */

export type Vaccine = { name: string; detail: string };
export type VaccineReco = { calendario: Vaccine[]; recomendadas: Vaccine[] };

export function monthsBetween(birth: Date, now: Date): number {
  let m =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) m -= 1;
  return Math.max(0, m);
}

/** Badge corto como en Figma ("3 meses", "5 años"). */
export function ageBadge(months: number): string {
  if (months <= 0) return "Recién nacido";
  if (months < 24) return `${months} ${months === 1 ? "mes" : "meses"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "año" : "años"}`;
}

export function recommendVaccines(months: number): VaccineReco {
  const years = Math.floor(months / 12);

  if (months < 2)
    return {
      calendario: [
        { name: "BCG", detail: "Tuberculosis · dosis única al nacer" },
        {
          name: "Hepatitis B",
          detail: "Dentro de las primeras 12 horas de vida",
        },
      ],
      recomendadas: [],
    };

  if (months < 4)
    return {
      calendario: [
        {
          name: "Pentavalente (5 en 1)",
          detail:
            "1ª dosis · difteria, tétanos, tos convulsa, Hib y hepatitis B",
        },
        { name: "Salk (IPV)", detail: "Poliomielitis · 1ª dosis" },
        { name: "Neumococo conjugada", detail: "1ª dosis" },
        { name: "Rotavirus", detail: "1ª dosis (vía oral)" },
        {
          name: "Meningococo ACYW",
          detail: "1ª dosis (desde los 3 meses)",
        },
      ],
      recomendadas: [
        {
          name: "Meningococo B",
          detail: "Vacunación particular · consultar esquema",
        },
      ],
    };

  if (months < 6)
    return {
      calendario: [
        { name: "Pentavalente (5 en 1)", detail: "2ª dosis" },
        { name: "Salk (IPV)", detail: "2ª dosis" },
        { name: "Neumococo conjugada", detail: "2ª dosis" },
        { name: "Rotavirus", detail: "2ª dosis" },
        {
          name: "Meningococo ACYW",
          detail: "2ª dosis (a los 5 meses)",
        },
      ],
      recomendadas: [
        {
          name: "Meningococo B",
          detail: "Vacunación particular · consultar esquema",
        },
      ],
    };

  if (months < 12)
    return {
      calendario: [
        { name: "Pentavalente (5 en 1)", detail: "3ª dosis (6 meses)" },
        { name: "Salk (IPV)", detail: "3ª dosis (6 meses)" },
        {
          name: "Gripe",
          detail: "Anual · 2 dosis el primer año (desde los 6 meses)",
        },
      ],
      recomendadas: [
        { name: "COVID-19", detail: "Según esquema vigente" },
        {
          name: "Meningococo B",
          detail: "Vacunación particular · consultar esquema",
        },
      ],
    };

  if (months < 15)
    return {
      calendario: [
        {
          name: "Triple viral (SRP)",
          detail: "1ª dosis · sarampión, rubéola y paperas",
        },
        { name: "Neumococo conjugada", detail: "Refuerzo" },
        { name: "Hepatitis A", detail: "Dosis única (12 meses)" },
        { name: "Gripe", detail: "Dosis anual" },
      ],
      recomendadas: [
        {
          name: "Meningococo B",
          detail: "Vacunación particular · consultar esquema",
        },
      ],
    };

  if (months < 24)
    return {
      calendario: [
        { name: "Meningococo ACYW", detail: "Refuerzo (15 meses)" },
        {
          name: "Cuádruple / Quíntuple bacteriana",
          detail: "1er refuerzo (15-18 meses)",
        },
        { name: "Varicela", detail: "1ª dosis (15 meses)" },
        {
          name: "Hepatitis A",
          detail: "Si no la recibió a los 12 meses",
        },
      ],
      recomendadas: [
        { name: "Gripe", detail: "Dosis anual" },
        {
          name: "Meningococo B",
          detail: "Vacunación particular · consultar esquema",
        },
      ],
    };

  if (years < 5)
    return {
      calendario: [
        {
          name: "Refuerzos pendientes",
          detail: "Completá el esquema de los primeros 2 años",
        },
      ],
      recomendadas: [
        { name: "Gripe", detail: "Dosis anual (grupos de riesgo)" },
        { name: "COVID-19", detail: "Según esquema vigente" },
        {
          name: "Meningococo B",
          detail: "Vacunación particular · consultar esquema",
        },
      ],
    };

  if (years <= 6)
    return {
      calendario: [
        {
          name: "Triple viral (SRP)",
          detail: "2ª dosis (ingreso escolar)",
        },
        {
          name: "Triple bacteriana celular (DTP)",
          detail: "Refuerzo (ingreso escolar)",
        },
        { name: "Salk (IPV)", detail: "Refuerzo (ingreso escolar)" },
        { name: "Varicela", detail: "2ª dosis" },
      ],
      recomendadas: [
        { name: "Gripe", detail: "Dosis anual" },
        {
          name: "Meningococo B",
          detail: "Vacunación particular · consultar esquema",
        },
      ],
    };

  if (years <= 10)
    return {
      calendario: [
        {
          name: "Esquema al día",
          detail: "Verificá que estén completas las dosis previas",
        },
      ],
      recomendadas: [
        { name: "Gripe", detail: "Dosis anual (grupos de riesgo)" },
        { name: "COVID-19", detail: "Según esquema vigente" },
      ],
    };

  if (years <= 17)
    return {
      calendario: [
        {
          name: "VPH",
          detail: "2 dosis desde los 11 años · virus del papiloma humano",
        },
        {
          name: "Triple bacteriana acelular (dTpa)",
          detail: "Refuerzo a los 11 años",
        },
        { name: "Meningococo ACYW", detail: "Dosis a los 11 años" },
        { name: "Triple viral (SRP)", detail: "Completar las 2 dosis" },
        { name: "Hepatitis B", detail: "Completar esquema si falta" },
      ],
      recomendadas: [
        { name: "Gripe", detail: "Dosis anual (grupos de riesgo)" },
        { name: "COVID-19", detail: "Según esquema vigente" },
        {
          name: "Meningococo B",
          detail: "Vacunación particular · consultar esquema",
        },
      ],
    };

  if (years < 65)
    return {
      calendario: [
        {
          name: "Doble bacteriana (dT)",
          detail: "Refuerzo cada 10 años · difteria y tétanos",
        },
        {
          name: "Triple viral (SRP)",
          detail: "2 dosis (nacidos después de 1965)",
        },
        { name: "Hepatitis B", detail: "Esquema completo de 3 dosis" },
      ],
      recomendadas: [
        {
          name: "Gripe",
          detail: "Dosis anual (embarazo y grupos de riesgo)",
        },
        { name: "COVID-19", detail: "Refuerzos según esquema vigente" },
        {
          name: "Fiebre amarilla",
          detail: "Si viajás a zonas de riesgo",
        },
        {
          name: "Hepatitis A",
          detail: "Según riesgo o indicación médica",
        },
        {
          name: "Meningococo ACYW",
          detail: "En brotes, viajes o factores de riesgo",
        },
      ],
    };

  return {
    calendario: [
      { name: "Neumococo", detail: "Esquema secuencial (VCN13 + VPN23)" },
      { name: "Gripe", detail: "Dosis anual" },
      {
        name: "Doble bacteriana (dT)",
        detail: "Refuerzo cada 10 años",
      },
    ],
    recomendadas: [
      {
        name: "Herpes zóster",
        detail: "Recomendada a partir de los 50 años",
      },
      { name: "COVID-19", detail: "Refuerzos según esquema vigente" },
    ],
  };
}
