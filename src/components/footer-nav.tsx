"use client";

import Link from "next/link";
import { ChefHat, ShieldCheck } from "lucide-react";
import { useDemo } from "@/store/demo-store";

/**
 * Accesos discretos al pie de la experiencia del apoderado (SPEC sección 7): llevan a
 * Cocina (sede concreta del estudiante activo, o el picker si aún no hay contexto) y a
 * Administración. No es un selector de rol: son enlaces secundarios de una plataforma real.
 */
export function FooterNav() {
  const { selectedColegioId } = useDemo();
  const casinoHref = selectedColegioId ? `/casino/${selectedColegioId}` : "/casino";

  return (
    <footer className="mx-auto mt-10 max-w-5xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[var(--line)] pt-5 text-xs font-bold text-[var(--muted)]">
        <Link href={casinoHref} className="inline-flex items-center gap-1.5 text-[var(--muted)] no-underline transition-colors hover:text-[var(--ink)]">
          <ChefHat size={14} aria-hidden="true" /> Acceso Casino
        </Link>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-[var(--muted)] no-underline transition-colors hover:text-[var(--ink)]">
          <ShieldCheck size={14} aria-hidden="true" /> Administración
        </Link>
      </div>
    </footer>
  );
}
