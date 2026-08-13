"use client";

import { useEffect, useState } from "react";
import { Building2, CircleDollarSign, Wallet } from "lucide-react";
import { useScrollLock } from "@/lib/use-scroll-lock";

const SESSION_KEY = "delicor-admin-intro-seen";

const points = [
  {
    icon: Building2,
    text: "Arriba puedes elegir Todos los colegios, San Isidro o La Cruz: todo el panel (ingresos, entregas, funcionarios) se filtra a esa selección.",
  },
  {
    icon: Wallet,
    text: "Resumen te da el panorama del mes y del día; Pagos te deja buscar la compra de cualquier alumno o apoderado en segundos.",
  },
  {
    icon: CircleDollarSign,
    text: "Cuando Cocina entrega un almuerzo sin pago registrado, la deuda aparece sola en Pendientes de cobro, agrupada por alumno, con un mensaje listo para comunicarla.",
  },
];

export function AdminIntroModal() {
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
    <div className="fixed inset-0 z-[70] grid h-[100svh] w-screen place-items-center bg-[var(--cream)] p-4" role="dialog" aria-modal="true" aria-labelledby="admin-intro-title">
      <div className="page-enter flex max-h-[90svh] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] bg-[var(--paper)] shadow-[var(--shadow-lg)] lg:max-w-xl">
        <div className="min-h-0 overflow-y-auto p-7 text-center sm:p-9 lg:p-11 lg:text-left">
          <span className="eyebrow">Administración</span>
          <h2 id="admin-intro-title" className="display-font mt-2 text-2xl font-extrabold leading-tight text-[var(--ink)] sm:text-3xl lg:text-[2.1rem]">
            El centro de control de Delicor
          </h2>

          <div className="mt-7 grid gap-5 text-left lg:mt-9 lg:gap-6">
            {points.map(({ icon: Icon, text }, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--coral-soft)] text-[var(--coral-dark)]">
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
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
