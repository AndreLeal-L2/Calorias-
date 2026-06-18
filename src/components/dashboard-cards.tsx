import {
  BoltIcon,
  CalendarDaysIcon,
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
      label: "Consumidas hoje",
      value: `${summary.consumed}`,
      suffix: "kcal",
      icon: BoltIcon,
      tone: "bg-teal-700 text-white"
    },
    {
      label: "Restantes",
      value: `${summary.remaining}`,
      suffix: "kcal",
      icon: CalendarDaysIcon,
      tone: "bg-zinc-950 text-white"
    },
    {
      label: "Media 7 dias",
      value: `${sevenDayAverage}`,
      suffix: "kcal",
      icon: CalendarDaysIcon,
      tone: "bg-amber-400 text-zinc-950"
    },
    {
      label: "Ultimo peso",
      value: latestWeight ? latestWeight.toFixed(1) : "--",
      suffix: latestWeight ? "kg" : "",
      icon: ScaleIcon,
      tone: "bg-white text-zinc-950"
    }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className={`${card.tone} rounded-[1.5rem] border border-white/70 p-5 shadow-xl shadow-zinc-950/5`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm opacity-75">{card.label}</p>
              <p className="mt-3 flex items-end gap-2 text-4xl font-semibold">
                {card.value}
                <span className="pb-1 text-sm font-medium opacity-70">
                  {card.suffix}
                </span>
              </p>
            </div>
            <card.icon className="h-6 w-6 opacity-75" aria-hidden="true" />
          </div>
        </article>
      ))}
    </section>
  );
}
