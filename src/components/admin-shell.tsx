"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House } from "lucide-react";
import { AdminIntroModal } from "@/components/admin-intro-modal";
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

  const colegioSelect = (
    <select
      className="field !min-h-9 !w-auto text-sm lg:!min-h-10 lg:w-full"
      value={colegioFilter}
      onChange={(event) => setColegioFilter(event.target.value as AdminColegioFilter)}
    >
      <option value="todos">Todos los colegios</option>
      {colegios.map((colegio) => (
        <option key={colegio.id} value={colegio.id}>{colegio.name}</option>
      ))}
    </select>
  );

  return (
    <div className="min-h-dvh bg-[var(--cream)] lg:flex">
      {/* Sidebar de escritorio */}
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:gap-6 lg:overflow-y-auto lg:border-r lg:border-[var(--line)] lg:bg-[var(--paper)] lg:px-5 lg:py-6">
        <div className="flex items-center justify-between gap-2">
          <Brand compact />
        </div>
        <DemoBadge />
        <label className="grid gap-1.5">
          <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.06em] text-[var(--muted)]">Colegio</span>
          {colegioSelect}
        </label>
        <nav className="grid gap-1" aria-label="Secciones de administración">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3.5 py-2.5 text-sm font-extrabold no-underline transition-colors ${
                pathname === item.href
                  ? "bg-[var(--coral-soft)] text-[var(--coral-dark)]"
                  : "text-[var(--muted)] hover:bg-[var(--ink-soft)] hover:text-[var(--ink)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="btn-quiet mt-auto justify-start px-3.5">
          <House size={17} /> Volver al inicio
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Header móvil / tablet */}
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color:var(--cream)]/92 px-4 py-3 backdrop-blur-md sm:px-6 lg:hidden">
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
              {colegioSelect}
            </label>
          </div>
        </header>

        <main id="contenido-principal" className="page-enter min-h-dvh px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[80rem]">{children}</div>
        </main>
      </div>
      <AdminIntroModal />
    </div>
  );
}
