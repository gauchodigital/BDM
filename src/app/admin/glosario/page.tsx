import { AdminNav } from "../AdminNav";
import { GlosarioManager } from "./GlosarioManager";
import { readGlosario } from "@/lib/glosarioData";

export const dynamic = "force-dynamic";

export default function AdminGlosarioPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <AdminNav />
      <GlosarioManager initialData={readGlosario()} />
    </div>
  );
}
