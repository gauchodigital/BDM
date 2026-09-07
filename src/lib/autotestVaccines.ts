/** Vacunas orientativas por edad — alineado al Calendario Nacional / Figma GSK 2026. */

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

const MEN_B: Vaccine = {
  name: "Meningococo B",
  detail: "Vacunación particular · consultar esquema con tu pediatra",
};

const COVID: Vaccine = {
  name: "COVID-19",
  detail: "Según esquema vigente",
};

const SEXTUPLE_1: Vaccine = {
  name: "Séxtuple",
  detail: "1ª dosis · difteria, tétanos, tos convulsa, Hib, hepatitis B y polio",
};

const SEXTUPLE_2: Vaccine = {
  name: "Séxtuple",
  detail: "2ª dosis",
};

const SEXTUPLE_3: Vaccine = {
  name: "Séxtuple",
  detail: "3ª dosis (6 meses)",
};

const ROTAVIRUS_1: Vaccine = {
  name: "Rotavirus",
  detail: "1ª dosis (vía oral)",
};

const ROTAVIRUS_2: Vaccine = {
  name: "Rotavirus",
  detail: "2ª dosis",
};

const NEUMO_1: Vaccine = {
  name: "Neumococo conjugada",
  detail: "1ª dosis",
};

const NEUMO_2: Vaccine = {
  name: "Neumococo conjugada",
  detail: "2ª dosis",
};

const NEUMO_REF: Vaccine = {
  name: "Neumococo conjugada",
  detail: "Refuerzo (12 meses)",
};

const MEN_ACWY_1: Vaccine = {
  name: "Meningococo conjugada tetravalente (ACWY)",
  detail: "1ª dosis (3 meses)",
};

const MEN_ACWY_2: Vaccine = {
  name: "Meningococo conjugada tetravalente (ACWY)",
  detail: "2ª dosis (5 meses)",
};

const MEN_ACWY_REF: Vaccine = {
  name: "Meningococo conjugada tetravalente (ACWY)",
  detail: "Refuerzo (15 meses)",
};

