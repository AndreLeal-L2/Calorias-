"use client";

import type { MealDayGroup } from "@/lib/metrics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function StatsChart({
  groups,
  target
}: {
  groups: MealDayGroup[];
  target: number;
}) {
  const data = [...groups]
    .slice(0, 14)
    .reverse()
    .map((group) => ({
      date: group.date.slice(5),
      calories: group.totalCalories,
      target
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 text-center text-sm text-zinc-500 sm:h-56">
        Regista uma refeicao para veres a tendencia.
      </div>
    );
  }

  return (
    <div className="h-60 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e5df" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            cursor={{ fill: "rgba(15, 118, 110, 0.08)" }}
            contentStyle={{
              borderRadius: 16,
              border: "1px solid #e2e5df",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.10)"
            }}
          />
          <Bar dataKey="calories" name="Calorias" fill="#18181b" radius={[6, 6, 0, 0]} />
          <Bar dataKey="target" name="Meta" fill="#9ca3af" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
