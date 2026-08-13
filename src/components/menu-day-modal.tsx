"use client";

import { useEffect, useState } from "react";
import { Check, Leaf, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 grid h-[100svh] w-screen place-items-end bg-[color:var(--ink)]/50 p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="menu-day-title">
      <div className="page-enter flex max-h-[90svh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-[var(--paper)] shadow-[var(--shadow-lg)] sm:rounded-2xl">
        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="eyebrow">{formatLongDate(day.date)}</span>
              <h2 id="menu-day-title" className="display-font mt-1 mb-0 text-lg font-bold">Elige plato y postre</h2>
            </div>
            <button type="button" className="btn-quiet px-2" onClick={onClose} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>

          <p className="mt-2.5 mb-0 text-xs leading-relaxed text-[var(--muted)]">
            <strong className="font-bold text-[var(--ink)]">Sopa:</strong> {day.sopa} · <strong className="font-bold text-[var(--ink)]">Ensaladas:</strong> {day.ensaladas.join(", ")}
          </p>

          <fieldset className="mt-4 border-0 p-0">
            <legend className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Platos de fondo</legend>
            <div className="grid grid-cols-1 gap-1.5">
              {day.platos.map((plato) => {
                const active = platoId === plato.id;
                return (
                  <label
                    key={plato.id}
                    className={`flex cursor-pointer items-center justify-between gap-2.5 rounded-lg border px-3 py-2 text-sm font-semibold leading-tight transition-colors ${
                      active ? "border-[var(--coral)] bg-[var(--coral-soft)]" : "border-[var(--line)] bg-[var(--paper)] hover:border-[var(--line-accent)]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input type="radio" name="plato" className="sr-only" checked={active} onChange={() => setPlatoId(plato.id)} />
                      <span className={`grid size-4.5 shrink-0 place-items-center rounded-full border ${active ? "border-[var(--coral)] bg-[var(--coral)] text-[var(--paper)]" : "border-[var(--line-accent)]"}`}>
                        {active && <Check size={11} strokeWidth={3} />}
                      </span>
                      {plato.name}
                    </span>
                    {plato.vegetariano && (
                      <span className="chip-veg shrink-0">
                        <Leaf size={10} /> Veg
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-4 border-0 p-0">
            <legend className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Postres</legend>
            <div className="grid grid-cols-2 gap-1.5">
              {day.postres.map((postre) => {
                const active = postreId === postre.id;
                return (
                  <label
                    key={postre.id}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-2 text-sm font-semibold leading-tight transition-colors ${
                      active ? "border-[var(--coral)] bg-[var(--coral-soft)]" : "border-[var(--line)] bg-[var(--paper)] hover:border-[var(--line-accent)]"
                    }`}
                  >
                    <input type="radio" name="postre" className="sr-only" checked={active} onChange={() => setPostreId(postre.id)} />
                    <span className={`grid size-4.5 shrink-0 place-items-center rounded-full border ${active ? "border-[var(--coral)] bg-[var(--coral)] text-[var(--paper)]" : "border-[var(--line-accent)]"}`}>
                      {active && <Check size={11} strokeWidth={3} />}
                    </span>
                    {postre.name}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5">
          <span className="text-xs font-bold text-[var(--muted)] sm:text-sm">{formatCLP(unitPrice)}</span>
          <button type="button" className="btn-primary" disabled={!platoId || !postreId} onClick={() => onConfirm(platoId, postreId)}>
            {continueLabel} →
          </button>
        </div>
      </div>
    </div>
  );
}