export function recommendVaccines(months: number): VaccineReco {
  const years = Math.floor(months / 12);

  // Recién nacido
  if (months < 2) {
    return {
      calendario: [
        {
          name: "Hepatitis B",
          detail: "Dentro de las primeras 12 horas de vida",
        },
        { name: "BCG", detail: "Tuberculosis · dosis única al nacer" },
      ],
      recomendadas: [],
    };
  }

  // 2 meses
  if (months < 3) {
    return {
      calendario: [ROTAVIRUS_1, NEUMO_1, SEXTUPLE_1],
      recomendadas: [],
    };
  }

  // 3 meses
  if (months < 4) {
    return {
      calendario: [MEN_ACWY_1],
      recomendadas: [MEN_B],
    };
  }

  // 4 meses
  if (months < 5) {
    return {
      calendario: [ROTAVIRUS_2, NEUMO_2, SEXTUPLE_2],
      recomendadas: [],
    };
  }

  // 5 meses
  if (months < 6) {
    return {
      calendario: [MEN_ACWY_2],
      recomendadas: [MEN_B],
    };
  }

  // 6–11 meses
  if (months < 12) {
    return {
      calendario: [
        { name: "Antigripal", detail: "Anual · desde los 6 meses" },
        SEXTUPLE_3,
      ],
      recomendadas: [COVID],
    };
  }

  // 12–14 meses
  if (months < 15) {
    return {
      calendario: [
        NEUMO_REF,
        { name: "Hepatitis A", detail: "Dosis única (12 meses)" },
        {
          name: "Triple viral",
          detail: "1ª dosis · sarampión, rubéola y paperas",
        },
      ],
      recomendadas: [],
    };
  }

  // 15–17 meses
  if (months < 18) {
    return {
      calendario: [
        { name: "Varicela", detail: "1ª dosis (15 meses)" },
        MEN_ACWY_REF,
      ],
      recomendadas: [MEN_B],
    };
  }

  // 18–23 meses
  if (months < 24) {
    return {
      calendario: [
        {
          name: "Quíntuple",
          detail: "1er refuerzo (15–18 meses)",
        },
        {
          name: "Triple viral",
          detail: "2ª dosis (15–18 meses)",
        },
        {
          name: "Fiebre amarilla",
          detail: "18 meses · residentes en zona de riesgo",
        },
      ],
      recomendadas: [],
    };
  }

  // 2–4 años — completar esquema infantil
  if (years < 5) {
    return {
      calendario: [
        {
          name: "Antigripal",
          detail: "Dosis anual",
        },
        {
          name: "Esquema infantil",
          detail: "Verificá que estén completas las dosis de los primeros 2 años",
        },
      ],
      recomendadas: [],
    };
  }

  // 5 años (ingreso escolar)
  if (years < 6) {
    return {
      calendario: [
        { name: "Varicela", detail: "2ª dosis (ingreso escolar)" },
        {
          name: "Triple viral",
          detail: "Refuerzo (ingreso escolar)",
        },
        {
          name: "Polio inyectable (Salk)",
          detail: "Refuerzo (ingreso escolar)",
        },
        {
          name: "Triple bacteriana acelular",
          detail: "Refuerzo (ingreso escolar)",
        },
      ],
      recomendadas: [],
    };
  }

  // 6–10 años
  if (years < 11) {
    return {
      calendario: [
        {
          name: "Antigripal",
          detail: "Dosis anual (grupos de riesgo)",
        },
        {
          name: "Esquema al día",
          detail: "Verificá que estén completas las dosis previas",
        },
      ],
      recomendadas: [],
    };
  }

  // 11 años
  if (years < 12) {
    return {
      calendario: [
        {
          name: "Meningococo conjugada tetravalente (ACWY)",
          detail: "Dosis a los 11 años",
        },
        {
          name: "Triple bacteriana acelular",
          detail: "Refuerzo a los 11 años",
        },
        {
          name: "HPV",
          detail: "Virus del papiloma humano",
        },
        {
          name: "Fiebre amarilla",
          detail: "Residentes en zona de riesgo",
        },
      ],
      recomendadas: [],
    };
  }

  // 12–14 años
  if (years < 15) {
    return {
      calendario: [
        {
          name: "Triple viral",
          detail: "Completar las 2 dosis",
        },
        {
          name: "Hepatitis B",
          detail: "Completar esquema si falta",
        },
        {
          name: "Antigripal",
          detail: "Dosis anual (grupos de riesgo)",
        },
      ],
      recomendadas: [COVID],
    };
  }

  // 15–17 años
  if (years < 18) {
    return {
      calendario: [
        {
          name: "Fiebre hemorrágica argentina",
          detail: "Residentes y/o trabajadores en zona de riesgo",
        },
        {
          name: "Triple bacteriana acelular",
          detail: "Refuerzo",
        },
        {
          name: "HPV",
          detail: "Completar esquema si falta",
        },
      ],
      recomendadas: [COVID],
    };
  }

  // 18–64 años (adultos)
  if (years < 65) {
    return {
      calendario: [
        { name: "Hepatitis B", detail: "Esquema completo de 3 dosis" },
        {
          name: "Triple viral",
          detail: "2 dosis (nacidos después de 1965)",
        },
        {
          name: "Doble bacteriana",
          detail: "Refuerzo cada 10 años · difteria y tétanos",
        },
        {
          name: "Triple bacteriana acelular",
          detail: "Según indicación médica",
        },
        {
          name: "HPV",
          detail: "Según indicación y edad",
        },
      ],
      recomendadas: [
        {
          name: "Herpes zóster",
          detail: "Recomendada según edad e indicación médica",
        },
        COVID,
      ],
    };
  }

  // 65 años y más
  return {
    calendario: [
      { name: "Antigripal anual", detail: "Dosis anual" },
      { name: "Neumococo", detail: "Esquema secuencial" },
      {
        name: "Doble bacteriana",
        detail: "Refuerzo cada 10 años",
      },
    ],
    recomendadas: [
      {
        name: "Herpes zóster",
        detail: "Recomendada a partir de los 65 años",
      },
      COVID,
      {
        name: "VSR",
        detail: "Según indicación médica y esquema vigente",
      },
    ],
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
