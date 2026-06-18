"use client";

import { useActionState } from "react";
import { updateSettingsAction, type ActionState } from "@/app/actions";
import type { SettingsRecord } from "@/lib/db";

export function SettingsForm({ settings }: { settings: SettingsRecord }) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <label>
          <span className="text-xs font-medium text-zinc-600">Kcal/dia</span>
          <input
            name="dailyCalorieTarget"
            type="number"
            min="1000"
            max="5000"
            required
            defaultValue={settings.dailyCalorieTarget}
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-600">Ginasio/semana</span>
          <input
            name="weeklyGymTarget"
            type="number"
            min="0"
            max="7"
            required
            defaultValue={settings.weeklyGymTarget}
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-600">Cardio/dia</span>
          <input
            name="dailyCardioTargetMinutes"
            type="number"
            min="0"
            max="240"
            required
            defaultValue={settings.dailyCardioTargetMinutes}
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="focus-ring w-full rounded-xl bg-zinc-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
      >
        {pending ? "A guardar..." : "Atualizar metas"}
      </button>
      <FormState state={state} />
    </form>
  );
}

function FormState({ state }: { state: ActionState }) {
  if (state.error) return <p className="text-sm text-red-700">{state.error}</p>;
  if (state.ok) return <p className="text-sm text-teal-700">Metas atualizadas.</p>;
  return null;
}
