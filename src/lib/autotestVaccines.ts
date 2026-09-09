/** Vacunas por edad — fiel al Calendario de vacunación nacional 2026 (PDF GSK/BDM). */

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

/**
 * Vacunas del Calendario Nacional 2026 según la edad. Solo figuran las vacunas
 * del PDF, con sus nombres. Las etapas del PDF que dependen de una condición y
 * no de la edad (embarazadas, puerperio, personal de salud) no se representan
 * en este autotest por edad.
 */
export function recommendVaccines(months: number): VaccineReco {
  const years = Math.floor(months / 12);

  // Recién nacidos
  if (months < 2) {
    return {
      calendario: [
        { name: "BCG", detail: "Antes de egresar de la maternidad" },
        { name: "Hepatitis B", detail: "En las primeras 12 horas de vida" },
      ],
      recomendadas: [],
    };
  }

  // 2 meses
  if (months < 3) {
    return {
      calendario: [
        { name: "Quíntuple", detail: "1ª dosis (2 meses)" },
        { name: "IPV", detail: "1ª dosis (2 meses)" },
        { name: "Rotavirus", detail: "1ª dosis (2 meses)" },
        { name: "Neumococo Conjugada", detail: "1ª dosis (2 meses)" },
      ],
      recomendadas: [],
    };
  }

  // 3 meses
  if (months < 4) {
    return {
      calendario: [{ name: "Meningococo ACWY", detail: "1ª dosis (3 meses)" }],
      recomendadas: [],
    };
  }

  // 4 meses
  if (months < 5) {
    return {
      calendario: [
        { name: "Quíntuple", detail: "2ª dosis (4 meses)" },
        { name: "IPV", detail: "2ª dosis (4 meses)" },
        { name: "Rotavirus", detail: "2ª dosis (4 meses)" },
        { name: "Neumococo Conjugada", detail: "2ª dosis (4 meses)" },
      ],
      recomendadas: [],
    };
  }

  // 5 meses
  if (months < 6) {
    return {
      calendario: [{ name: "Meningococo ACWY", detail: "2ª dosis (5 meses)" }],
      recomendadas: [],
    };
  }

  // 6 a 11 meses
  if (months < 12) {
    return {
      calendario: [
        { name: "Quíntuple", detail: "3ª dosis (6 meses)" },
        { name: "IPV", detail: "3ª dosis (6 meses)" },
        { name: "Antigripal", detail: "A partir de los 6 meses" },
      ],
      recomendadas: [],
    };
  }

  // 12 a 14 meses
  if (months < 15) {
    return {
      calendario: [
        { name: "Neumococo Conjugada", detail: "12 meses" },
        { name: "Hepatitis A", detail: "12 meses" },
        { name: "Triple Viral SRP", detail: "12 meses" },
      ],
      recomendadas: [],
    };
  }

  // 15 a 17 meses
  if (months < 18) {
    return {
      calendario: [
        { name: "Varicela", detail: "15 meses" },
        { name: "Meningococo ACWY", detail: "15 meses" },
        { name: "Triple Viral SRP", detail: "15-18 meses" },
        { name: "Quíntuple", detail: "15-18 meses" },
      ],
      recomendadas: [],
    };
  }

  // 18 a 23 meses
  if (months < 24) {
    return {
      calendario: [
        {
          name: "Fiebre amarilla",
          detail: "18 meses · residentes en zona de riesgo",
        },
        { name: "Antigripal", detail: "Hasta los 24 meses" },
      ],
      recomendadas: [],
    };
  }

  // 2 a 4 años — el PDF no tiene vacunas nuevas en este tramo
  if (years < 5) {
    return { calendario: [], recomendadas: [] };
  }

  // 5 años · ingreso escolar (nacidos en 2021)
  if (years < 6) {
    return {
      calendario: [
        { name: "Bacteriana Celular", detail: "Ingreso escolar" },
        { name: "Triple Viral", detail: "Ingreso escolar" },
        { name: "IPV", detail: "Ingreso escolar" },
        { name: "Varicela", detail: "Ingreso escolar" },
      ],
      recomendadas: [],
    };
  }

  // 6 a 10 años — el PDF no tiene vacunas nuevas en este tramo
  if (years < 11) {
    return { calendario: [], recomendadas: [] };
  }

  // 11 años (nacidos en 2015)
  if (years < 12) {
    return {
      calendario: [
        { name: "Meningococo ACWY", detail: "11 años" },
        { name: "Triple Bacteriana Acelular", detail: "Refuerzo" },
        { name: "VPH", detail: "Única dosis" },
        {
          name: "Hepatitis B",
          detail: "Iniciar o completar esquema de 3 dosis",
        },
        { name: "Triple Viral", detail: "Iniciar o completar esquema" },
        {
          name: "Fiebre amarilla",
          detail:
            "Residentes en zona de riesgo si la 1ª dosis la recibió antes de los 2 años",
        },
      ],
      recomendadas: [],
    };
  }

  // 12 a 17 años (jóvenes)
  if (years < 18) {
    return {
      calendario: [
        {
          name: "Hepatitis B",
          detail: "Iniciar o completar esquema de 3 dosis",
        },
        { name: "Triple Viral", detail: "Iniciar o completar esquema" },
        {
          name: "Fiebre Hemorrágica Argentina",
          detail:
            "Residentes y/o trabajadores con riesgo ocupacional en zona de riesgo",
        },
        { name: "Antigripal", detail: "Menores con factores de riesgo" },
      ],
      recomendadas: [],
    };
  }

  // 18 a 64 años (jóvenes y adultos)
  if (years < 65) {
    return {
      calendario: [
        { name: "Doble Bacteriana", detail: "Refuerzo cada 10 años" },
        {
          name: "Hepatitis B",
          detail: "Iniciar o completar esquema de 3 dosis",
        },
        { name: "Triple Viral", detail: "Iniciar o completar esquema" },
        {
          name: "Fiebre Hemorrágica Argentina",
          detail:
            "Residentes y/o trabajadores con riesgo ocupacional en zona de riesgo",
        },
        {
          name: "Antigripal",
          detail: "Mayores de 65 o menores con factores de riesgo",
        },
      ],
      recomendadas: [],
    };
  }

  // 65 años y más (adultos mayores)
  return {
    calendario: [
      { name: "Doble Bacteriana", detail: "Refuerzo cada 10 años" },
      { name: "Neumococo Conjugada", detail: "Esquema secuencial" },
      { name: "Antigripal", detail: "Dosis anual" },
    ],
    recomendadas: [],
  };
}

