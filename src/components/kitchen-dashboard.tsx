"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  ChefHat,
  Clock3,
  Leaf,
  Search,
  UserRoundCog,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { MenuDayModal } from "@/components/menu-day-modal";
import { PanelHeader, MetricCard, MetricRow } from "@/components/panel-ui";
import { PanelShell } from "@/components/panel-shell";
import { WeekStrip } from "@/components/week-strip";
import { DEMO_TODAY, colegios, cursoLabel, cursos, estudiantes, funcionariosHoy } from "@/data/delicor-data";
import { semanasAgosto } from "@/data/menu-agosto";
import { formatLongDate, formatSantiagoTime, initials, matchesSearch } from "@/lib/format";
import { almuerzosForColegioDate, contarPlatosYPostres, paqueteParaEstudiante } from "@/lib/operations";
import { useDemo } from "@/store/demo-store";
import type { ColegioId, CutoffMode } from "@/types";

type Tab = "preparacion" | "entrega";
type StatusFilter = "pendientes" | "entregados" | "todos";

const cutoffModes: { id: CutoffMode; label: string }[] = [
  { id: "automatico", label: "Automático" },
  { id: "abierto", label: "Abierto" },
  { id: "cerrado", label: "Cerrado" },
];

export function KitchenDashboard({ colegioId }: { colegioId: ColegioId }) {
  const { almuerzos, deliveries, config, confirmDelivery, deliverSinPago, updateCutoffMode } = useDemo();
  const colegio = colegios.find((item) => item.id === colegioId)!;
  const otherColegio = colegios.find((item) => item.id !== colegioId)!;

  const [tab, setTab] = useState<Tab>("preparacion");
  const [weekIndex, setWeekIndex] = useState(1);
  const [date, setDate] = useState(DEMO_TODAY);
  const [toast, setToast] = useState("");

  const week = semanasAgosto[weekIndex];

  const almuerzosDelDia = useMemo(() => almuerzosForColegioDate(almuerzos, colegioId, date), [almuerzos, colegioId, date]);
  const almuerzosPreparacion = useMemo(() => almuerzosDelDia.filter((item) => item.source === "online"), [almuerzosDelDia]);
  const entregadosHoy = almuerzosDelDia.filter((item) => deliveries[`${item.studentId}__${item.date}`]).length;
  const pendientesEntrega = estudiantes.filter((item) => item.colegioId === colegioId).length;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <PanelShell
      tabs={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-h-11 rounded-xl bg-[oklch(94%_0.012_80)] p-1" role="tablist" aria-label="Vista operativa">
            <button type="button" role="tab" aria-selected={tab === "preparacion"} className={`rounded-lg px-4 text-sm font-extrabold transition-colors ${tab === "preparacion" ? "bg-[var(--paper)] text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`} onClick={() => setTab("preparacion")}>
              Preparación
            </button>
            <button type="button" role="tab" aria-selected={tab === "entrega"} className={`rounded-lg px-4 text-sm font-extrabold transition-colors ${tab === "entrega" ? "bg-[var(--paper)] text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`} onClick={() => setTab("entrega")}>
              Entrega
            </button>
          </div>
          <Link href={`/casino/${otherColegio.id}`} className="btn-quiet px-3 text-xs" title="Cambiar de sede">
            <Building2 size={14} /> {otherColegio.shortName}
          </Link>
        </div>
      }
    >
      <PanelHeader
        eyebrow={`Casino Delicor · ${colegio.name}`}
        title="Operación del día"
        description="Producción de cocina y entrega por estudiante, en un mismo lugar."
        actions={
          <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-2 py-1.5">
            <span className="hidden text-xs font-bold text-[var(--muted)] sm:inline">Corte {config.bookingCutoff}</span>
            <div className="flex rounded-lg bg-[oklch(94%_0.012_80)] p-0.5" role="group" aria-label="Modo de corte (demo)">
              {cutoffModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`min-h-8 rounded-md px-2 text-[0.65rem] font-extrabold transition-colors ${config.cutoffMode === mode.id ? "bg-[var(--paper)] text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`}
                  onClick={() => updateCutoffMode(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div className="surface mb-5 rounded-2xl p-4">
        <WeekStrip
          days={week.days}
          weekLabel={week.shortLabel}
          onPrev={() => setWeekIndex((i) => Math.max(0, i - 1))}
          onNext={() => setWeekIndex((i) => Math.min(semanasAgosto.length - 1, i + 1))}
          prevDisabled={weekIndex === 0}
          nextDisabled={weekIndex === semanasAgosto.length - 1}
          selectedDate={date}
          onSelectDate={setDate}
          renderIndicator={(day) => {
            const count = almuerzosForColegioDate(almuerzos, colegioId, day.date).length;
            return count > 0 ? <span>{count}</span> : null;
          }}
        />
      </div>

      <MetricRow>
        <MetricCard label="Total con almuerzo" value={almuerzosDelDia.length} icon={UtensilsCrossed} tone="coral" />
        <MetricCard label="Entregados" value={entregadosHoy} icon={Check} tone="success" />
        <MetricCard label="Funcionarios informados" value={funcionariosHoy(colegioId)} icon={UserRoundCog} tone="neutral" />
        <MetricCard label="Nómina del colegio" value={pendientesEntrega} icon={Users} tone="neutral" detail="estudiantes" />
      </MetricRow>

      <div className="mt-5">
        {tab === "preparacion" ? (
          <PreparacionView almuerzos={almuerzosPreparacion} date={date} />
        ) : (
          <EntregaView
            colegioId={colegioId}
            date={date}
            onDelivered={(name) => setToast(`Entregado a ${name}`)}
            confirmDelivery={confirmDelivery}
            deliverSinPago={deliverSinPago}
          />
        )}
      </div>

      {toast && (
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-xl bg-[var(--ink)] px-4 py-3.5 text-sm font-bold text-[var(--paper)] shadow-[var(--shadow-lg)]" role="status">
          <Check size={17} className="text-[var(--pine-soft)]" /> {toast}
        </div>
      )}
    </PanelShell>
  );
}

function PreparacionView({ almuerzos, date }: { almuerzos: ReturnType<typeof almuerzosForColegioDate>; date: string }) {
  const { platos, postres } = useMemo(() => contarPlatosYPostres(almuerzos), [almuerzos]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <section className="surface rounded-2xl p-4 sm:p-5">
        <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">
          <UtensilsCrossed size={14} /> Platos — {formatLongDate(date)}
        </p>
        {platos.length === 0 ? (
          <p className="mb-0 text-sm text-[var(--muted)]">Sin almuerzos pagados para este día.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {platos.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-2 last:border-0 last:pb-0">
                <span className="flex items-center gap-2 font-bold">
                  {item.name}
                  {item.vegetariano && <span className="chip-veg"><Leaf size={10} /> Veg</span>}
                </span>
                <strong className="display-font text-xl font-bold tabular-nums">{item.cantidad}</strong>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="surface rounded-2xl p-4 sm:p-5">
        <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">
          <ChefHat size={14} /> Postres — {formatLongDate(date)}
        </p>
        {postres.length === 0 ? (
          <p className="mb-0 text-sm text-[var(--muted)]">Sin almuerzos pagados para este día.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {postres.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-2 last:border-0 last:pb-0">
                <span className="font-bold">{item.name}</span>
                <strong className="display-font text-xl font-bold tabular-nums">{item.cantidad}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EntregaView({
  colegioId,
  date,
  onDelivered,
  confirmDelivery,
  deliverSinPago,
}: {
  colegioId: ColegioId;
  date: string;
  onDelivered: (name: string) => void;
  confirmDelivery: (studentId: string, date: string) => void;
  deliverSinPago: (studentId: string, colegioId: ColegioId, date: string, platoId: string, postreId: string) => void;
}) {
  const { almuerzos, deliveries, config } = useDemo();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("pendientes");
  const [curso, setCurso] = useState("all");
  const [selectingFor, setSelectingFor] = useState<string | null>(null);

  const day = semanasAgosto.flatMap((s) => s.days).find((d) => d.date === date);
  const roster = estudiantes.filter((item) => item.colegioId === colegioId);

  const filtered = useMemo(() => {
    return roster
      .map((student) => ({ student, pkg: paqueteParaEstudiante(almuerzos, deliveries, student.id, date) }))
      .filter(({ student, pkg }) => {
        const matchesTerm = matchesSearch(`${student.name} ${cursoLabel(student.colegioId, student.cursoId)}`, search);
        const matchesCurso = curso === "all" || student.cursoId === curso;
        const matchesStatus = status === "todos" || (status === "entregados" ? Boolean(pkg.entregadoAt) : !pkg.entregadoAt);
        return matchesTerm && matchesCurso && matchesStatus;
      });
  }, [roster, almuerzos, deliveries, date, search, curso, status]);

  const selectingStudent = selectingFor ? roster.find((item) => item.id === selectingFor) : undefined;

  return (
    <div className="grid grid-cols-1 gap-4">
      <section className="surface rounded-2xl p-3.5 sm:p-4">
        <label className="relative block">
          <span className="sr-only">Buscar estudiante o curso</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--coral)]" size={18} aria-hidden="true" />
          <input className="field min-h-12 !pl-10 !pr-10 text-sm font-semibold" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o curso..." />
          {search && (
            <button type="button" className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--ink-soft)]" onClick={() => setSearch("")} aria-label="Limpiar búsqueda">
              <X size={17} />
            </button>
          )}
        </label>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="flex min-h-11 rounded-lg bg-[oklch(94%_0.012_80)] p-1" role="group" aria-label="Filtrar por estado de entrega">
            {(["pendientes", "entregados", "todos"] as StatusFilter[]).map((item) => {
              const labels = { pendientes: "Pendientes", entregados: "Entregados", todos: "Todos" };
              return (
                <button key={item} type="button" className={`flex-1 rounded-md px-2 text-xs font-extrabold transition-colors ${status === item ? "bg-[var(--paper)] text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`} onClick={() => setStatus(item)}>
                  {labels[item]}
                </button>
              );
            })}
          </div>
          <label>
            <span className="sr-only">Curso</span>
            <select className="field" value={curso} onChange={(event) => setCurso(event.target.value)}>
              <option value="all">Todos los cursos</option>
              {cursos.map((item) => (
                <option key={item.id} value={item.id}>{cursoLabel(colegioId, item.id)}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section aria-live="polite">
        <p className="mb-2 px-1 text-sm font-bold text-[var(--muted)]">{filtered.length} {filtered.length === 1 ? "estudiante" : "estudiantes"}</p>
        {filtered.length === 0 ? (
          <div className="surface rounded-2xl p-8 text-center">
            <Search className="mx-auto text-[var(--line-accent)]" size={32} />
            <h2 className="display-font mt-3 mb-1 text-lg font-bold">No encontramos estudiantes</h2>
            <p className="mb-0 text-sm text-[var(--muted)]">Prueba otra búsqueda, filtro o fecha.</p>
          </div>
        ) : (
          <div className="surface overflow-hidden rounded-xl">
            {filtered.slice(0, 60).map(({ student, pkg }) => (
              <article key={student.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3.5 last:border-0 hover:bg-[oklch(98%_0.008_90)] sm:px-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[0.65rem] font-extrabold ${pkg.entregadoAt ? "bg-[var(--pine-soft)] text-[var(--pine-dark)]" : pkg.estado === "pendiente" ? "bg-[var(--amber-soft)] text-[var(--amber-dark)]" : "bg-[var(--coral-soft)] text-[var(--coral-dark)]"}`}>
                    {initials(student.name)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="mb-0 truncate text-sm font-extrabold">{student.name}</h3>
                    <p className="mb-1.5 mt-0.5 truncate text-xs text-[var(--muted)]">{cursoLabel(colegioId, student.cursoId)}</p>
                    {pkg.almuerzo ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={pkg.estado === "pagado" ? "badge-success" : "badge-warning"}>
                          {pkg.estado === "pagado" ? <><Check size={11} /> Pagado</> : <><Clock3 size={11} /> Pago pendiente</>}
                        </span>
                        <span className="text-xs font-semibold text-[var(--ink)]">{pkg.almuerzo.platoNombre} · {pkg.almuerzo.postreNombre}</span>
                        {pkg.almuerzo.platoVegetariano && <span className="chip-veg"><Leaf size={10} /> Veg</span>}
                      </div>
                    ) : (
                      <span className="badge-neutral">Sin pago registrado</span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  {pkg.entregadoAt ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--pine-dark)]">
                      <Check size={13} /> Entregado · {formatSantiagoTime(pkg.entregadoAt)}
                    </span>
                  ) : pkg.almuerzo ? (
                    <button type="button" className="btn-primary min-h-9 px-3.5 text-xs" onClick={() => { confirmDelivery(student.id, date); onDelivered(student.name); }}>
                      Entregar
                    </button>
                  ) : (
                    <button type="button" className="btn-secondary min-h-9 px-3.5 text-xs" onClick={() => setSelectingFor(student.id)}>
                      Elegir y entregar
                    </button>
                  )}
                </div>
              </article>
            ))}
            {filtered.length > 60 && (
              <p className="mb-0 border-t border-[var(--line)] px-5 py-3 text-center text-xs font-bold text-[var(--muted)]">
                Mostrando 60 de {filtered.length} resultados — refina la búsqueda para ver más.
              </p>
            )}
          </div>
        )}
      </section>

      {selectingStudent && day && (
        <MenuDayModal
          day={day}
          unitPrice={config.unitPrice}
          continueLabel="Entregar"
          onConfirm={(platoId, postreId) => {
            deliverSinPago(selectingStudent.id, colegioId, date, platoId, postreId);
            onDelivered(selectingStudent.name);
            setSelectingFor(null);
          }}
          onClose={() => setSelectingFor(null)}
        />
      )}
    </div>
  );
}
