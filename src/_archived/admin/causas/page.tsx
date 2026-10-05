import { AdminNav } from "../AdminNav";
import { CausasManager } from "./CausasManager";
import { readCausas } from "@/lib/causasData";

export const dynamic = "force-dynamic";

export default function AdminCausasPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <AdminNav />
      <CausasManager initialData={readCausas()} />
    </div>
  );
}
