import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipo",
  robots: { index: false, follow: false },
};

export default function EquipoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#f4f2f8]">
      {children}
    </div>
  );
}
