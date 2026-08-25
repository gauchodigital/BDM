import fs from "fs";
import path from "path";
import { parseCentros, type CentroVacunacion } from "@/lib/centrosData";

const DATA_PATH = path.join(process.cwd(), "centros-data.json");

export function readCentros(): CentroVacunacion[] {
  try {
    return parseCentros(JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")));
  } catch {
    return [];
  }
}
