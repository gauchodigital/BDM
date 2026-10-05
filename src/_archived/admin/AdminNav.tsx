"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/causas", label: "Causas" },
  { href: "/admin/sintomas", label: "Síntomas" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/testimonios", label: "Testimonios" },
  { href: "/admin/glosario", label: "Glosario" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-8 flex flex-wrap gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
              active
                ? "bg-primary text-white"
                : "text-white/40 hover:bg-white/5 hover:text-white/70"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
