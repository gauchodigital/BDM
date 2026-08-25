import fs from "fs";
import path from "path";

export interface DatoTabData {
  id: string;
  label: string;
  title: string;
  body: string;
  visible: boolean;
}

const DATA_PATH = path.join(process.cwd(), "datos-data.json");

export function readDatos(): DatoTabData[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as DatoTabData[];
  } catch {
    return [];
  }
}

export function writeDatos(data: DatoTabData[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}
