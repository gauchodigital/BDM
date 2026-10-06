/**
 * Tracking anónimo a Firestore (método Virus VSR) + espejo GA4/GTM (`bdm_*`).
 * Sin PII: no guarda fecha de nacimiento ni datos personales.
 */
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { pushDataLayer } from "@/lib/analytics";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { META_ADS_EVENTS, trackMetaAds } from "@/lib/metaAds";

export type AutotestStatus =
  | "start"
  | "age"
  | "checklist"
  | "complete"
  | "abandon"
  | "share"
  | "calendar";

export type MapEventType = "results" | "marker" | "como_llegar";

export type PopupId = "campaign" | "pediatra";
export type PopupEventType = "view" | "answer" | "close" | "cta";

type AutotestPayload = {
  status: AutotestStatus;
  session?: string;
  age_months?: number;
  age_label?: string;
  pending_count?: number;
  last_screen?: string;
};

type MapPayload = {
  type: MapEventType;
  provincia?: string;
  localidad?: string;
  barrio?: string;
  tipo?: string;
  count?: number;
};

type PopupPayload = {
  popup: PopupId;
  type: PopupEventType;
  /** Respuesta: A/B/C (campaña) o yes/no (pediatra) */
  answer?: string;
  /** 1 = correcta, 0 = incorrecta (solo campaña) */
  correct?: 0 | 1;
};

const SESSION_KEY = "bdm_autotest_session";

const AUTOTEST_GA4: Record<AutotestStatus, string> = {
  start: "bdm_autotest_start",
  age: "bdm_autotest_age",
  checklist: "bdm_autotest_checklist",
  complete: "bdm_autotest_complete",
  abandon: "bdm_autotest_abandon",
  share: "bdm_autotest_share",
  calendar: "bdm_autotest_calendar",
};

const MAP_GA4: Record<MapEventType, string> = {
  results: "bdm_map_results",
  marker: "bdm_map_marker",
  como_llegar: "bdm_map_como_llegar",
};

function newSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `bdm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getAutotestSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = newSessionId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return newSessionId();
  }
}

export function resetAutotestSessionId(): string {
  if (typeof window === "undefined") return "";
  const id = newSessionId();
  try {
    sessionStorage.setItem(SESSION_KEY, id);
  } catch {
    /* ignore */
  }
  return id;
}

async function write(
  col: "autotest" | "map" | "popup",
  data: Record<string, string | number | undefined>,
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getFirebaseDb();
  if (!db) return;

  const clean: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === "") continue;
    clean[k] = v;
  }

  try {
    await addDoc(collection(db, col), {
      ...clean,
      ts: serverTimestamp(),
    });
  } catch {
    /* silencioso: no romper UX si falla la medición */
  }
}

export function trackAutotest(payload: AutotestPayload): void {
  if (typeof window === "undefined") return;
  const session = payload.session ?? getAutotestSessionId();
  void write("autotest", {
    status: payload.status,
    session,
    age_months: payload.age_months,
    age_label: payload.age_label,
    pending_count: payload.pending_count,
    last_screen: payload.last_screen,
  });
  pushDataLayer({
    event: AUTOTEST_GA4[payload.status],
    autotest_session_id: session,
    age_months: payload.age_months,
    age_label: payload.age_label,
    pending_count: payload.pending_count,
    last_screen: payload.last_screen,
  });
}

export function trackMap(payload: MapPayload): void {
  if (typeof window === "undefined") return;
  void write("map", {
    type: payload.type,
    provincia: payload.provincia,
    localidad: payload.localidad,
    barrio: payload.barrio,
    tipo: payload.tipo,
    count: payload.count,
  });
  pushDataLayer({
    event: MAP_GA4[payload.type],
    provincia: payload.provincia,
    localidad: payload.localidad,
    barrio: payload.barrio,
    tipo: payload.tipo,
    count: payload.count,
  });

  // Meta Ads — form vacunas finalizado (búsqueda con resultados)
  if (payload.type === "results") {
    trackMetaAds(
      META_ADS_EVENTS.formVacunas,
      {
        provincia: payload.provincia,
        localidad: payload.localidad,
        barrio: payload.barrio,
        tipo: payload.tipo,
        count: payload.count,
      },
      "Lead",
    );
  }
}

export function trackPopup(payload: PopupPayload): void {
  if (typeof window === "undefined") return;
  void write("popup", {
    popup: payload.popup,
    type: payload.type,
    answer: payload.answer,
    correct: payload.correct,
  });
  pushDataLayer({
    event: `bdm_popup_${payload.popup}_${payload.type}`,
    answer: payload.answer,
    correct: payload.correct,
  });

  // Meta Ads — top eventos por popup (cuando el usuario responde)
  if (payload.type === "answer") {
    if (payload.popup === "campaign") {
      trackMetaAds(
        META_ADS_EVENTS.popupCampaign,
        { answer: payload.answer, correct: payload.correct },
        "Lead",
      );
    } else if (payload.popup === "pediatra") {
      trackMetaAds(
        META_ADS_EVENTS.popupPediatra,
        { answer: payload.answer },
        payload.answer === "yes" ? "Schedule" : "Lead",
      );
    }
  }
}

/** API global para scripts del mapa (vacunatorios.js). */
export type BdmTrackGlobal = {
  autotest: typeof trackAutotest;
  map: typeof trackMap;
  popup: typeof trackPopup;
  getSession: typeof getAutotestSessionId;
};

declare global {
  interface Window {
    bdmTrack?: BdmTrackGlobal;
  }
}

export function exposeBdmTrack(): void {
  if (typeof window === "undefined") return;
  window.bdmTrack = {
    autotest: trackAutotest,
    map: trackMap,
    popup: trackPopup,
    getSession: getAutotestSessionId,
  };
}
