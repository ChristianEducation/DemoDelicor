"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, Check, Clock3, HelpCircle, Leaf, PartyPopper, ShoppingCart, Truck, X } from "lucide-react";
import { FlowGuard } from "@/components/flow-guard";
import { InfoTip } from "@/components/info-tip";
import { MenuDayModal } from "@/components/menu-day-modal";
import { PortalShell } from "@/components/portal-shell";
import { Tour } from "@/components/tour";
import { WeekStrip } from "@/components/week-strip";
import { DEMO_TODAY, cursoLabel, estudiantes } from "@/data/delicor-data";
import { semanasAgosto, todosLosDiasHabilesAgosto } from "@/data/menu-agosto";
import { apoderadoTourSteps, infoTips } from "@/data/onboarding-content";
import { formatCLP, formatLongDate, isBeforeCutoff } from "@/lib/format";
import { computePurchasePreview } from "@/lib/pricing";
import { deliveryKey } from "@/lib/operations";
import { useDemo } from "@/store/demo-store";
import type { MenuDia } from "@/types";

type DayState = "pagado" | "entregado" | "carrito" | "disponible" | "pasado" | "cerrado";

export default function WeekPage() {
  const router = useRouter();
  const {
    selectedStudentId,
    selectedWeekIndex,
    almuerzos,
    deliveries,
    cart,
    config,
    selectWeek,
    setCartDay,
    removeCartDay,
  } = useDemo();

  const [modalDate, setModalDate] = useState<string | null>(null);
  const [showAusencia, setShowAusencia] = useState(false);
  const [tourSignal, setTourSignal] = useState(0);

  const student = estudiantes.find((item) => item.id === selectedStudentId);
  const week = semanasAgosto[selectedWeekIndex];

  const stateForDate = (date: string): DayState => {
    if (!student) return "pasado";
    const deliveredAt = deliveries[deliveryKey(student.id, date)];
    if (deliveredAt) return "entregado";
    const paid = almuerzos.find((item) => item.studentId === student.id && item.date === date && item.paymentStatus === "pagado");
    if (paid) return "pagado";
    if (cart[date]) return "carrito";
    if (date < DEMO_TODAY) return "pasado";
    if (date === DEMO_TODAY) {
      if (config.cutoffMode === "cerrado") return "cerrado";
      if (config.cutoffMode === "automatico" && !isBeforeCutoff(config.bookingCutoff)) return "cerrado";
    }
    return "disponible";
  };

  const cartDates = Object.keys(cart).sort();
  const preview = computePurchasePreview(cartDates, config);

  const nextAvailableDate = (fromDate: string) => {
    const index = todosLosDiasHabilesAgosto.indexOf(fromDate);
    for (let i = index + 1; i < todosLosDiasHabilesAgosto.length; i += 1) {
      const candidate = todosLosDiasHabilesAgosto[i];
      if (stateForDate(candidate) === "disponible") return candidate;
    }
    return null;
  };

  const openDay = (date: string) => {
    const state = stateForDate(date);
    if (state === "disponible" || state === "carrito") setModalDate(date);
  };

  const confirmDay = (date: string, platoId: string, postreId: string) => {
    setCartDay({ date, platoId, postreId });
    const next = nextAvailableDate(date);
    if (next) {
      const nextWeekIndex = semanasAgosto.findIndex((item) => item.days.some((d) => d.date === next));
      if (nextWeekIndex !== -1 && nextWeekIndex !== selectedWeekIndex) selectWeek(nextWeekIndex);
    }
    setModalDate(next);
  };

  const currentModalDay: MenuDia | undefined = useMemo(
    () => (modalDate ? week.days.find((d) => d.date === modalDate) ?? todosDiasFlat.find((d) => d.date === modalDate) : undefined),
    [modalDate, week],
  );

  if (!student) {
    return (
      <PortalShell step={2}>
        <FlowGuard />
      </PortalShell>
    );
  }

  return (
    <PortalShell step={2}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_21rem]">
        <section>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="eyebrow">{student.name} · {cursoLabel(student.colegioId, student.cursoId)}</span>
              <h1 className="display-font mt-1.5 text-[1.55rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.75rem]">Mi semana</h1>
              <p className="mt-2 max-w-lg text-[var(--muted)]">Elige plato y postre para cada día que quieras comprar. Puedes seleccionar los días que necesites y pagar todo junto.</p>
            </div>
            <button type="button" className="btn-quiet shrink-0 px-2.5 text-xs" onClick={() => setTourSignal((value) => value + 1)}>
              <HelpCircle size={14} /> ¿Cómo funciona?
            </button>
          </div>

          <div className="surface mt-5 rounded-2xl p-4" data-tour="week-strip">
            <WeekStrip
              days={week.days}
              weekLabel={week.shortLabel}
              onPrev={() => selectWeek(selectedWeekIndex - 1)}
              onNext={() => selectWeek(selectedWeekIndex + 1)}
              prevDisabled={selectedWeekIndex === 0}
              nextDisabled={selectedWeekIndex === semanasAgosto.length - 1}
              selectedDate={modalDate}
              onSelectDate={openDay}
              renderIndicator={(day) => <DayIndicator state={stateForDate(day.date)} />}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-bold text-[var(--muted)]">
            <Legend swatchClass="bg-[var(--paper)] border border-[var(--line)]" label="Disponible" />
            <Legend swatchClass="bg-[var(--coral-soft)] border border-[var(--coral)]" label="En el carrito" />
            <Legend swatchClass="bg-[var(--pine-soft)] border border-[var(--pine)]" label="Pagado" />
            <Legend swatchClass="bg-[var(--ink)]" label="Entregado" />
          </div>

          <div className="surface mt-6 rounded-2xl p-4 sm:p-5" data-tour="day-list">
            {week.days.map((day) => (
              <DayRow key={day.date} day={day} state={stateForDate(day.date)} cartSelection={cart[day.date]} onOpen={() => openDay(day.date)} />
            ))}
          </div>

          <button type="button" className="btn-secondary mt-4" onClick={() => setShowAusencia(true)}>
            <AlertTriangle size={16} /> Marcar ausencia
          </button>
        </section>

        <CartSidebar
          cartDates={cartDates}
          preview={preview}
          onRemove={removeCartDay}
          onPay={() => router.push("/pago")}
        />
      </div>

      {modalDate && currentModalDay && (
        <MenuDayModal
          day={currentModalDay}
          unitPrice={config.unitPrice}
          initialPlatoId={cart[modalDate]?.platoId}
          initialPostreId={cart[modalDate]?.postreId}
          onConfirm={(platoId, postreId) => confirmDay(modalDate, platoId, postreId)}
          onClose={() => setModalDate(null)}
        />
      )}

      {showAusencia && <AusenciaModal onClose={() => setShowAusencia(false)} />}
      <Tour steps={apoderadoTourSteps} storageKey="delicor-tour-apoderado-seen" reopenSignal={tourSignal} />
    </PortalShell>
  );
}

