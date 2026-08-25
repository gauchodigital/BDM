import fs from "fs";
import path from "path";
import type { FaqData } from "@/lib/faqTypes";

export type { FaqData, FaqCategoryId } from "@/lib/faqTypes";
export { FAQ_CATEGORIES } from "@/lib/faqTypes";

const DATA_PATH = path.join(process.cwd(), "faq-data.json");

export function readFaq(): FaqData[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as FaqData[];
  } catch {
    return [];
  }
}

export function writeFaq(data: FaqData[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}
