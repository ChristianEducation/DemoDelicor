"use client";

import Link from "next/link";
import { ArrowRight, ChefHat } from "lucide-react";
import { PanelShell } from "@/components/panel-shell";
import { PanelHeader } from "@/components/panel-ui";
import { DEMO_TODAY, colegios, estudiantes, funcionariosHoy } from "@/data/delicor-data";
import { useDemo } from "@/store/demo-store";

export default function CasinoPickerPage() {
  const { almuerzos } = useDemo();

  return (
    <PanelShell>
      <PanelHeader eyebrow="Casino Delicor" title="Elige la sede" description="Cada cocina opera únicamente su propio establecimiento." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {colegios.map((colegio) => {
          const totalHoy = almuerzos.filter((item) => item.colegioId === colegio.id && item.date === DEMO_TODAY).length;
          const totalEstudiantes = estudiantes.filter((item) => item.colegioId === colegio.id).length;
          return (
            <Link key={colegio.id} href={`/casino/${colegio.id}`} className="surface group rounded-2xl p-5 no-underline transition-transform hover:-translate-y-0.5">
              <span className="grid size-11 place-items-center rounded-xl bg-[var(--coral-soft)] text-[var(--coral-dark)]"><ChefHat size={20} /></span>
              <h2 className="display-font mt-3 mb-1 text-lg font-bold text-[var(--ink)]">{colegio.name}</h2>
              <p className="mb-4 text-sm text-[var(--muted)]">{colegio.comuna} · {totalEstudiantes} estudiantes · {funcionariosHoy(colegio.id)} funcionarios hoy</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--coral)]">
                {totalHoy} almuerzos hoy <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </PanelShell>
  );
}
