"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronDown, Copy, MessageSquareText, X } from "lucide-react";
import { PanelHeader } from "@/components/panel-ui";
import { useAdminFilter } from "@/components/admin-shell";
import { colegios, cursoLabel, estudiantes } from "@/data/delicor-data";
import { formatCLP, formatLongDate } from "@/lib/format";
import { deudasPorEstudiante, type DeudaEstudiante } from "@/lib/operations";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { useDemo } from "@/store/demo-store";

export default function AdminPendientesPage() {
  const { almuerzos, deliveries } = useDemo();
  const { colegioFilter } = useAdminFilter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [comunicarPara, setComunicarPara] = useState<DeudaEstudiante | null>(null);

  const deudas = useMemo(() => {
    const filtrados = colegioFilter === "todos" ? almuerzos : almuerzos.filter((item) => item.colegioId === colegioFilter);
    return deudasPorEstudiante(filtrados, deliveries);
  }, [almuerzos, deliveries, colegioFilter]);

  const totalAdeudado = deudas.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <PanelHeader
        eyebrow="Administración Delicor"
        title="Pendientes de cobro"
        description="Almuerzos entregados a estudiantes sin pago registrado, agrupados por alumno con trazabilidad completa."
        actions={<span className="badge-warning text-sm">{formatCLP(totalAdeudado)} en total</span>}
      />

      {deudas.length === 0 ? (
        <div className="surface rounded-2xl p-8 text-center">
          <h2 className="display-font mb-1 text-lg font-bold">Sin pendientes de cobro</h2>
          <p className="mb-0 text-sm text-[var(--muted)]">No hay almuerzos entregados sin pago registrado para este filtro.</p>
        </div>
      ) : (
        <div className="surface overflow-x-auto rounded-xl">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-left text-[0.65rem] font-extrabold uppercase tracking-[0.06em] text-[var(--muted)]">
                <th className="px-4 py-3 font-extrabold">Alumno</th>
                <th className="px-4 py-3 font-extrabold">Curso</th>
                <th className="px-4 py-3 font-extrabold">Colegio</th>
                <th className="px-4 py-3 text-right font-extrabold">Consumos</th>
                <th className="px-4 py-3 text-right font-extrabold">Total adeudado</th>
                <th className="px-4 py-3 text-right font-extrabold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {deudas.map((deuda) => {
                const student = estudiantes.find((item) => item.id === deuda.studentId)!;
                const colegio = colegios.find((item) => item.id === student.colegioId)!;
                const isOpen = expanded === deuda.studentId;
                return (
                  <Fragment key={deuda.studentId}>
                    <tr className="border-b border-[var(--line)] last:border-0 hover:bg-[oklch(98%_0.008_90)]">
                      <td className="px-4 py-3">
                        <button type="button" className="flex items-center gap-2 font-extrabold text-[var(--ink)]" onClick={() => setExpanded(isOpen ? null : deuda.studentId)}>
                          <ChevronDown size={15} className={`shrink-0 text-[var(--muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          {student.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">{cursoLabel(student.colegioId, student.cursoId)}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">{colegio.shortName}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="badge-warning">{deuda.consumos.length}</span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-extrabold">{formatCLP(deuda.total)}</td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" className="btn-secondary min-h-9 px-3 text-xs" onClick={() => setComunicarPara(deuda)}>
                          <MessageSquareText size={14} /> Comunicar deuda
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={`${deuda.studentId}-detalle`} className="border-b border-[var(--line)] last:border-0">
                        <td colSpan={6} className="bg-[oklch(97%_0.008_80)] px-5 py-3.5">
                          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                            {deuda.consumos.map((consumo) => (
                              <div key={consumo.id} className="flex items-center justify-between gap-3 text-sm">
                                <span className="font-semibold">{formatLongDate(consumo.date)} — {consumo.platoNombre} · {consumo.postreNombre}</span>
                                <span className="shrink-0 tabular-nums font-bold text-[var(--muted)]">{formatCLP(consumo.unitPrice)}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {comunicarPara && (
        <ComunicarDeudaModal
          deuda={comunicarPara}
          studentName={estudiantes.find((item) => item.id === comunicarPara.studentId)!.name}
          onClose={() => setComunicarPara(null)}
        />
      )}
    </>
  );
}

function ComunicarDeudaModal({
  deuda,
  studentName,
  onClose,
}: {
  deuda: DeudaEstudiante;
  studentName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const firstName = studentName.split(" ")[0];
  const message = `Hola, te escribimos de Delicor. ${studentName} registra ${deuda.consumos.length} ${deuda.consumos.length === 1 ? "almuerzo pendiente" : "almuerzos pendientes"} de pago por un total de ${formatCLP(deuda.total)}. Puedes regularizarlo en la app de Delicor. ¡Gracias!`;

  useScrollLock();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // portapapeles no disponible; el texto ya queda visible para copiar manualmente.
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid h-[100svh] w-screen place-items-center bg-[color:var(--ink)]/50 p-4" role="dialog" aria-modal="true" aria-labelledby="comunicar-title">
      <div className="page-enter max-h-[90svh] w-full max-w-md overflow-y-auto rounded-2xl bg-[var(--paper)] p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[var(--amber-soft)] text-[var(--amber-dark)]"><MessageSquareText size={19} /></span>
          <button type="button" className="btn-quiet px-2" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>
        <h2 id="comunicar-title" className="display-font mt-4 mb-1 text-xl font-bold">Comunicar deuda a {firstName}</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          {deuda.consumos.length} {deuda.consumos.length === 1 ? "consumo" : "consumos"} pendientes por un total de <strong className="text-[var(--ink)]">{formatCLP(deuda.total)}</strong>.
        </p>
        <div className="rounded-xl border border-[var(--line)] bg-[oklch(97%_0.008_80)] p-3.5 text-sm text-[var(--ink)]">{message}</div>
        <p className="mt-3 mb-0 text-xs text-[var(--muted)]">Esta demo no envía el mensaje: solo muestra un ejemplo listo para comunicar.</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>Cerrar</button>
          <button type="button" className="btn-primary" onClick={copy}>
            <Copy size={15} /> {copied ? "Copiado" : "Copiar mensaje"}
          </button>
        </div>
      </div>
    </div>
  );
}
