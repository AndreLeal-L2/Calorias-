import {
  BoltIcon,
  CalendarDaysIcon,
  FireIcon,
  ScaleIcon
} from "@heroicons/react/24/outline";
import type { DailySummary } from "@/lib/metrics";

export function DashboardCards({
  summary,
  sevenDayAverage,
  latestWeight
}: {
  summary: DailySummary;
  sevenDayAverage: number;
  latestWeight?: number;
}) {
  const cards = [
    {
      label: "Consumidas",
      value: `${summary.consumed}`,
      suffix: "kcal",
      icon: FireIcon
    },
    {
      label: "Restantes",
      value: `${summary.remaining}`,
      suffix: "kcal",
      icon: BoltIcon
    },
    {
      label: "Media 7 dias",
      value: `${sevenDayAverage}`,
      suffix: "kcal",
      icon: CalendarDaysIcon
    },
    {
      label: "Peso",
      value: latestWeight ? latestWeight.toFixed(1) : "--",
      suffix: latestWeight ? "kg" : "",
      icon: ScaleIcon
    }
  ];

  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-white/10 bg-[#101311] p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-zinc-500">{card.label}</p>
            <div className="rounded-full bg-white/[0.06] p-1.5 text-zinc-400">
              <card.icon className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-3 flex items-end gap-1 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            {card.value}
            <span className="pb-0.5 text-xs font-medium text-zinc-500">
              {card.suffix}
            </span>
          </p>
        </article>
      ))}
    </section>
  );
}
