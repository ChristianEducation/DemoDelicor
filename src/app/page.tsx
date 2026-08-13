import Link from "next/link";
import { ArrowRight, ChefHat, Heart, ShieldCheck, UsersRound } from "lucide-react";
import { Brand, DemoBadge } from "@/components/brand";
import { IntroModal } from "@/components/intro-modal";

const access = [
  {
    id: "apoderados",
    label: "APODERADOS",
    title: "Reservar almuerzo",
    icon: UsersRound,
    href: "/apoderado",
  },
  {
    id: "casino",
    label: "COCINA",
    title: "Gestión diaria",
    icon: ChefHat,
    href: "/casino",
  },
  {
    id: "admin",
    label: "ADMINISTRACIÓN",
    title: "Panel de control",
    icon: ShieldCheck,
    href: "/admin",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[var(--cream)] lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Panel de marca — solo escritorio */}
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:bg-[var(--ink)] lg:px-16 lg:py-16 xl:px-24">
        <span className="grid size-14 place-items-center rounded-2xl bg-[var(--coral)] text-[var(--paper)]">
          <Heart size={26} fill="currentColor" aria-hidden="true" />
        </span>
        <h1 className="display-font mt-8 max-w-md text-[2.75rem] font-bold leading-[1.08] text-[var(--paper)]">
          Una forma más simple de gestionar los almuerzos de Delicor
        </h1>
        <p className="mt-5 max-w-sm text-lg leading-relaxed text-[color:var(--paper)]/65">
          Compra, preparación, entrega y control conectados en una sola plataforma, para Colegio San Isidro y Colegio La Cruz.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-sm font-bold text-[color:var(--paper)]/45">
          <span>Compra</span><span aria-hidden="true">·</span>
          <span>Preparación</span><span aria-hidden="true">·</span>
          <span>Entrega</span><span aria-hidden="true">·</span>
          <span>Control</span>
        </div>
      </div>

      <main id="contenido-principal" className="grid min-h-dvh place-items-center px-4 py-10 sm:px-6 lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          <header className="flex items-center justify-between gap-4">
            <Brand />
            <DemoBadge />
          </header>

          <h1 className="display-font mt-9 text-[1.85rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.05rem] lg:hidden">
            Una forma más simple de gestionar los almuerzos de Delicor
          </h1>
          <p className="mt-3 text-[var(--muted)] lg:mt-9">Elige por dónde quieres entrar para recorrer la demo.</p>

          <nav className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]" aria-label="Acceso a la plataforma">
            {access.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group grid grid-cols-[2.5rem_1fr_1.25rem] items-center gap-4 py-5 text-[var(--ink)] no-underline transition-colors hover:text-[var(--coral)]"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-[var(--coral-soft)] text-[var(--coral)] transition-transform duration-200 group-hover:-rotate-3">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span>
                    <small className="mb-0.5 block text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[var(--pine)]">
                      {item.label}
                    </small>
                    <strong className="block text-base font-extrabold">{item.title}</strong>
                  </span>
                  <ArrowRight size={18} className="text-[var(--muted)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--coral)]" aria-hidden="true" />
                </Link>
              );
            })}
          </nav>

          <p className="mt-7 text-center text-xs font-semibold text-[var(--muted)] lg:hidden">
            Compra · Preparación · Entrega · Control
          </p>
        </div>
      </main>
      <IntroModal />
    </div>
  );
}
