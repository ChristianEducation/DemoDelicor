"use client";

import { useMemo, useState } from "react";
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
        <div className="surface overflow-hidden rounded-xl">
          {deudas.map((deuda) => {
            const student = estudiantes.find((item) => item.id === deuda.studentId)!;
            const colegio = colegios.find((item) => item.id === student.colegioId)!;
            const isOpen = expanded === deuda.studentId;
            return (
              <div key={deuda.studentId} className="border-b border-[var(--line)] last:border-0">
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                  <button type="button" className="flex min-w-0 items-center gap-2 text-left" onClick={() => setExpanded(isOpen ? null : deuda.studentId)}>
                    <ChevronDown size={16} className={`shrink-0 text-[var(--muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-extrabold">{student.name}</span>
                      <span className="block truncate text-xs text-[var(--muted)]">{cursoLabel(student.colegioId, student.cursoId)} · {colegio.shortName}</span>
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="badge-warning">{deuda.consumos.length} {deuda.consumos.length === 1 ? "consumo pendiente" : "consumos pendientes"}</span>
                    <strong className="tabular-nums text-sm font-extrabold">{formatCLP(deuda.total)}</strong>
                    <button type="button" className="btn-secondary min-h-9 px-3 text-xs" onClick={() => setComunicarPara(deuda)}>
                      <MessageSquareText size={14} /> Comunicar deuda
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="grid grid-cols-1 gap-1.5 bg-[oklch(97%_0.008_80)] px-5 py-3.5 sm:pl-11">
                    {deuda.consumos.map((consumo) => (
                      <div key={consumo.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-semibold">{formatLongDate(consumo.date)} — {consumo.platoNombre} · {consumo.postreNombre}</span>
                        <span className="tabular-nums font-bold text-[var(--muted)]">{formatCLP(consumo.unitPrice)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
