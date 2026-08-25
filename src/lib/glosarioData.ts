import fs from "fs";
import path from "path";

export interface GlosarioData {
  id: string;
  term: string;
  definition: string;
  visible: boolean;
}

const DATA_PATH = path.join(process.cwd(), "glosario-data.json");

export function readGlosario(): GlosarioData[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as GlosarioData[];
  } catch {
    return [];
  }
}

export function writeGlosario(data: GlosarioData[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}
