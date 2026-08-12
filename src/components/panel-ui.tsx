import type { LucideIcon } from "lucide-react";

export function PanelHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display-font mt-1.5 text-[1.55rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.75rem]">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  detail?: string;
  tone?: "neutral" | "success" | "warning" | "coral";
}) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-[oklch(94%_0.012_80)] text-[var(--ink)]",
    success: "bg-[var(--pine-soft)] text-[var(--pine-dark)]",
    warning: "bg-[var(--amber-soft)] text-[var(--amber-dark)]",
    coral: "bg-[var(--coral-soft)] text-[var(--coral-dark)]",
  };
  return (
    <article className="min-w-0 px-3 py-3 sm:px-4">
      <span className={`mb-2 inline-grid size-8 shrink-0 place-items-center rounded-lg ${toneClasses[tone]}`}>
        <Icon size={16} />
      </span>
      <p className="mb-0.5 truncate text-[0.62rem] font-extrabold uppercase tracking-[0.07em] text-[var(--muted)]">{label}</p>
      <strong className="display-font block text-xl font-bold leading-none tabular-nums sm:text-2xl">{value}</strong>
      {detail && <p className="mb-0 mt-1 text-xs font-semibold text-[var(--muted)]">{detail}</p>}
    </article>
  );
}

export function MetricRow({ children }: { children: React.ReactNode }) {
  return (
    <section className="surface grid grid-cols-2 divide-x divide-y divide-[var(--line)] overflow-hidden rounded-xl sm:grid-cols-4 sm:divide-y-0" aria-label="Métricas">
      {children}
    </section>
  );
}
