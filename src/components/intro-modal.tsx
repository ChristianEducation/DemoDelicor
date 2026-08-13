"use client";

import { useEffect, useState } from "react";
import { CalendarCheck2, Salad, Tag } from "lucide-react";
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
    <div className="fixed inset-0 z-[70] grid h-[100svh] w-screen place-items-center bg-[var(--cream)] p-4" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="page-enter flex max-h-[90svh] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] bg-[var(--paper)] shadow-[var(--shadow-lg)] lg:max-w-xl">
        <div className="min-h-0 overflow-y-auto p-7 text-center sm:p-9 lg:p-11 lg:text-left">
          <span className="eyebrow">Demo comercial</span>
          <h2 id="intro-title" className="display-font mt-2 text-2xl font-extrabold leading-tight text-[var(--ink)] sm:text-3xl lg:text-[2.1rem]">
            Así podría verse el casino de Delicor
          </h2>

          <div className="mt-7 grid gap-5 text-left lg:mt-9 lg:gap-6">
            {points.map(({ icon: Icon, text }, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--pine-soft)] text-[var(--pine-dark)]">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <p className="mb-0 pt-1.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 justify-center border-t border-[var(--line)] p-7 pt-5 sm:p-9 sm:pt-5 lg:justify-end lg:p-11 lg:pt-6">
          <button
            type="button"
            className="min-h-14 w-full rounded-2xl bg-[var(--ink)] px-4 font-extrabold text-[var(--paper)] transition-transform hover:-translate-y-0.5 lg:min-h-12 lg:w-auto lg:px-8"
            onClick={close}
          >
            Ver demo
          </button>
        </div>
      </div>
    </div>
  );
}
