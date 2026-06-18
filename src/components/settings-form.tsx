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
          <span className="text-xs font-medium text-zinc-400">Kcal/dia</span>
          <input
            name="dailyCalorieTarget"
            type="number"
            min="1000"
            max="5000"
            required
            defaultValue={settings.dailyCalorieTarget}
            className="focus-ring mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-400">Ginasio/semana</span>
          <input
            name="weeklyGymTarget"
            type="number"
            min="0"
            max="7"
            required
            defaultValue={settings.weeklyGymTarget}
            className="focus-ring mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-400">Cardio/dia</span>
          <input
            name="dailyCardioTargetMinutes"
            type="number"
            min="0"
            max="240"
            required
            defaultValue={settings.dailyCardioTargetMinutes}
            className="focus-ring mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="focus-ring w-full rounded-xl bg-emerald-400 px-4 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:opacity-60"
      >
        {pending ? "A guardar..." : "Atualizar metas"}
      </button>
      <FormState state={state} />
    </form>
  );
}

function FormState({ state }: { state: ActionState }) {
  if (state.error) return <p className="text-sm text-rose-300">{state.error}</p>;
  if (state.ok) return <p className="text-sm text-emerald-300">Metas atualizadas.</p>;
  return null;
}
