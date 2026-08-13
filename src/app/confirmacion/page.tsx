"use client";

import Link from "next/link";
import { ArrowRight, Check, House, Leaf, PartyPopper } from "lucide-react";
import { FlowGuard } from "@/components/flow-guard";
import { PortalShell } from "@/components/portal-shell";
import { cursoLabel, estudiantes } from "@/data/delicor-data";
import { formatCLP, formatLongDate } from "@/lib/format";
import { useDemo } from "@/store/demo-store";

export default function ConfirmationPage() {
  const { lastCompraId, compras, almuerzos } = useDemo();
  const compra = compras.find((item) => item.id === lastCompraId);
  const student = estudiantes.find((item) => item.id === compra?.studentId);
  const items = compra ? almuerzos.filter((item) => compra.almuerzoIds.includes(item.id)).sort((a, b) => a.date.localeCompare(b.date)) : [];

  if (!compra || !student) {
    return (
      <PortalShell step={4}>
        <FlowGuard title="No hay una compra reciente" description="Completa un pedido para ver su confirmación." href="/semana" cta="Volver a mi semana" />
      </PortalShell>
    );
  }

  return (
    <PortalShell step={4}>
      <div className="mx-auto max-w-3xl text-center">
        <div className="relative mx-auto grid size-16 place-items-center rounded-full bg-[var(--coral)] text-[var(--paper)] shadow-[0_12px_32px_oklch(62%_0.19_27/0.32)] lg:size-20">
          <Check size={30} strokeWidth={2.4} className="lg:size-9" aria-hidden="true" />
          <PartyPopper className="absolute -right-3 -top-1.5 text-[var(--amber)]" size={20} aria-hidden="true" />
        </div>
        <span className="eyebrow mt-5">✓ Pago confirmado</span>
        <h1 className="display-font mt-2 text-[1.55rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.75rem] lg:text-[2.15rem]">Listo, {student.name.split(" ")[0]}</h1>
        <p className="mx-auto mt-3 max-w-lg text-[var(--muted)] lg:text-lg">
          El pedido de <strong className="text-[var(--ink)]">{student.name}</strong> quedó pagado y ya está disponible para el equipo de cocina de {cursoLabel(student.colegioId, student.cursoId).slice(0, -1)}.
        </p>

        {compra.discountApplied && (
          <p className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 rounded-xl bg-[var(--pine-soft)] px-4 py-2.5 text-sm font-extrabold text-[var(--pine-dark)]">
            <PartyPopper size={16} /> Mes completo — 10% de descuento aplicado
          </p>
        )}

        <section className="surface mt-7 rounded-2xl p-4 text-left sm:p-6" aria-label="Detalle del pedido">
          <div className="flex flex-col gap-2 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-0.5 text-base font-extrabold">{student.name}</h2>
              <p className="mb-0 text-sm text-[var(--muted)]">{cursoLabel(student.colegioId, student.cursoId)}</p>
            </div>
            <div className="sm:text-right">
              <p className="mb-0.5 text-xs font-bold text-[var(--muted)]">Total pagado</p>
              <strong className="text-lg tabular-nums">{formatCLP(compra.total)}</strong>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-[var(--pine-soft)] px-3 py-2.5 text-sm font-bold text-[var(--pine-dark)]">
                <span className="flex items-center gap-2">
                  <Check size={15} /> {formatLongDate(item.date)}
                  {item.platoVegetariano && <span className="chip-veg"><Leaf size={10} /> Veg</span>}
                </span>
                <span className="truncate text-xs font-semibold text-[var(--pine-dark)]/80">{item.platoNombre} · {item.postreNombre}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link href={`/casino/${student.colegioId}`} className="btn-primary">Ver operación en Cocina <ArrowRight size={17} /></Link>
          <Link href="/" className="btn-secondary"><House size={17} /> Volver al inicio</Link>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">El pedido ya está disponible para Cocina y Administración.</p>
      </div>
    </PortalShell>
  );
}
