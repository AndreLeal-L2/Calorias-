import type { MealDayGroup } from "@/lib/metrics";

export function HistoryList({ groups }: { groups: MealDayGroup[] }) {
  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500">
        Ainda nao tens refeicoes registadas.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.slice(0, 7).map((group) => (
        <section
          key={group.date}
          className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold text-zinc-950">{formatDate(group.date)}</h3>
            <p className="text-sm font-semibold text-zinc-950">
              {group.totalCalories} kcal
            </p>
          </div>
          <div className="mt-3 divide-y divide-zinc-200/70">
            {group.meals.map((meal) => (
              <div key={meal.id} className="flex justify-between gap-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{meal.name}</p>
                  <p className="text-xs text-zinc-500">{formatTime(meal.eatenAt)}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-zinc-950">
                  {meal.calories} kcal
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "short"
  }).format(new Date(`${date}T12:00:00.000Z`));
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
