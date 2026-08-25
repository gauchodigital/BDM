import fs from "fs";
import path from "path";

export type SintomaPhase = "early" | "alarm";

export interface SintomaData {
  id: string;
  label: string;
  description: string;
  icon: string;
  phase: SintomaPhase;
  visible: boolean;
}

const DATA_PATH = path.join(process.cwd(), "sintomas-data.json");

export function readSintomas(): SintomaData[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as SintomaData[];
  } catch {
    return [];
  }
}

export function writeSintomas(data: SintomaData[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}