const todosDiasFlat = semanasAgosto.flatMap((s) => s.days);

function DayIndicator({ state }: { state: DayState }) {
  if (state === "entregado") return <span className="text-[color:var(--paper)]/85">Entregado</span>;
  if (state === "pagado") return <span className="text-[var(--pine-dark)]">Pagado</span>;
  if (state === "carrito") return <span className="text-[var(--coral-dark)]">En carrito</span>;
  if (state === "cerrado") return <span className="text-[var(--muted)]">Cerrado</span>;
  if (state === "pasado") return <span className="text-[var(--muted)]">—</span>;
  return null;
}

function Legend({ swatchClass, label }: { swatchClass: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2.5 rounded-full ${swatchClass}`} /> {label}
    </span>
  );
}

function DayRow({
  day,
  state,
  cartSelection,
  onOpen,
}: {
  day: MenuDia;
  state: DayState;
  cartSelection?: { platoId: string; postreId: string };
  onOpen: () => void;
}) {
  const plato = cartSelection ? day.platos.find((p) => p.id === cartSelection.platoId) : undefined;
  const postre = cartSelection ? day.postres.find((p) => p.id === cartSelection.postreId) : undefined;

  const statusBadge = () => {
    if (state === "entregado") return <span className="badge-neutral"><Truck size={12} /> Entregado</span>;
    if (state === "pagado") return <span className="badge-success"><Check size={12} /> Pagado</span>;
    if (state === "carrito") return <span className="badge-warning"><ShoppingCart size={12} /> En carrito</span>;
    if (state === "cerrado") return <span className="badge-neutral"><Clock3 size={12} /> Cerrado</span>;
    if (state === "pasado") return <span className="badge-neutral">Día pasado</span>;
    return null;
  };

  const clickable = state === "disponible" || state === "carrito";

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-3 last:border-0 last:pb-0 first:pt-0">
      <div className="min-w-0">
        <p className="mb-0.5 flex items-center gap-2 text-sm font-extrabold">
          {formatLongDate(day.date)}
          {plato?.vegetariano && <span className="chip-veg"><Leaf size={10} /> Veg</span>}
        </p>
        <p className="mb-0 truncate text-xs text-[var(--muted)]">
          {plato && postre ? `${plato.name} · ${postre.name}` : "Sin selección"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        {statusBadge()}
        {clickable && (
          <button type="button" className="btn-secondary min-h-9 px-3 text-xs" onClick={onOpen}>
            {cartSelection ? "Editar" : "Elegir"}
          </button>
        )}
      </div>
    </div>
  );
}

function CartSidebar({
  cartDates,
  preview,
  onRemove,
  onPay,
}: {
  cartDates: string[];
  preview: ReturnType<typeof computePurchasePreview>;
  onRemove: (date: string) => void;
  onPay: () => void;
}) {
  return (
    <aside className="rounded-2xl bg-[var(--ink)] p-5 text-[var(--paper)] shadow-[var(--shadow-lg)] lg:sticky lg:top-5" data-tour="cart-sidebar">
      <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[color:var(--paper)]/60">
        <ShoppingCart size={14} /> Carrito
        <span className="ml-auto">
          <InfoTip text={infoTips.fullMonthDiscount} label="Cómo funciona el descuento por mes completo" />
        </span>
      </p>
      {cartDates.length === 0 ? (
        <p className="mb-0 text-sm text-[color:var(--paper)]/70">Aún no has agregado almuerzos.</p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {cartDates.map((date) => (
            <div key={date} className="flex items-center justify-between gap-2 rounded-lg bg-[color:var(--paper)]/8 px-3 py-2 text-sm">
              <span className="font-bold">{formatLongDate(date)}</span>
              <button type="button" className="text-[color:var(--paper)]/60 hover:text-[var(--paper)]" onClick={() => onRemove(date)} aria-label={`Quitar ${date}`}>
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {preview.fullMonth && (
        <p className="mt-4 mb-0 flex items-center gap-2 rounded-lg bg-[var(--pine)] px-3 py-2.5 text-xs font-extrabold text-[var(--paper)]">
          <PartyPopper size={15} /> Mes completo seleccionado — 10% de descuento aplicado ✅
        </p>
      )}

      <div className="my-4 h-px bg-[color:var(--paper)]/15" />
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-[color:var(--paper)]/70">Subtotal</span>
        <span className="tabular-nums font-bold">{formatCLP(preview.subtotal)}</span>
      </div>
      {preview.discountAmount > 0 && (
        <div className="mt-1.5 flex items-center justify-between gap-3 text-sm">
          <span className="font-bold text-[var(--pine-soft)]">Descuento mes completo</span>
          <span className="tabular-nums font-bold text-[var(--pine-soft)]">−{formatCLP(preview.discountAmount)}</span>
        </div>
      )}
      <div className="mt-3 flex items-end justify-between gap-4">
        <span className="font-bold">Total</span>
        <strong className="display-font text-2xl font-bold tabular-nums">{formatCLP(preview.total)}</strong>
      </div>

      <button
        type="button"
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--coral)] px-4 font-extrabold text-[var(--paper)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={cartDates.length === 0}
        onClick={onPay}
      >
        Continuar al pago <ArrowRight size={17} />
      </button>
    </aside>
  );
}

function AusenciaModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[color:var(--ink)]/50 p-4" role="dialog" aria-modal="true" aria-labelledby="ausencia-title">
      <div className="page-enter w-full max-w-sm rounded-2xl bg-[var(--paper)] p-6 text-center shadow-[var(--shadow-lg)]">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-[var(--amber-soft)] text-[var(--amber-dark)]">
          <AlertTriangle size={19} />
        </span>
        <h2 id="ausencia-title" className="display-font mt-4 mb-1 text-lg font-bold">Marcar ausencia</h2>
        <p className="mb-0 text-sm text-[var(--muted)]">
          Esta acción llevará al flujo de ausencia e inasistencia, con sus reglas de horario y descuento definidas junto a Delicor. Esta demo solo muestra el punto de entrada.
        </p>
        <button type="button" className="btn-primary mt-5 w-full justify-center" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
}
