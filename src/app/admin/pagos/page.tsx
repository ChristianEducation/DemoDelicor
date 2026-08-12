"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { PanelHeader } from "@/components/panel-ui";
import { useAdminFilter } from "@/components/admin-shell";
import { colegios, cursoLabel, cursos, estudiantes } from "@/data/delicor-data";
import { formatCLP, formatShortDate, matchesSearch } from "@/lib/format";
import { useDemo } from "@/store/demo-store";
import type { Compra, Estudiante } from "@/types";

interface PagoRow {
  student: Estudiante;
  compra: Compra | null;
}

function rangeLabel(compra: Compra, dates: string[]) {
  if (dates.length === 1) return formatShortDate(dates[0]);
  return `${formatShortDate(dates[0])} – ${formatShortDate(dates[dates.length - 1])} · ${dates.length} días`;
}

export default function AdminPagosPage() {
  const { almuerzos, compras } = useDemo();
  const { colegioFilter } = useAdminFilter();
  const [search, setSearch] = useState("");
  const [curso, setCurso] = useState("all");

  const roster = estudiantes.filter((item) => colegioFilter === "todos" || item.colegioId === colegioFilter);

  const rows: PagoRow[] = useMemo(() => {
    const hasFilters = search.trim().length > 0 || curso !== "all";
    if (!hasFilters) {
      return compras
        .filter((compra) => colegioFilter === "todos" || compra.colegioId === colegioFilter)
        .slice(0, 40)
        .map((compra) => ({ student: estudiantes.find((s) => s.id === compra.studentId)!, compra }))
        .filter((row) => row.student);
    }
    const filteredStudents = roster.filter((student) => {
      const matchesTerm = matchesSearch(`${student.name} ${student.apoderadoName}`, search);
      const matchesCurso = curso === "all" || student.cursoId === curso;
      return matchesTerm && matchesCurso;
    });
    return filteredStudents.flatMap((student): PagoRow[] => {
      const studentCompras = compras.filter((compra) => compra.studentId === student.id);
      if (studentCompras.length === 0) return [{ student, compra: null }];
      return studentCompras.map((compra) => ({ student, compra }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster, compras, search, curso]);

  return (
    <>
      <PanelHeader eyebrow="Administración Delicor" title="Pagos y compras" description="Consulta rápida del estado de compra de cualquier alumno o apoderado." />

      <section className="surface rounded-2xl p-3.5 sm:p-4">
        <label className="relative block">
          <span className="sr-only">Buscar alumno o apoderado</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--coral)]" size={18} aria-hidden="true" />
          <input className="field min-h-12 !pl-10 !pr-10 text-sm font-semibold" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por alumno o apoderado..." />
          {search && (
            <button type="button" className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--ink-soft)]" onClick={() => setSearch("")} aria-label="Limpiar búsqueda">
              <X size={17} />
            </button>
          )}
        </label>
        <div className="mt-3">
          <select className="field sm:w-64" value={curso} onChange={(event) => setCurso(event.target.value)}>
            <option value="all">Todos los cursos</option>
            {cursos.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </section>

      <p className="mb-2 mt-4 px-1 text-sm font-bold text-[var(--muted)]">
        {search || curso !== "all" ? `${rows.length} resultados` : `${rows.length} compras recientes`}
      </p>

      {rows.length === 0 ? (
        <div className="surface rounded-2xl p-8 text-center">
          <Search className="mx-auto text-[var(--line-accent)]" size={32} />
          <h2 className="display-font mt-3 mb-1 text-lg font-bold">Sin resultados</h2>
          <p className="mb-0 text-sm text-[var(--muted)]">Prueba otra búsqueda o filtro.</p>
        </div>
      ) : (
        <div className="surface overflow-x-auto rounded-xl">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-left text-[0.65rem] font-extrabold uppercase tracking-[0.06em] text-[var(--muted)]">
                <th className="px-4 py-3 font-extrabold">Alumno</th>
                <th className="px-4 py-3 font-extrabold">Curso</th>
                <th className="px-4 py-3 font-extrabold">Colegio</th>
                <th className="px-4 py-3 font-extrabold">Días comprados</th>
                <th className="px-4 py-3 text-right font-extrabold">Monto</th>
                <th className="px-4 py-3 text-right font-extrabold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const colegio = colegios.find((item) => item.id === row.student.colegioId)!;
                const dates = row.compra
                  ? almuerzos.filter((item) => row.compra!.almuerzoIds.includes(item.id)).map((item) => item.date).sort()
                  : [];
                return (
                  <tr key={`${row.student.id}-${row.compra?.id ?? index}`} className="border-b border-[var(--line)] last:border-0 hover:bg-[oklch(98%_0.008_90)]">
                    <td className="px-4 py-3 font-extrabold">{row.student.name}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{cursoLabel(row.student.colegioId, row.student.cursoId)}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{colegio.shortName}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{row.compra ? rangeLabel(row.compra, dates) : "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold">{row.compra ? formatCLP(row.compra.total) : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      {row.compra ? (
                        <span className="badge-success"><Check size={11} /> Pagado</span>
                      ) : (
                        <span className="badge-neutral">Sin compra registrada</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-[var(--line)] bg-[oklch(97%_0.008_80)]">
                <td className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.05em] text-[var(--muted)]" colSpan={4}>
                  Total {search || curso !== "all" ? "de los resultados" : "de las compras listadas"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-extrabold">
                  {formatCLP(rows.reduce((sum, row) => sum + (row.compra?.total ?? 0), 0))}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </>
  );
}
