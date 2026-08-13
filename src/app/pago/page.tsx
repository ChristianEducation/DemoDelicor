"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, CreditCard, Leaf, LoaderCircle, LockKeyhole, PartyPopper, ShieldCheck } from "lucide-react";
import { FlowGuard } from "@/components/flow-guard";
import { PortalShell } from "@/components/portal-shell";
import { cursoLabel, estudiantes } from "@/data/delicor-data";
import { menuAgosto } from "@/data/menu-agosto";
import { formatCLP, formatLongDate } from "@/lib/format";
import { computePurchasePreview } from "@/lib/pricing";
import { useDemo } from "@/store/demo-store";

export default function PaymentPage() {
  const router = useRouter();
  const { selectedStudentId, cart, config, confirmPurchase } = useDemo();
  const [processing, setProcessing] = useState(false);
  const student = estudiantes.find((item) => item.id === selectedStudentId);
  const cartDates = Object.keys(cart).sort();

  if (!student || cartDates.length === 0) {
    return (
      <PortalShell step={3}>
        <FlowGuard title="Tu carrito está vacío" description="Selecciona un estudiante y agrega al menos un almuerzo antes de pagar." href="/semana" cta="Volver a mi semana" />
      </PortalShell>
    );
  }

  const preview = computePurchasePreview(cartDates, config);

  const pay = () => {
    if (processing) return;
    setProcessing(true);
    window.setTimeout(() => {
      confirmPurchase();
      router.push("/confirmacion");
    }, 1100);
  };

  return (
    <PortalShell step={3}>
      <div className="mx-auto grid grid-cols-1 max-w-4xl items-start gap-6 lg:grid-cols-[1fr_21rem]">
        <section>
          <span className="eyebrow"><CreditCard size={14} /> Pago simulado</span>
          <h1 className="display-font mt-2 text-[1.55rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.75rem]">Revisa tu pedido</h1>
          <p className="mt-3 max-w-lg text-[var(--muted)]">Confirma que los datos estén correctos. Esta demostración no solicita información bancaria ni utiliza una pasarela real.</p>

          <div className="surface mt-6 overflow-hidden rounded-2xl">
            <div className="flex items-start gap-3 border-b border-[var(--line)] p-4 sm:p-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--coral-soft)] text-[var(--coral-dark)]"><CheckCircle2 size={19} /></span>
              <div>
                <p className="mb-0.5 text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--muted)]">Estudiante</p>
                <h2 className="mb-0.5 text-base font-extrabold">{student.name}</h2>
                <p className="mb-0 text-sm text-[var(--muted)]">{cursoLabel(student.colegioId, student.cursoId)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 p-4 sm:p-5">
              {cartDates.map((date) => {
                const selection = cart[date];
                const dia = menuAgosto.find((item) => item.date === date)!;
                const plato = dia.platos.find((item) => item.id === selection.platoId)!;
                const postre = dia.postres.find((item) => item.id === selection.postreId)!;
                return (
                  <div key={date} className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-3 text-sm last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="mb-0.5 flex items-center gap-1.5 font-bold">
                        {formatLongDate(date)}
                        {plato.vegetariano && <span className="chip-veg"><Leaf size={10} /> Veg</span>}
                      </p>
                      <p className="mb-0 truncate text-xs text-[var(--muted)]">{plato.name} · {postre.name}</p>
                    </div>
                    <span className="shrink-0 tabular-nums font-bold text-[var(--muted)]">{formatCLP(config.unitPrice)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <Link href="/semana" className="btn-quiet mt-3 -ml-3"><ArrowLeft size={16} /> Editar pedido</Link>
        </section>

        <aside className="rounded-2xl bg-[var(--ink)] p-5 text-[var(--paper)] shadow-[var(--shadow-lg)] lg:sticky lg:top-5">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[color:var(--paper)]/60">Resumen del pago</p>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-[color:var(--paper)]/70">{preview.dayCount} {preview.dayCount === 1 ? "almuerzo" : "almuerzos"}</span>
            <span className="tabular-nums font-bold">{formatCLP(preview.subtotal)}</span>
          </div>
          {preview.fullMonth && (
            <p className="mt-3 mb-0 flex items-center gap-2 rounded-lg bg-[var(--pine)] px-3 py-2.5 text-xs font-extrabold text-[var(--paper)]">
              <PartyPopper size={15} /> Mes completo — 10% de descuento aplicado
            </p>
          )}
          {preview.discountAmount > 0 && (
            <div className="mt-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-[var(--pine-soft)]">Descuento</span>
              <span className="tabular-nums font-bold text-[var(--pine-soft)]">−{formatCLP(preview.discountAmount)}</span>
            </div>
          )}
          <div className="my-4 h-px bg-[color:var(--paper)]/15" />
          <div className="flex items-end justify-between gap-4"><span className="font-bold">Total</span><strong className="display-font text-2xl font-bold tabular-nums">{formatCLP(preview.total)}</strong></div>

          <p className="mt-4 mb-0 flex items-center gap-2 rounded-lg bg-[var(--pine-soft)] px-3 py-2.5 text-xs font-extrabold text-[var(--pine-dark)]">
            <ShieldCheck size={16} className="shrink-0" /> Simulación segura — esta demo no realiza ningún cobro real
          </p>

          <button
            type="button"
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--paper)] px-4 font-extrabold text-[var(--ink)] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-85"
            disabled={processing}
            onClick={pay}
          >
            {processing ? <><LoaderCircle size={19} className="animate-spin" /> Confirmando pago...</> : <><LockKeyhole size={17} /> Pagar {formatCLP(preview.total)}</>}
          </button>
          <p className="mt-3 mb-0 flex items-center justify-center gap-2 text-center text-xs text-[color:var(--paper)]/60"><CreditCard size={13} /> Pago simulado, sin pasarela real</p>
        </aside>
      </div>
    </PortalShell>
  );
}
