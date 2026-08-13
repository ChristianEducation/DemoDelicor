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
    <div className="fixed inset-0 z-[70] grid h-[100svh] w-screen place-items-center bg-[var(--cream)] p-4" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="page-enter flex max-h-[90svh] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] bg-[var(--paper)] shadow-[var(--shadow-lg)] lg:max-w-2xl">
        <div className="min-h-0 overflow-y-auto p-7 text-center sm:p-9 lg:flex lg:items-start lg:gap-8 lg:p-10 lg:text-left">
          <span className="mx-auto grid size-14 shrink-0 place-items-center rounded-full bg-[var(--coral-soft)] text-[var(--coral)] lg:mx-0 lg:size-16">
            <Heart size={24} className="lg:size-7" fill="currentColor" aria-hidden="true" />
          </span>

          <div className="lg:min-w-0 lg:flex-1">
            <h2 id="intro-title" className="display-font mt-5 text-2xl font-extrabold leading-tight text-[var(--ink)] sm:text-3xl lg:mt-0">
              Así podría verse el casino de Delicor
            </h2>

            <div className="mt-6 grid gap-6 text-left lg:grid-cols-3 lg:gap-5">
              {points.map(({ icon: Icon, text }, index) => (
                <div key={index} className="flex items-start gap-4 lg:flex-col lg:gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--pine-soft)] text-[var(--pine-dark)]">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <p className="mb-0 text-sm leading-relaxed text-[var(--muted)] sm:text-base lg:text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[var(--line)] p-7 pt-5 sm:p-9 sm:pt-5 lg:flex lg:justify-end lg:p-10 lg:pt-6">
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
