import fs from "fs";
import path from "path";

export type CausaTagColor = "accent" | "primary" | "secondary" | "light";

export interface CausaData {
  id: string;
  slug: string;
  tagLabel: string;
  tagColor: CausaTagColor;
  title: string;
  description: string;
  body: string;
  visible: boolean;
}

const DATA_PATH = path.join(process.cwd(), "causas-data.json");

export function readCausas(): CausaData[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as CausaData[];
  } catch {
    return [];
  }
}

export function writeCausas(data: CausaData[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function getCausaBySlug(slug: string): CausaData | undefined {
  return readCausas().find((c) => c.slug === slug && c.visible);
}
