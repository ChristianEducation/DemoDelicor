"use client";

import { useEffect, useState } from "react";
import { CalendarCheck2, Heart, Salad, Tag } from "lucide-react";
import { useScrollLock } from "@/lib/use-scroll-lock";

const SESSION_KEY = "delicor-intro-seen";

const points = [
  {
    icon: CalendarCheck2,
    text: "Esta es una demo de Delicor, creada para mostrar cómo podría digitalizarse la compra y entrega de almuerzos en Colegio San Isidro y Colegio La Cruz.",
  },
  {
    icon: Tag,
    text: "Los datos, precios y la minuta de agosto son referenciales — se usan solo para visualizar la propuesta de forma realista.",
  },
  {
    icon: Salad,
    text: "Eliges plato y postre para cada día que quieras comprar. Puedes pagar cualquier combinación de días juntos; si compras el mes completo por adelantado, se aplica un descuento demostrativo.",
  },
];

export function IntroModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem(SESSION_KEY)) setOpen(true);
    } catch {
      // sessionStorage no disponible; no bloquear la demo.
    }
  }, []);

  const close = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  useScrollLock(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[color:var(--ink)]/50 p-4" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="page-enter max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[1.75rem] bg-[var(--paper)] p-7 text-center shadow-[var(--shadow-lg)] sm:p-9">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--coral-soft)] px-4 py-2 text-sm font-bold text-[var(--coral-dark)]">
          <Heart size={16} fill="currentColor" aria-hidden="true" /> Demo comercial
        </span>

        <h2 id="intro-title" className="display-font mt-5 text-2xl font-extrabold leading-tight text-[var(--ink)] sm:text-3xl">
          Así podría verse el casino de Delicor
        </h2>

        <div className="my-6 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-10 bg-[var(--line)]" />
          <Heart size={14} className="text-[var(--coral)]" fill="currentColor" />
          <span className="h-px w-10 bg-[var(--line)]" />
        </div>

        <div className="grid gap-6 text-left">
          {points.map(({ icon: Icon, text }, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--pine-soft)] text-[var(--pine-dark)]">
                <Icon size={19} aria-hidden="true" />
              </span>
              <p className="mb-0 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{text}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-8 min-h-14 w-full rounded-2xl bg-[var(--ink)] px-4 font-extrabold text-[var(--paper)] transition-transform hover:-translate-y-0.5"
          onClick={close}
        >
          Ver demo
        </button>
      </div>
    </div>
  );
}
