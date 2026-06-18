import { BoltIcon, FireIcon } from "@heroicons/react/24/outline";
import type { TrainingSummary as TrainingSummaryType } from "@/lib/metrics";

export function TrainingSummary({
  summary
}: {
  summary: TrainingSummaryType;
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <ProgressCard
        icon={<FireIcon className="h-5 w-5" aria-hidden="true" />}
        label="Ginasio esta semana"
        value={`${summary.gymCompleted}/${summary.gymTarget}`}
        percent={summary.gymPercent}
      />
      <ProgressCard
        icon={<BoltIcon className="h-5 w-5" aria-hidden="true" />}
        label="Cardio esta semana"
        value={`${summary.cardioMinutes}/${summary.cardioTarget} min`}
        percent={summary.cardioPercent}
      />
    </section>
  );
}

function ProgressCard({
  icon,
  label,
  value,
  percent
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  percent: number;
}) {
  return (
    <article className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-zinc-950/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          {icon}
          {label}
        </div>
        <span className="text-sm font-semibold text-zinc-950">{value}</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-teal-700"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </article>
  );
}
