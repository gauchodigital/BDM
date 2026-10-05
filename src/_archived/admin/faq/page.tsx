import { AdminNav } from "../AdminNav";
import { FaqManager } from "./FaqManager";
import { readFaq } from "@/lib/faqData";

export const dynamic = "force-dynamic";

export default function AdminFaqPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <AdminNav />
      <FaqManager initialData={readFaq()} />
    </div>
  );
}
