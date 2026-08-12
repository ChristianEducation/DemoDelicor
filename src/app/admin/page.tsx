"use client";

import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CalendarCheck,
  CircleDollarSign,
  Clock3,
  Leaf,
  ShoppingBag,
  Truck,
  UserRoundCog,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { PanelHeader, MetricCard, MetricRow } from "@/components/panel-ui";
import { useAdminFilter } from "@/components/admin-shell";
import { DEMO_TODAY, colegios, cursoLabel, estudiantes, funcionariosHoy, funcionariosMes } from "@/data/delicor-data";
import { operacionDeHoy, resumenGeneral } from "@/lib/admin-metrics";
import { formatCLP } from "@/lib/format";
import { deudasPorEstudiante } from "@/lib/operations";
import { useDemo } from "@/store/demo-store";

export default function AdminResumenPage() {
  const { almuerzos, compras, deliveries } = useDemo();
  const { colegioFilter } = useAdminFilter();

  const resumen = resumenGeneral(compras, almuerzos, deliveries, colegioFilter, DEMO_TODAY);
  const hoy = operacionDeHoy(almuerzos, deliveries, colegioFilter, DEMO_TODAY);

  return (
    <>
      <PanelHeader
        eyebrow="Administración Delicor"
        title="Resumen general"
        description="Ingresos, pagos, pendientes de cobro y operación diaria de ambos colegios en un solo lugar."
      />

      <MetricRow>
        <MetricCard label="Ingresos del mes" value={formatCLP(resumen.ingresosDelMes)} icon={Banknote} tone="coral" />
        <MetricCard label="Almuerzos pagados" value={resumen.almuerzosPagados} icon={UtensilsCrossed} tone="success" />
        <MetricCard label="Pendiente de cobro" value={formatCLP(resumen.montoPendienteCobro)} icon={CircleDollarSign} tone="warning" />
        <MetricCard label="Entregados hoy" value={resumen.entregadosHoy} icon={Truck} tone="neutral" />
      </MetricRow>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat icon={UserRoundCog} label="Funcionarios hoy" value={funcionariosHoy(colegioFilter)} />
        <MiniStat icon={CalendarCheck} label="Funcionarios en el mes" value={funcionariosMes(colegioFilter)} />
        <MiniStat icon={Users} label="Alumnos activos" value={resumen.alumnosActivos} />
        <MiniStat icon={Clock3} label="Pendientes de entrega hoy" value={hoy.pendientesDeEntregar} />
      </div>

      <h2 className="display-font mt-8 mb-3 text-lg font-bold">Operación de hoy</h2>
      <div className="surface grid grid-cols-1 gap-5 rounded-2xl p-4 sm:grid-cols-2 sm:p-5">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]"><UtensilsCrossed size={14} /> Platos</p>
          {hoy.platos.length === 0 ? (
            <p className="mb-0 text-sm text-[var(--muted)]">Sin datos para hoy.</p>
          ) : (
            <div className="grid grid-cols-1 gap-1.5">
              {hoy.platos.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-1.5 font-semibold">
                    {item.name}
                    {item.vegetariano && <span className="chip-veg"><Leaf size={10} /> Veg</span>}
                  </span>
                  <span className="tabular-nums font-bold text-[var(--muted)]">{item.cantidad}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]"><ShoppingBag size={14} /> Postres</p>
          {hoy.postres.length === 0 ? (
            <p className="mb-0 text-sm text-[var(--muted)]">Sin datos para hoy.</p>
          ) : (
            <div className="grid grid-cols-1 gap-1.5">
              {hoy.postres.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold">{item.name}</span>
                  <span className="tabular-nums font-bold text-[var(--muted)]">{item.cantidad}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-4 text-sm font-bold sm:col-span-2">
          <span className="badge-success">{hoy.pagadosReservados} pagados/reservados</span>
          <span className="badge-neutral">{hoy.entregados} entregados</span>
          <span className="badge-warning">{hoy.entregadosSinPago} entregados sin pago</span>
        </div>
      </div>

      <h2 className="display-font mt-8 mb-3 text-lg font-bold">Por colegio</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {colegios.map((colegio) => {
          const colegioResumen = resumenGeneral(compras, almuerzos, deliveries, colegio.id, DEMO_TODAY);
          const colegioHoy = operacionDeHoy(almuerzos, deliveries, colegio.id, DEMO_TODAY);
          const deuda = deudasPorEstudiante(almuerzos.filter((item) => item.colegioId === colegio.id), deliveries);
          const flagship = deuda[0] ? estudiantes.find((item) => item.id === deuda[0].studentId) : undefined;
          return (
            <div key={colegio.id} className="surface rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="display-font mb-0.5 text-lg font-bold">{colegio.name}</h3>
                  <p className="mb-0 text-xs text-[var(--muted)]">{colegio.comuna}</p>
                </div>
                <Link href={`/casino/${colegio.id}`} className="btn-secondary min-h-9 px-3 text-xs">
                  Ver cocina <ArrowRight size={13} />
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Fact label="Alumnos activos" value={String(colegioResumen.alumnosActivos)} />
                <Fact label="Ingresos del mes" value={formatCLP(colegioResumen.ingresosDelMes)} />
                <Fact label="Almuerzos hoy" value={String(colegioHoy.pagadosReservados + colegioHoy.entregadosSinPago)} />
                <Fact label="Pendiente de cobro" value={formatCLP(colegioResumen.montoPendienteCobro)} />
                <Fact label="Funcionarios hoy" value={String(funcionariosHoy(colegio.id))} />
                <Fact label="Funcionarios en el mes" value={String(funcionariosMes(colegio.id))} />
              </div>
              {flagship && deuda[0] && (
                <p className="mt-3 mb-0 text-xs text-[var(--muted)]">
                  Mayor deuda: <strong className="text-[var(--ink)]">{flagship.name}</strong> ({cursoLabel(colegio.id, flagship.cursoId)}) — {formatCLP(deuda[0].total)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof UserRoundCog; label: string; value: number }) {
  return (
    <div className="surface rounded-xl p-3.5">
      <Icon size={16} className="mb-2 text-[var(--pine-dark)]" />
      <p className="mb-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.06em] text-[var(--muted)]">{label}</p>
      <strong className="display-font text-lg font-bold tabular-nums">{value}</strong>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 text-[0.62rem] font-extrabold uppercase tracking-[0.05em] text-[var(--muted)]">{label}</p>
      <strong className="text-sm font-extrabold">{value}</strong>
    </div>
  );
}