/** Hitos del esquema infantil: anterior / actual / siguiente visita. */
export type VaccineBucket = {
  id: "anteriores" | "actuales" | "siguientes";
  title: string;
  rangeLabel: string;
  /** Si false, solo informativo (próximas); no se marcan como aplicadas */
  checkable: boolean;
  calendario: Vaccine[];
  recomendadas: Vaccine[];
};

export type VaccinePlan = {
  isChild: boolean;
  buckets: VaccineBucket[];
};

type ChildMilestone = {
  id: string;
  label: string;
  /** Mes representativo para `recommendVaccines` */
  sampleMonth: number;
  matches: (months: number) => boolean;
};

/** Misma granularidad que `recommendVaccines` (niños hasta 17 años). */
const CHILD_MILESTONES: ChildMilestone[] = [
  { id: "rn", label: "Recién nacido", sampleMonth: 0, matches: (m) => m < 2 },
  { id: "2m", label: "2 meses", sampleMonth: 2, matches: (m) => m >= 2 && m < 3 },
  { id: "3m", label: "3 meses", sampleMonth: 3, matches: (m) => m >= 3 && m < 4 },
  { id: "4m", label: "4 meses", sampleMonth: 4, matches: (m) => m >= 4 && m < 5 },
  { id: "5m", label: "5 meses", sampleMonth: 5, matches: (m) => m >= 5 && m < 6 },
  { id: "6m", label: "6 a 11 meses", sampleMonth: 6, matches: (m) => m >= 6 && m < 12 },
  { id: "12m", label: "12 meses", sampleMonth: 12, matches: (m) => m >= 12 && m < 15 },
  { id: "15m", label: "15 meses", sampleMonth: 15, matches: (m) => m >= 15 && m < 18 },
  { id: "18m", label: "18 meses", sampleMonth: 18, matches: (m) => m >= 18 && m < 24 },
  { id: "2-4y", label: "2 a 4 años", sampleMonth: 36, matches: (m) => m >= 24 && m < 60 },
  { id: "5y", label: "5 años", sampleMonth: 60, matches: (m) => m >= 60 && m < 72 },
  { id: "6-10y", label: "6 a 10 años", sampleMonth: 84, matches: (m) => m >= 72 && m < 132 },
  { id: "11y", label: "11 años", sampleMonth: 132, matches: (m) => m >= 132 && m < 144 },
  { id: "12-14y", label: "12 a 14 años", sampleMonth: 150, matches: (m) => m >= 144 && m < 180 },
  { id: "15-17y", label: "15 a 17 años", sampleMonth: 180, matches: (m) => m >= 180 && m < 216 },
];

function vaccineKey(v: Vaccine): string {
  return `${v.name}::${v.detail}`;
}

function childMilestoneIndex(months: number): number | null {
  const idx = CHILD_MILESTONES.findIndex((r) => r.matches(months));
  return idx >= 0 ? idx : null;
}

/**
 * Niños: visita anterior + actual + siguiente (última visita infantil: solo anterior + actual).
 * Adultos: solo el bucket actual.
 */
export function getVaccinePlan(months: number): VaccinePlan {
  const idx = childMilestoneIndex(months);

  if (idx === null) {
    const reco = recommendVaccines(months);
    return {
      isChild: false,
      buckets: [
        {
          id: "actuales",
          title: "Vacunas actuales",
          rangeLabel: "Según tu edad",
          checkable: true,
          ...reco,
        },
      ],
    };
  }

  const current = CHILD_MILESTONES[idx]!;
  const prev = idx > 0 ? CHILD_MILESTONES[idx - 1] : null;
  const next =
    idx < CHILD_MILESTONES.length - 1 ? CHILD_MILESTONES[idx + 1] : null;

  const buckets: VaccineBucket[] = [];

  if (prev) {
    const reco = recommendVaccines(prev.sampleMonth);
    buckets.push({
      id: "anteriores",
      title: "Vacunas anteriores",
      rangeLabel: prev.label,
      checkable: true,
      ...reco,
    });
  }

  buckets.push({
    id: "actuales",
    title: "Vacunas actuales",
    rangeLabel: current.label,
    checkable: true,
    ...recommendVaccines(months),
  });

  if (next) {
    const reco = recommendVaccines(next.sampleMonth);
    buckets.push({
      id: "siguientes",
      title: "Vacunas siguientes",
      rangeLabel: next.label,
      checkable: false,
      ...reco,
    });
  }

  return { isChild: true, buckets };
}

export function vaccineItemKey(bucketId: string, v: Vaccine): string {
  return `${bucketId}::${vaccineKey(v)}`;
}
