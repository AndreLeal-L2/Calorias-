"use client";

import { useActionState } from "react";
import { updateSettingsAction, type ActionState } from "@/app/actions";
import type { SettingsRecord } from "@/lib/db";

export function SettingsForm({ settings }: { settings: SettingsRecord }) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label>
          <span className="text-sm font-medium text-zinc-800">Kcal/dia</span>
          <input
            name="dailyCalorieTarget"
            type="number"
            min="1000"
            max="5000"
            required
            defaultValue={settings.dailyCalorieTarget}
            className="focus-ring mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-zinc-800">Ginasio/semana</span>
          <input
            name="weeklyGymTarget"
            type="number"
            min="0"
            max="7"
            required
            defaultValue={settings.weeklyGymTarget}
            className="focus-ring mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-zinc-800">Cardio/dia</span>
          <input
            name="dailyCardioTargetMinutes"
            type="number"
            min="0"
            max="240"
            required
            defaultValue={settings.dailyCardioTargetMinutes}
            className="focus-ring mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="focus-ring w-full rounded-2xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
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
