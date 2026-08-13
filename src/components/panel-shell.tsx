import Link from "next/link";
import { House } from "lucide-react";
import { Brand, DemoBadge } from "@/components/brand";

export function PanelShell({
  children,
  tabs,
  sidebar,
}: {
  children: React.ReactNode;
  tabs?: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[var(--cream)] lg:flex">
      {sidebar && (
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:gap-6 lg:overflow-y-auto lg:border-r lg:border-[var(--line)] lg:bg-[var(--paper)] lg:px-5 lg:py-6">
          <Brand compact />
          <DemoBadge />
          {sidebar}
          <Link href="/" className="btn-quiet mt-auto justify-start px-3.5">
            <House size={17} /> Volver al inicio
          </Link>
        </aside>
      )}

      <div className="min-w-0 flex-1">
        <header className={`sticky top-0 z-20 border-b border-[var(--line)] bg-[color:var(--cream)]/92 px-4 py-3 backdrop-blur-md sm:px-6 ${sidebar ? "lg:hidden" : ""}`}>
          <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-4">
            <Brand compact />
            <div className="flex items-center gap-2">
              <DemoBadge />
              <Link href="/" className="btn-quiet px-3" aria-label="Volver al inicio">
                <House size={17} />
              </Link>
            </div>
          </div>
          {tabs && <div className="mx-auto mt-3 max-w-[80rem]">{tabs}</div>}
        </header>
        <main id="contenido-principal" className="page-enter min-h-dvh px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[80rem]">{children}</div>
        </main>
      </div>
    </div>
  );
}
