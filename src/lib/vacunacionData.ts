import fs from "fs";
import path from "path";

export interface VacunaItem {
  nombre: string;
  detalle: string;
}

export interface VacunaGrupo {
  id: string;
  badge: string;
  subtitulo?: string;
  vacunas: VacunaItem[];
}

export interface VacunaEtapa {
  id: string;
  label: string;
  icon: string;
  bannerTitle: string;
  bannerSubtitle: string;
  grupos: VacunaGrupo[];
}

export interface VacunacionData {
  hero: { title: string; body: string };
  calendarioPdfUrl: string;
  calendarioIntro: {
    eyebrow: string;
    title: string;
    body: string;
    selectLabel: string;
  };
  etapas: VacunaEtapa[];
  centros: {
    eyebrow: string;
    title: string;
    body: string;
    paso1Label: string;
    placeholder: string;
    provincias: string[];
    disclaimer: string;
  };
}

const DATA_PATH = path.join(process.cwd(), "vacunacion-data.json");

export function readVacunacion(): VacunacionData {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as VacunacionData;
}
