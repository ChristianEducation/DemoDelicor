import { ArrowLeft, ArrowRight } from "lucide-react";
import { dayAbbrev } from "@/lib/format";
import type { MenuDia } from "@/types";

export function WeekStrip({
  days,
  weekLabel,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  selectedDate,
  onSelectDate,
  renderIndicator,
}: {
  days: MenuDia[];
  weekLabel: string;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  renderIndicator?: (day: MenuDia) => React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <button type="button" className="btn-quiet px-2.5" disabled={prevDisabled} onClick={onPrev} aria-label="Semana anterior">
          <ArrowLeft size={17} />
        </button>
        <strong className="text-sm">{weekLabel}</strong>
        <button type="button" className="btn-quiet px-2.5" disabled={nextDisabled} onClick={onNext} aria-label="Semana siguiente">
          <ArrowRight size={17} />
        </button>
      </div>
      <div className="mt-2.5 grid gap-2" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }} role="group" aria-label="Días de la semana">
        {days.map((day) => {
          const active = selectedDate === day.date;
          return (
            <button
              key={day.date}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectDate(day.date)}
              className={`flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2 text-center transition-colors duration-150 ${
                active
                  ? "border-[var(--coral)] bg-[var(--coral)] text-[var(--paper)]"
                  : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--line-accent)]"
              }`}
            >
              <span className={`text-[0.65rem] font-extrabold uppercase tracking-[0.08em] ${active ? "text-[color:var(--paper)]/75" : "text-[var(--muted)]"}`}>
                {dayAbbrev(day.dayName)}
              </span>
              <span className="text-base font-bold tabular-nums leading-none">{Number(day.date.slice(-2))}</span>
              <span className="min-h-[0.95rem] text-[0.62rem] font-bold leading-tight">{renderIndicator?.(day)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
