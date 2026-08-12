"use client";

import { useEffect, useState } from "react";
import { Building2, CircleDollarSign, ShieldCheck, Wallet } from "lucide-react";
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
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[color:var(--ink)]/50 p-4" role="dialog" aria-modal="true" aria-labelledby="admin-intro-title">
      <div className="page-enter max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[1.75rem] bg-[var(--paper)] p-7 text-center shadow-[var(--shadow-lg)] sm:p-9">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--pine-soft)] px-4 py-2 text-sm font-bold text-[var(--pine-dark)]">
          <ShieldCheck size={16} aria-hidden="true" /> Administración
        </span>

        <h2 id="admin-intro-title" className="display-font mt-5 text-2xl font-extrabold leading-tight text-[var(--ink)] sm:text-3xl">
          El centro de control de Delicor
        </h2>

        <div className="grid gap-6 mt-6 text-left">
          {points.map(({ icon: Icon, text }, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--coral-soft)] text-[var(--coral-dark)]">
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
          Entendido
        </button>
      </div>
    </div>
  );
}
