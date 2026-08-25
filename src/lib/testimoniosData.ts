import fs from "fs";
import path from "path";

export type TestimonioCategory = "medico" | "paciente";

export interface TestimonioData {
  id: string;
  slug: string;
  name: string;
  role: string;
  category: TestimonioCategory;
  quote: string;
  videoUrl: string;
  thumbnailSrc: string;
  visible: boolean;
}

const DATA_PATH = path.join(process.cwd(), "testimonios-data.json");

export function readTestimonios(): TestimonioData[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as TestimonioData[];
  } catch {
    return [];
  }
}

export function writeTestimonios(data: TestimonioData[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}
