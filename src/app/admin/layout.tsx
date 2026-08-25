import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#120f18]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#120f18]/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
            <span className="text-xs font-black text-white">B</span>
          </div>
          <span className="text-sm font-bold tracking-wide text-white">
            BastaDeMeningitis
          </span>
          <span className="text-xs text-white/20">·</span>
          <span className="text-xs font-medium text-white/40">
            Panel de administración
          </span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40 transition-all hover:border-white/20 hover:text-white/80"
        >
          Ver sitio
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 8L8 2M8 2H4M8 2v4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </header>
      {children}
    </div>
  );
}
