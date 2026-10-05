import { AdminNav } from "../AdminNav";
import { TestimoniosManager } from "./TestimoniosManager";
import { readTestimonios } from "@/lib/testimoniosData";

export const dynamic = "force-dynamic";

export default function AdminTestimoniosPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <AdminNav />
      <TestimoniosManager initialData={readTestimonios()} />
    </div>
  );
}
