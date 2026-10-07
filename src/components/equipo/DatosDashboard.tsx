"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { collection, getDocs, type Timestamp } from "firebase/firestore";
import * as echarts from "echarts/core";
import { BarChart, FunnelChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

echarts.use([
  BarChart,
  FunnelChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

type AuthView = "loading" | "login" | "denied" | "app" | "nofirebase";

type AutotestRow = {
  status?: string;
  session?: string;
  age_months?: number;
  age_label?: string;
  pending_count?: number;
  last_screen?: string;
  ts?: Timestamp;
};

type MapRow = {
  type?: string;
  provincia?: string;
  localidad?: string;
  barrio?: string;
  tipo?: string;
  q?: string;
  count?: number;
  /** 1 = primera búsqueda con resultados de la visita; 0 = refinamiento. Ausente en datos viejos. */
  first?: number;
  ts?: Timestamp;
};

type PopupRow = {
  popup?: string;
  type?: string;
  answer?: string;
  correct?: number;
  ts?: Timestamp;
};

type Range = {
  from: Date | null;
  to: Date | null;
  label: string;
};

const PURPLE = "#503C77";
const PURPLE_D = "#3d2d5c";
const ACCENT = "#DD876E";
const MUTED = "#6b6578";

const pctOf = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : null);

function tsMillis(d: { ts?: Timestamp }): number | null {
  const t = d.ts;
  if (!t || typeof t.toMillis !== "function") return null;
  return t.toMillis();
}

function inRange(d: { ts?: Timestamp }, r: Range): boolean {
  if (!r.from && !r.to) return true;
  const t = tsMillis(d);
  if (t === null) return false;
  if (r.from && t < r.from.getTime()) return false;
  if (r.to && t > r.to.getTime()) return false;
  return true;
}

function ageBucket(label?: string, months?: number): string {
  if (label) {
    if (/mes/i.test(label) && !/año/i.test(label)) return "0–23 meses";
    const y = parseInt(label, 10);
    if (!Number.isNaN(y)) {
      if (y < 2) return "0–23 meses";
      if (y < 6) return "2–5 años";
      if (y < 12) return "6–11 años";
      return "12+ años";
    }
  }
  if (typeof months === "number") {
    if (months < 24) return "0–23 meses";
    if (months < 72) return "2–5 años";
    if (months < 144) return "6–11 años";
    return "12+ años";
  }
  return "Sin edad";
}

export function DatosDashboard() {
  const [view, setView] = useState<AuthView>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [deniedEmail, setDeniedEmail] = useState("");
  const [period, setPeriod] = useState("90");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tab, setTab] = useState<"autotest" | "mapa" | "popups">("autotest");
  const [rangoInfo, setRangoInfo] = useState("");
  const [cacheInfo, setCacheInfo] = useState("");
  const [totalPill, setTotalPill] = useState("");
  const [empty, setEmpty] = useState(false);

  const [kpis, setKpis] = useState({
    started: "–",
    checklist: "–",
    complete: "–",
    abandonPct: "–",
    completePct: "–",
    share: "–",
    calendar: "–",
  });
  const [mapKpis, setMapKpis] = useState({
    results: "–",
    markers: "–",
    llegar: "–",
    conv: "–",
  });
  const [popupKpis, setPopupKpis] = useState({
    campView: "–",
    campAnswer: "–",
    campCorrectPct: "–",
    campCta: "–",
    pedView: "–",
    pedYes: "–",
    pedNo: "–",
    pedYesPct: "–",
  });
  const [abTable, setAbTable] = useState<
    { step: string; arrived: number; done: number; abandoned: number; pct: number | null }[]
  >([]);
  const [filteredAt, setFilteredAt] = useState<AutotestRow[]>([]);
  const [filteredMp, setFilteredMp] = useState<MapRow[]>([]);
  const [filteredPp, setFilteredPp] = useState<PopupRow[]>([]);
  const [dataTick, setDataTick] = useState(0);

  const cacheAt = useRef<AutotestRow[] | null>(null);
  const cacheMp = useRef<MapRow[] | null>(null);
  const cachePp = useRef<PopupRow[] | null>(null);
  const cacheStamp = useRef<Date | null>(null);
  const charts = useRef<Record<string, echarts.ECharts>>({});
  const userRef = useRef<User | null>(null);

  const chartEl = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return null;
    if (!charts.current[id]) {
      charts.current[id] = echarts.init(el);
    }
    return charts.current[id];
  }, []);

  const currentRange = useCallback((): Range | null => {
    if (period === "custom") {
      if (!fromDate || !toDate) return null;
      const from = new Date(`${fromDate}T00:00:00`);
      const to = new Date(`${toDate}T23:59:59`);
      return {
        from,
        to,
        label: `del ${from.toLocaleDateString("es-AR")} al ${to.toLocaleDateString("es-AR")}`,
      };
    }
    const days = parseInt(period, 10);
    if (days > 0) {
      const from = new Date(Date.now() - days * 86400000);
      return {
        from,
        to: null,
        label: `desde ${from.toLocaleDateString("es-AR")}`,
      };
    }
    return { from: null, to: null, label: "todo el histórico" };
  }, [period, fromDate, toDate]);

  const fetchAll = useCallback(async () => {
    const db = getFirebaseDb();
    if (!db) throw new Error("Firebase no configurado");
    const [atSnap, mapSnap, ppSnap] = await Promise.all([
      getDocs(collection(db, "autotest")),
      getDocs(collection(db, "map")),
      getDocs(collection(db, "popup")).catch(() => null),
    ]);
    cacheAt.current = [];
    cacheMp.current = [];
    cachePp.current = [];
    atSnap.forEach((d) => cacheAt.current!.push(d.data() as AutotestRow));
    mapSnap.forEach((d) => cacheMp.current!.push(d.data() as MapRow));
    ppSnap?.forEach((d) => cachePp.current!.push(d.data() as PopupRow));
    cacheStamp.current = new Date();
  }, []);

  const render = useCallback(
    (atRaw: AutotestRow[], mpRaw: MapRow[], ppRaw: PopupRow[]) => {
      const at = atRaw;
      const mp = mpRaw;
      const pp = ppRaw;

      const starts = at.filter((d) => d.status === "start");
      const ages = at.filter((d) => d.status === "age");
      const checklists = at.filter((d) => d.status === "checklist");
      const complete = at.filter((d) => d.status === "complete");
      const abandon = at.filter((d) => d.status === "abandon");
      const shares = at.filter((d) => d.status === "share").length;
      const calendars = at.filter((d) => d.status === "calendar").length;

      const aScreen = (s: string) =>
        abandon.filter((d) => d.last_screen === s).length;
      // Eventos `abandon` (pagehide): solo para inferir inicios si faltan `start`.
      const abStep1Events = aScreen("step1");

      // Funnel por eventos (conteo de status; sesión única sería ideal pero VSR también cuenta eventos)
      const nStart = Math.max(starts.length, ages.length + abStep1Events);
      const nAge = ages.length;
      const nCheck = checklists.length;
      const nComplete = complete.length || checklists.length;

      const started = nStart || nAge + abStep1Events;

      // Abandono = caída entre pasos. `pagehide` no se dispara al navegar dentro del
      // sitio ni al dejar la pestaña abierta, así que los eventos `abandon` subcuentan.
      const abStep1 = Math.max(started - nAge, 0);
      const abStep2 = Math.max(nAge - nComplete, 0);
      const abandonedMid = abStep1 + abStep2;

      setTotalPill(
        `${nComplete} resultados · ${mp.length} mapa · ${pp.length} popups`,
      );

      if (started === 0 && mp.length === 0 && pp.length === 0) {
        return;
      }

      setKpis({
        started: String(started),
        checklist: String(nAge),
        complete: String(nComplete),
        abandonPct: started
          ? `${Math.round((abandonedMid / started) * 100)}%`
          : "0%",
        completePct: started
          ? `${Math.round((nComplete / started) * 100)}%`
          : "0%",
        share: String(shares),
        calendar: String(calendars),
      });

      const fData = [
        { value: started, name: "Inició", pct: null as number | null },
        {
          value: nAge,
          name: "Cargó edad",
          pct: pctOf(nAge, started),
        },
        {
          value: nComplete,
          name: "Vio resultado",
          pct: pctOf(nComplete, nAge || started),
        },
      ];

      chartEl("funnel")?.setOption(
        {
          tooltip: {
            trigger: "item",
            formatter: (p: { name: string; value: number; data: { pct: number | null } }) =>
              `${p.name}: ${p.value}${p.data.pct != null ? ` · ${p.data.pct}% del paso anterior` : ""}`,
          },
          series: [
            {
              type: "funnel",
              left: "5%",
              right: "5%",
              top: 10,
              bottom: 10,
              minSize: "22%",
              label: {
                position: "inside",
                color: "#fff",
                fontSize: 11,
                formatter: (p: { name: string; value: number; data: { pct: number | null } }) =>
                  `${p.name}\n${p.value}${p.data.pct != null ? `  (${p.data.pct}%)` : ""}`,
              },
              color: [PURPLE_D, PURPLE, ACCENT],
              data: fData,
            },
          ],
        },
        true,
      );

      // Edad buckets (desde age events)
      const buckets: Record<string, number> = {
        "0–23 meses": 0,
        "2–5 años": 0,
        "6–11 años": 0,
        "12+ años": 0,
        "Sin edad": 0,
      };
      ages.forEach((d) => {
        const b = ageBucket(d.age_label, d.age_months);
        buckets[b] = (buckets[b] || 0) + 1;
      });
      chartEl("ageDist")?.setOption(
        {
          tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
          legend: { bottom: 0 },
          series: [
            {
              type: "pie",
              radius: ["45%", "70%"],
              center: ["50%", "45%"],
              label: { formatter: "{b}\n{d}%" },
              data: Object.entries(buckets)
                .filter(([, v]) => v > 0)
                .map(([name, value], i) => ({
                  name,
                  value,
                  itemStyle: {
                    color: [PURPLE, "#6D6AAE", ACCENT, "#8B7BB8", MUTED][i % 5],
                  },
                })),
            },
          ],
        },
        true,
      );

      // Acciones post-resultado
      chartEl("actions")?.setOption(
        {
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          grid: { left: 10, right: 20, top: 20, bottom: 30, containLabel: true },
          xAxis: { type: "category", data: ["Descargar / share", "Agendar"] },
          yAxis: { type: "value" },
          series: [
            {
              type: "bar",
              barWidth: "50%",
              label: { show: true, position: "top" },
              data: [
                { value: shares, itemStyle: { color: PURPLE } },
                { value: calendars, itemStyle: { color: ACCENT } },
              ],
            },
          ],
        },
        true,
      );

      chartEl("abScreen")?.setOption(
        {
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          grid: { left: 10, right: 20, top: 20, bottom: 25, containLabel: true },
          xAxis: {
            type: "category",
            data: ["Paso 1 · Fecha", "Paso 2 · Checklist"],
          },
          yAxis: { type: "value" },
          series: [
            {
              type: "bar",
              barWidth: "55%",
              data: [
                { value: abStep1, itemStyle: { color: ACCENT } },
                { value: abStep2, itemStyle: { color: "#d9534f" } },
              ],
              label: { show: true, position: "top" },
            },
          ],
        },
        true,
      );

      const retData = [
        { value: started, name: "Inició", pct: null as number | null },
        { value: nAge, name: "Cargó edad", pct: pctOf(nAge, started) },
        {
          value: nComplete,
          name: "Resultado",
          pct: pctOf(nComplete, nAge || started),
        },
      ];
      chartEl("abRet")?.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (params: { name: string; value: number; data: { pct: number | null } }[]) => {
              const p = params[0];
              if (!p) return "";
              return `${p.name}: ${p.value}${p.data.pct != null ? ` (${p.data.pct}%)` : ""}`;
            },
          },
          grid: { left: 110, right: 70, top: 10, bottom: 20 },
          xAxis: { type: "value" },
          yAxis: {
            type: "category",
            inverse: true,
            data: retData.map((d) => d.name),
          },
          series: [
            {
              type: "bar",
              barWidth: "55%",
              data: retData,
              itemStyle: { color: PURPLE },
              label: {
                show: true,
                position: "right",
                formatter: (p: { value: number; data: { pct: number | null } }) =>
                  `${p.value}${p.data.pct != null ? ` (${p.data.pct}%)` : ""}`,
              },
            },
          ],
        },
        true,
      );

      setAbTable([
        {
          step: "Paso 1 · Fecha",
          arrived: started,
          done: nAge,
          abandoned: abStep1,
          pct: pctOf(abStep1, started),
        },
        {
          step: "Paso 2 · Checklist",
          arrived: nAge,
          done: nCheck,
          abandoned: abStep2,
          pct: pctOf(abStep2, nAge || started),
        },
      ]);

      // Mapa
      // Búsqueda = una por visita (`first`). Datos previos sin `first` cuentan cada filtro.
      const isSearch = (d: MapRow) =>
        d.type === "results" && d.first !== 0 && d.count !== 0;
      const mc = { results: 0, marker: 0, como_llegar: 0 };
      mp.forEach((d) => {
        if (d.type === "results") {
          if (isSearch(d)) mc.results++;
        } else if (d.type && d.type in mc) {
          mc[d.type as keyof typeof mc]++;
        }
      });
      setMapKpis({
        results: String(mc.results),
        markers: String(mc.marker),
        llegar: String(mc.como_llegar),
        conv: mc.results
          ? `${Math.round((mc.como_llegar / mc.results) * 100)}%`
          : "0%",
      });

      const mData = [
        { value: mc.results, name: "Vieron resultados", pct: null as number | null },
        {
          value: mc.marker,
          name: "Click marcador",
          pct: pctOf(mc.marker, mc.results),
        },
        {
          value: mc.como_llegar,
          name: "Cómo llegar",
          pct: pctOf(mc.como_llegar, mc.marker || mc.results),
        },
      ];
      chartEl("mapFunnel")?.setOption(
        {
          tooltip: {
            trigger: "item",
            formatter: (p: { name: string; value: number; data: { pct: number | null } }) =>
              `${p.name}: ${p.value}${p.data.pct != null ? ` · ${p.data.pct}%` : ""}`,
          },
          series: [
            {
              type: "funnel",
              left: "5%",
              right: "5%",
              top: 10,
              bottom: 10,
              minSize: "18%",
              label: {
                position: "inside",
                color: "#fff",
                fontSize: 11,
                formatter: (p: { name: string; value: number; data: { pct: number | null } }) =>
                  `${p.name}\n${p.value}${p.data.pct != null ? `  (${p.data.pct}%)` : ""}`,
              },
              color: [PURPLE_D, PURPLE, ACCENT],
              data: mData,
            },
          ],
        },
        true,
      );

      const prov: Record<string, number> = {};
      const locs: Record<string, number> = {};
      mp.forEach((d) => {
        if (d.type !== "results") return;
        if (d.provincia && isSearch(d)) {
          prov[d.provincia] = (prov[d.provincia] || 0) + 1;
        }
        if (d.localidad && d.count !== 0) {
          const key = d.provincia
            ? `${d.localidad} (${d.provincia})`
            : d.localidad;
          locs[key] = (locs[key] || 0) + 1;
        }
      });
      const provArr = Object.keys(prov)
        .map((k) => ({ name: k, value: prov[k] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7)
        .reverse();
      chartEl("provincias")?.setOption(
        {
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          grid: {
            left: 10,
            right: 30,
            top: 10,
            bottom: 20,
            containLabel: true,
          },
          xAxis: { type: "value" },
          yAxis: { type: "category", data: provArr.map((p) => p.name) },
          series: [
            {
              type: "bar",
              data: provArr.map((p) => p.value),
              itemStyle: { color: PURPLE, borderRadius: [0, 6, 6, 0] },
              label: { show: true, position: "right" },
            },
          ],
        },
        true,
      );

      const locArr = Object.keys(locs)
        .map((k) => ({ name: k, value: locs[k] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
        .reverse();
      chartEl("localidades")?.setOption(
        {
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          grid: {
            left: 10,
            right: 30,
            top: 10,
            bottom: 20,
            containLabel: true,
          },
          xAxis: { type: "value" },
          yAxis: {
            type: "category",
            data: locArr.length ? locArr.map((p) => p.name) : ["(sin datos)"],
          },
          series: [
            {
              type: "bar",
              data: locArr.length ? locArr.map((p) => p.value) : [0],
              itemStyle: { color: ACCENT, borderRadius: [0, 6, 6, 0] },
              label: { show: true, position: "right" },
            },
          ],
        },
        true,
      );

      // ===== Popups =====
      const camp = pp.filter((d) => d.popup === "campaign");
      const ped = pp.filter((d) => d.popup === "pediatra");
      const campView = camp.filter((d) => d.type === "view").length;
      const campAns = camp.filter((d) => d.type === "answer");
      const campCorrect = campAns.filter((d) => d.correct === 1).length;
      const campCta = camp.filter((d) => d.type === "cta").length;
      const campClose = camp.filter((d) => d.type === "close").length;
      const pedView = ped.filter((d) => d.type === "view").length;
      const pedAns = ped.filter((d) => d.type === "answer");
      const pedYes = pedAns.filter((d) => d.answer === "yes").length;
      const pedNo = pedAns.filter((d) => d.answer === "no").length;
      const pedClose = ped.filter((d) => d.type === "close").length;

      setPopupKpis({
        campView: String(campView),
        campAnswer: String(campAns.length),
        campCorrectPct: campAns.length
          ? `${Math.round((campCorrect / campAns.length) * 100)}%`
          : "0%",
        campCta: String(campCta),
        pedView: String(pedView),
        pedYes: String(pedYes),
        pedNo: String(pedNo),
        pedYesPct: pedAns.length
          ? `${Math.round((pedYes / pedAns.length) * 100)}%`
          : "0%",
      });

      const campFunnel = [
        { value: campView, name: "Vieron popup", pct: null as number | null },
        {
          value: campAns.length,
          name: "Respondieron",
          pct: pctOf(campAns.length, campView),
        },
        {
          value: campCta,
          name: "Click CTA",
          pct: pctOf(campCta, campAns.length || campView),
        },
      ];
      chartEl("campFunnel")?.setOption(
        {
          tooltip: {
            trigger: "item",
            formatter: (p: { name: string; value: number; data: { pct: number | null } }) =>
              `${p.name}: ${p.value}${p.data.pct != null ? ` · ${p.data.pct}%` : ""}`,
          },
          series: [
            {
              type: "funnel",
              left: "5%",
              right: "5%",
              top: 10,
              bottom: 10,
              minSize: "18%",
              label: {
                position: "inside",
                color: "#fff",
                fontSize: 11,
                formatter: (p: { name: string; value: number; data: { pct: number | null } }) =>
                  `${p.name}\n${p.value}${p.data.pct != null ? `  (${p.data.pct}%)` : ""}`,
              },
              color: [PURPLE_D, PURPLE, ACCENT],
              data: campFunnel,
            },
          ],
        },
        true,
      );

      chartEl("campAnswers")?.setOption(
        {
          tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
          legend: { bottom: 0 },
          series: [
            {
              type: "pie",
              radius: ["45%", "70%"],
              center: ["50%", "45%"],
              label: { formatter: "{b}\n{d}%" },
              data: [
                {
                  value: campCorrect,
                  name: "Correcta",
                  itemStyle: { color: "#62b06e" },
                },
                {
                  value: campAns.length - campCorrect,
                  name: "Incorrecta",
                  itemStyle: { color: "#d9534f" },
                },
                {
                  value: campClose,
                  name: "Cerraron",
                  itemStyle: { color: MUTED },
                },
              ].filter((d) => d.value > 0),
            },
          ],
        },
        true,
      );

      chartEl("pedAnswers")?.setOption(
        {
          tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
          legend: { bottom: 0 },
          series: [
            {
              type: "pie",
              radius: ["45%", "70%"],
              center: ["50%", "45%"],
              label: { formatter: "{b}\n{d}%" },
              data: [
                { value: pedYes, name: "Sí", itemStyle: { color: "#62b06e" } },
                { value: pedNo, name: "No", itemStyle: { color: "#d9534f" } },
                {
                  value: pedClose,
                  name: "Cerraron sin responder",
                  itemStyle: { color: MUTED },
                },
              ].filter((d) => d.value > 0),
            },
          ],
        },
        true,
      );

      const pedFunnel = [
        { value: pedView, name: "Vieron popup", pct: null as number | null },
        {
          value: pedAns.length,
          name: "Respondieron",
          pct: pctOf(pedAns.length, pedView),
        },
        {
          value: pedYes,
          name: "Dijeron Sí",
          pct: pctOf(pedYes, pedAns.length || pedView),
        },
      ];
      chartEl("pedFunnel")?.setOption(
        {
          tooltip: {
            trigger: "item",
            formatter: (p: { name: string; value: number; data: { pct: number | null } }) =>
              `${p.name}: ${p.value}${p.data.pct != null ? ` · ${p.data.pct}%` : ""}`,
          },
          series: [
            {
              type: "funnel",
              left: "5%",
              right: "5%",
              top: 10,
              bottom: 10,
              minSize: "18%",
              label: {
                position: "inside",
                color: "#fff",
                fontSize: 11,
                formatter: (p: { name: string; value: number; data: { pct: number | null } }) =>
                  `${p.name}\n${p.value}${p.data.pct != null ? `  (${p.data.pct}%)` : ""}`,
              },
              color: [PURPLE_D, PURPLE, "#62b06e"],
              data: pedFunnel,
            },
          ],
        },
        true,
      );

      setTimeout(() => {
        Object.values(charts.current).forEach((c) => c.resize());
      }, 50);
    },
    [chartEl],
  );

  const loadData = useCallback(
    async (firstLoad: boolean, forceFetch?: boolean) => {
      const u = userRef.current;
      if (!u) return;
      const r = currentRange();
      if (r === null) return;
      if (firstLoad) setView("loading");
      try {
        if (!cacheAt.current || forceFetch) await fetchAll();
        const at = (cacheAt.current || []).filter((d) => inRange(d, r));
        const mp = (cacheMp.current || []).filter((d) => inRange(d, r));
        const pp = (cachePp.current || []).filter((d) => inRange(d, r));
        setRangoInfo(r.label);
        if (cacheStamp.current) {
          setCacheInfo(
            `· datos al ${cacheStamp.current.toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
          );
        }
        setFilteredAt(at);
        setFilteredMp(mp);
        setFilteredPp(pp);
        const startedHint = at.some(
          (d) =>
            d.status === "start" ||
            d.status === "age" ||
            d.status === "checklist" ||
            d.status === "complete" ||
            d.status === "abandon",
        );
        setEmpty(!startedHint && mp.length === 0 && pp.length === 0);
        setDataTick((n) => n + 1);
        if (firstLoad) setView("app");
      } catch (e: unknown) {
        const code =
          e && typeof e === "object" && "code" in e
            ? String((e as { code: string }).code)
            : "";
        if (code === "permission-denied") {
          setDeniedEmail(u.email || "");
          setView("denied");
        } else if (firstLoad) {
          setView("login");
          const msg =
            e instanceof Error ? e.message : "Error leyendo datos";
          alert(`Error leyendo datos: ${msg}`);
        }
      }
    },
    [currentRange, fetchAll],
  );

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setView("nofirebase");
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      setView("nofirebase");
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      userRef.current = u;
      setUser(u);
      if (u) {
        void loadData(true);
      } else {
        setView("login");
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar
  }, []);

  useEffect(() => {
    if (view === "app" && user) void loadData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, fromDate, toDate]);

  useEffect(() => {
    if (view !== "app") return;
    // Esperar al commit del DOM (divs de charts) antes de echarts.init
    const t = requestAnimationFrame(() => {
      render(filteredAt, filteredMp, filteredPp);
    });
    return () => cancelAnimationFrame(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, dataTick, empty]);

  useEffect(() => {
    if (view !== "app") return;
    const t = setTimeout(() => {
      Object.values(charts.current).forEach((c) => c.resize());
    }, 30);
    return () => clearTimeout(t);
  }, [tab, view]);

  useEffect(() => {
    const onResize = () =>
      Object.values(charts.current).forEach((c) => c.resize());
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      Object.values(charts.current).forEach((c) => c.dispose());
      charts.current = {};
    };
  }, []);

  const login = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      alert(
        `Error de login: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  };

  const logout = () => {
    const auth = getFirebaseAuth();
    if (auth) void signOut(auth);
  };

  if (view === "loading") {
    return (
      <Center>
        <p className="text-sm text-[var(--muted,#6b6578)]">Cargando…</p>
      </Center>
    );
  }

  if (view === "nofirebase") {
    return (
      <Center>
        <LockBox>
          <h1 className="m-0 mb-1.5 text-[22px] text-[#3d2d5c]">
            Firebase no configurado
          </h1>
          <p className="mb-0 text-sm text-[#6b6578]">
            Completá / verificá la config de Firebase en{" "}
            <code className="text-xs">src/lib/firebase.ts</code>. Ver{" "}
            <code className="text-xs">docs/FIREBASE-SETUP.md</code>.
          </p>
        </LockBox>
      </Center>
    );
  }

  if (view === "login") {
    return (
      <Center>
        <LockBox>
          <h1 className="m-0 mb-1.5 text-[22px] text-[#3d2d5c]">
            Dashboard BDM
          </h1>
          <p className="mb-5 text-sm text-[#6b6578]">
            Datos en vivo del autotest y el mapa. Acceso restringido.
          </p>
          <button
            type="button"
            onClick={() => void login()}
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-[#dadce0] bg-white px-5 py-3 text-[15px] font-semibold text-[#3c4043] shadow-sm hover:bg-[#f8f9fa]"
          >
            <GoogleIcon />
            Iniciar sesión con Google
          </button>
          <p className="mt-4 text-[13px] text-[#6b6578]">
            Solo cuentas autorizadas.
          </p>
        </LockBox>
      </Center>
    );
  }

  if (view === "denied") {
    return (
      <Center>
        <LockBox>
          <h1 className="m-0 mb-1.5 text-[22px] text-[#3d2d5c]">Sin acceso</h1>
          <p className="mb-4 text-sm text-[#6b6578]">
            La cuenta <b>{deniedEmail}</b> no está habilitada para ver este
            dashboard.
          </p>
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer border-0 bg-transparent text-[13px] text-[#503C77] underline"
          >
            Salir y probar con otra cuenta
          </button>
        </LockBox>
      </Center>
    );
  }

  return (
    <div className="min-h-full">
      <header className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-br from-[#3d2d5c] to-[#503C77] px-7 py-[18px] text-white">
        <h1 className="m-0 text-xl font-bold">
          <a
            href="/equipo"
            className="text-white no-underline opacity-90 hover:opacity-100"
          >
            Portal
          </a>
          {" · "}
          Dashboard BDM ·{" "}
          <span className="font-normal">datos en vivo</span>
          {totalPill ? (
            <span className="ml-2 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-xs">
              {totalPill}
            </span>
          ) : null}
        </h1>
        <div className="text-xs opacity-85">
          <span>{user?.email}</span>
          {" · "}
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer border-0 bg-transparent text-white underline"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-6 py-[22px]">
        <div className="mb-3.5 flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-[#3d2d5c]">
            Período:{" "}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="ml-1 cursor-pointer rounded-lg border border-[#d4cfe0] bg-white px-2.5 py-1.5 text-sm"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="0">Todo el histórico</option>
              <option value="custom">Personalizado…</option>
            </select>
          </label>
          {period === "custom" ? (
            <span className="flex items-center gap-1 text-sm">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-lg border border-[#d4cfe0] px-2 py-1.5"
              />
              a
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-lg border border-[#d4cfe0] px-2 py-1.5"
              />
            </span>
          ) : null}
          <span className="text-xs text-[#6b6578]">{rangoInfo}</span>
          <button
            type="button"
            onClick={() => void loadData(false, true)}
            className="cursor-pointer border-0 bg-transparent text-[13px] text-[#503C77] underline"
            title="Traer los datos más recientes de Firebase"
          >
            Actualizar
          </button>
          <span className="text-xs text-[#6b6578] opacity-70">{cacheInfo}</span>
        </div>

        <div className="mb-[18px] flex flex-wrap gap-2">
          <TabBtn active={tab === "autotest"} onClick={() => setTab("autotest")}>
            Autotest
          </TabBtn>
          <TabBtn active={tab === "mapa"} onClick={() => setTab("mapa")}>
            Mapa
          </TabBtn>
          <TabBtn active={tab === "popups"} onClick={() => setTab("popups")}>
            Popups
          </TabBtn>
        </div>

        {empty ? (
          <div className="rounded-[14px] bg-white px-10 py-10 text-center text-[#6b6578]">
            <h3 className="m-0 mb-2 text-[#3d2d5c]">Todavía no hay datos</h3>
            <p className="m-0 text-sm">
              Completá un autotest, usá el mapa o interactuá con un popup y
              actualizá esta página.
            </p>
          </div>
        ) : (
          <>
            <section className={tab === "autotest" ? "" : "hidden"}>
              <div className="mb-[18px] grid grid-cols-2 gap-3.5 md:grid-cols-4">
                <Kpi value={kpis.started} label="Iniciaron" />
                <Kpi value={kpis.checklist} label="Llegaron a checklist" />
                <Kpi value={kpis.complete} label="Vieron resultado" />
                <Kpi value={kpis.abandonPct} label="Tasa de abandono" />
              </div>
              <div className="mb-[18px] grid grid-cols-2 gap-3.5 md:grid-cols-3">
                <Kpi value={kpis.completePct} label="% completaron" />
                <Kpi value={kpis.share} label="Descargas / share" />
                <Kpi value={kpis.calendar} label="Agendaron recordatorio" />
              </div>

              <div className="mb-4 grid gap-4 md:grid-cols-2">
                <Card title="Funnel por pasos" sub="El % es respecto al paso anterior">
                  <div id="funnel" className="h-[340px] w-full" />
                </Card>
                <Card title="Distribución por edad" sub="Al cargar la fecha de nacimiento">
                  <div id="ageDist" className="h-[340px] w-full" />
                </Card>
              </div>

              <p className="mb-2.5 mt-6 border-t border-[#e8e4f0] pt-4 text-[13px] font-bold uppercase tracking-wide text-[#6b6578]">
                Abandono
              </p>
              <div className="mb-4 grid gap-4 md:grid-cols-2">
                <Card title="¿En qué paso abandonan?" sub="Llegaron al paso y no avanzaron">
                  <div id="abScreen" className="h-[340px] w-full" />
                </Card>
                <Card title="Retención paso a paso" sub="% del paso anterior">
                  <div id="abRet" className="h-[340px] w-full" />
                </Card>
              </div>

              <Card title="Acciones post-resultado" sub="Share / descarga e ICS / Google Calendar">
                <div id="actions" className="h-[280px] w-full" />
              </Card>

              <Card title="Detalle por paso" sub="Llegaron · Completaron · Abandonaron">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="bg-[#503C77] px-2.5 py-2 text-left text-white">
                        Paso
                      </th>
                      <th className="bg-[#503C77] px-2.5 py-2 text-left text-white">
                        Llegaron
                      </th>
                      <th className="bg-[#503C77] px-2.5 py-2 text-left text-white">
                        Completaron
                      </th>
                      <th className="bg-[#503C77] px-2.5 py-2 text-left text-white">
                        Abandonaron
                      </th>
                      <th className="bg-[#503C77] px-2.5 py-2 text-left text-white">
                        % abandono
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {abTable.map((row) => (
                      <tr key={row.step}>
                        <td className="border border-[#e8e4f0] px-2.5 py-2">
                          {row.step}
                        </td>
                        <td className="border border-[#e8e4f0] px-2.5 py-2 text-center">
                          {row.arrived}
                        </td>
                        <td className="border border-[#e8e4f0] px-2.5 py-2 text-center">
                          {row.done}
                        </td>
                        <td className="border border-[#e8e4f0] px-2.5 py-2 text-center">
                          {row.abandoned}
                        </td>
                        <td
                          className={`border border-[#e8e4f0] px-2.5 py-2 text-center ${
                            (row.pct ?? 0) >= 20
                              ? "font-bold text-[#d9534f]"
                              : ""
                          }`}
                        >
                          {row.pct == null ? "–" : `${row.pct}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </section>

            <section className={tab === "mapa" ? "" : "hidden"}>
              <div className="mb-[18px] grid grid-cols-2 gap-3.5 md:grid-cols-4">
                <Kpi value={mapKpis.results} label="Búsquedas con resultados" />
                <Kpi value={mapKpis.markers} label="Clicks en marcador" />
                <Kpi value={mapKpis.llegar} label="Cómo llegar" />
                <Kpi value={mapKpis.conv} label="Conversión a Cómo llegar" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card title="Funnel del mapa" sub="% del paso anterior">
                  <div id="mapFunnel" className="h-[420px] w-full" />
                </Card>
                <Card title="Top provincias buscadas" sub="En búsquedas con resultados">
                  <div id="provincias" className="h-[420px] w-full" />
                </Card>
              </div>
              <div className="mt-4">
                <Card
                  title="Top localidades"
                  sub="Cuando eligen localidad en el filtro"
                >
                  <div id="localidades" className="h-[340px] w-full" />
                </Card>
              </div>
            </section>

            <section className={tab === "popups" ? "" : "hidden"}>
              <p className="mb-2.5 text-[13px] font-bold uppercase tracking-wide text-[#6b6578]">
                Popup campaña (quiz)
              </p>
              <div className="mb-[18px] grid grid-cols-2 gap-3.5 md:grid-cols-4">
                <Kpi value={popupKpis.campView} label="Vieron el popup" />
                <Kpi value={popupKpis.campAnswer} label="Respondieron" />
                <Kpi value={popupKpis.campCorrectPct} label="% respuestas correctas" />
                <Kpi value={popupKpis.campCta} label="Click CTA" />
              </div>
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <Card title="Funnel campaña" sub="Vista → respuesta → CTA">
                  <div id="campFunnel" className="h-[340px] w-full" />
                </Card>
                <Card title="Resultado del quiz" sub="Correctas / incorrectas / cierres">
                  <div id="campAnswers" className="h-[340px] w-full" />
                </Card>
              </div>

              <p className="mb-2.5 border-t border-[#e8e4f0] pt-4 text-[13px] font-bold uppercase tracking-wide text-[#6b6578]">
                Popup pediatra
              </p>
              <div className="mb-[18px] grid grid-cols-2 gap-3.5 md:grid-cols-4">
                <Kpi value={popupKpis.pedView} label="Vieron el popup" />
                <Kpi value={popupKpis.pedYes} label="Dijeron Sí" />
                <Kpi value={popupKpis.pedNo} label="Dijeron No" />
                <Kpi value={popupKpis.pedYesPct} label="% Sí (sobre respuestas)" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card title="Funnel pediatra" sub="Vista → respuesta → Sí">
                  <div id="pedFunnel" className="h-[340px] w-full" />
                </Card>
                <Card title="Respuestas pediatra" sub="Sí / No / cerraron sin responder">
                  <div id="pedAnswers" className="h-[340px] w-full" />
                </Card>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3.5 p-5 text-center">
      {children}
    </div>
  );
}

function LockBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[380px] rounded-2xl bg-white px-[34px] py-9 shadow-[0_10px_40px_rgba(0,0,0,.12)]">
      {children}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-[10px] border-0 px-[18px] py-2.5 text-sm font-semibold ${
        active
          ? "bg-[#503C77] text-white"
          : "bg-[#ebe6f3] text-[#3d2d5c]"
      }`}
    >
      {children}
    </button>
  );
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[14px] bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(0,0,0,.06)]">
      <div className="text-[28px] font-extrabold text-[#3d2d5c]">{value}</div>
      <div className="mt-0.5 text-xs text-[#6b6578]">{label}</div>
    </div>
  );
}

function Card({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 rounded-[14px] bg-white px-[18px] py-4 shadow-[0_1px_4px_rgba(0,0,0,.06)]">
      <h3 className="m-0 mb-1 text-[15px] text-[#3d2d5c]">{title}</h3>
      {sub ? <p className="mb-2 text-xs text-[#6b6578]">{sub}</p> : null}
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.3 13.2 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.2 5.5-4.7 7.2l7.3 5.7C43.6 38 46.5 31.8 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.3-5.7c-2 1.4-4.7 2.3-7.9 2.3-6.4 0-11.7-3.7-13.6-8.9l-7.9 6.1C6.4 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}
