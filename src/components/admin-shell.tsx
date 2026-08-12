"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House } from "lucide-react";
import { Brand, DemoBadge } from "@/components/brand";
import { colegios } from "@/data/delicor-data";
import type { ColegioId } from "@/types";

export type AdminColegioFilter = ColegioId | "todos";

const AdminFilterContext = createContext<{
  colegioFilter: AdminColegioFilter;
  setColegioFilter: (value: AdminColegioFilter) => void;
} | null>(null);

export function AdminFilterProvider({ children }: { children: ReactNode }) {
  const [colegioFilter, setColegioFilter] = useState<AdminColegioFilter>("todos");
  return <AdminFilterContext.Provider value={{ colegioFilter, setColegioFilter }}>{children}</AdminFilterContext.Provider>;
}

export function useAdminFilter() {
  const value = useContext(AdminFilterContext);
  if (!value) throw new Error("useAdminFilter must be used within AdminFilterProvider");
  return value;
}

const navItems = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/pagos", label: "Pagos" },
  { href: "/admin/pendientes", label: "Pendientes de cobro" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { colegioFilter, setColegioFilter } = useAdminFilter();

  return (
    <div className="min-h-dvh bg-[var(--cream)]">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color:var(--cream)]/92 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-4">
          <Brand compact />
          <div className="flex items-center gap-2">
            <DemoBadge />
            <Link href="/" className="btn-quiet px-3" aria-label="Volver al inicio">
              <House size={17} />
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-3 flex max-w-[80rem] flex-wrap items-center justify-between gap-3">
          <nav className="flex min-h-11 rounded-xl bg-[oklch(94%_0.012_80)] p-1" aria-label="Secciones de administración">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-extrabold no-underline transition-colors ${pathname === item.href ? "bg-[var(--paper)] text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <label className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]">
            Colegio
            <select className="field !min-h-9 !w-auto text-sm" value={colegioFilter} onChange={(event) => setColegioFilter(event.target.value as AdminColegioFilter)}>
              <option value="todos">Todos los colegios</option>
              {colegios.map((colegio) => (
                <option key={colegio.id} value={colegio.id}>{colegio.name}</option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <main id="contenido-principal" className="page-enter min-h-dvh px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-[80rem]">{children}</div>
      </main>
    </div>
  );
}
