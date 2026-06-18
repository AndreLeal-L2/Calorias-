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
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 text-center text-sm text-zinc-500 sm:h-56">
        Regista uma refeicao para veres a tendencia.
      </div>
    );
  }

  return (
    <div className="h-60 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#252b27" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
          <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
          <Tooltip
            cursor={{ fill: "rgba(15, 118, 110, 0.08)" }}
            contentStyle={{
              borderRadius: 16,
              background: "#111411",
              color: "#f4f7f4",
              border: "1px solid #252b27",
              boxShadow: "0 14px 30px rgba(0, 0, 0, 0.35)"
            }}
          />
          <Bar dataKey="calories" name="Calorias" fill="#57d39b" radius={[6, 6, 0, 0]} />
          <Bar dataKey="target" name="Meta" fill="#3f4641" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
