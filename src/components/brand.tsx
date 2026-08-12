import Link from "next/link";
import { Heart } from "lucide-react";

/**
 * Placeholder de marca: ícono de corazón + wordmark, inspirado en el isotipo visto
 * en Menu-agosto.pdf. Reemplazar por el logo real de Delicor cuando esté disponible
 * (ver <Logo/> abajo, pensado para aceptar una imagen sin tocar el resto del layout).
 */
export function Brand({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5 no-underline" aria-label="Delicor, inicio">
      <span className="grid size-9 shrink-0 place-items-center rounded-[0.75rem] bg-[var(--coral)] text-[var(--paper)] shadow-sm transition-transform duration-200 group-hover:-rotate-3">
        <Heart size={18} strokeWidth={2.4} fill="currentColor" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span className="display-font block text-[1.1rem] font-bold tracking-[-0.02em] text-[var(--ink)]">delicor</span>
        {!compact && (
          <span className="mt-0.5 block text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-[var(--pine)]">
            Almuerzos escolares
          </span>
        )}
      </span>
    </Link>
  );
}

export function DemoBadge() {
  return <span className="demo-badge">Demo comercial</span>;
}
