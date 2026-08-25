import { AdminNav } from "../AdminNav";
import { SintomasManager } from "./SintomasManager";
import { readSintomas } from "@/lib/sintomasData";

export const dynamic = "force-dynamic";

export default function AdminSintomasPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <AdminNav />
      <SintomasManager initialData={readSintomas()} />
    </div>
  );
}
