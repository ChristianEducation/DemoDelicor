"use client";

import { useEffect, useState } from "react";
import { Check, Leaf, Salad, Soup, X } from "lucide-react";
import { formatCLP, formatLongDate } from "@/lib/format";
import { useScrollLock } from "@/lib/use-scroll-lock";
import type { MenuDia } from "@/types";

export function MenuDayModal({
  day,
  unitPrice,
  initialPlatoId,
  initialPostreId,
  onConfirm,
  onClose,
  continueLabel = "Agregar al carrito y continuar",
}: {
  day: MenuDia;
  unitPrice: number;
  initialPlatoId?: string;
  initialPostreId?: string;
  onConfirm: (platoId: string, postreId: string) => void;
  onClose: () => void;
  continueLabel?: string;
}) {
  const [platoId, setPlatoId] = useState(initialPlatoId ?? "");
  const [postreId, setPostreId] = useState(initialPostreId ?? "");

  useScrollLock();

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-[color:var(--ink)]/50 p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="menu-day-title">
      <div className="page-enter max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-[var(--paper)] p-5 shadow-[var(--shadow-lg)] sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="eyebrow">{formatLongDate(day.date)}</span>
            <h2 id="menu-day-title" className="display-font mt-1 mb-0 text-xl font-bold">Elige plato y postre</h2>
          </div>
          <button type="button" className="btn-quiet px-2" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 rounded-xl bg-[oklch(96%_0.01_80)] p-3 text-sm sm:grid-cols-2">
          <p className="mb-0 flex items-start gap-2"><Soup size={15} className="mt-0.5 shrink-0 text-[var(--muted)]" /> <span><strong className="font-bold">Sopa:</strong> {day.sopa}</span></p>
          <p className="mb-0 flex items-start gap-2"><Salad size={15} className="mt-0.5 shrink-0 text-[var(--muted)]" /> <span><strong className="font-bold">Ensaladas:</strong> {day.ensaladas.join(", ")}</span></p>
        </div>

        <fieldset className="mt-5 border-0 p-0">
          <legend className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Platos de fondo</legend>
          <div className="grid grid-cols-1 gap-2">
            {day.platos.map((plato) => {
              const active = platoId === plato.id;
              return (
                <label
                  key={plato.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-sm font-semibold transition-colors ${
                    active ? "border-[var(--coral)] bg-[var(--coral-soft)]" : "border-[var(--line)] bg-[var(--paper)] hover:border-[var(--line-accent)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input type="radio" name="plato" className="sr-only" checked={active} onChange={() => setPlatoId(plato.id)} />
                    <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${active ? "border-[var(--coral)] bg-[var(--coral)] text-[var(--paper)]" : "border-[var(--line-accent)]"}`}>
                      {active && <Check size={12} strokeWidth={3} />}
                    </span>
                    {plato.name}
                  </span>
                  {plato.vegetariano && (
                    <span className="chip-veg shrink-0">
                      <Leaf size={11} /> Vegetariano
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-5 border-0 p-0">
          <legend className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Postres</legend>
          <div className="grid grid-cols-2 gap-2">
            {day.postres.map((postre) => {
              const active = postreId === postre.id;
              return (
                <label
                  key={postre.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active ? "border-[var(--coral)] bg-[var(--coral-soft)]" : "border-[var(--line)] bg-[var(--paper)] hover:border-[var(--line-accent)]"
                  }`}
                >
                  <input type="radio" name="postre" className="sr-only" checked={active} onChange={() => setPostreId(postre.id)} />
                  <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${active ? "border-[var(--coral)] bg-[var(--coral)] text-[var(--paper)]" : "border-[var(--line-accent)]"}`}>
                    {active && <Check size={12} strokeWidth={3} />}
                  </span>
                  {postre.name}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-bold text-[var(--muted)]">{formatCLP(unitPrice)} por almuerzo</span>
          <button type="button" className="btn-primary" disabled={!platoId || !postreId} onClick={() => onConfirm(platoId, postreId)}>
            {continueLabel} →
          </button>
        </div>
      </div>
    </div>
  );
}
