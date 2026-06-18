import { BoltIcon, FireIcon } from "@heroicons/react/24/outline";
import type { TrainingSummary as TrainingSummaryType } from "@/lib/metrics";

export function TrainingSummary({
  summary
}: {
  summary: TrainingSummaryType;
}) {
  return (
    <section className="grid gap-2 sm:grid-cols-2">
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
    <article className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          {icon}
          {label}
        </div>
        <span className="text-sm font-semibold text-zinc-950">{value}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-zinc-950"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </article>
  );
}
