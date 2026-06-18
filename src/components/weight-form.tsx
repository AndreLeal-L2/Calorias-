"use client";

import { useActionState } from "react";
import { addWeightAction, type ActionState } from "@/app/actions";

export function WeightForm({ defaultDate }: { defaultDate: string }) {
  const [state, formAction, pending] = useActionState(addWeightAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <label>
          <span className="text-xs font-medium text-zinc-400">Peso</span>
          <input
            name="weightKg"
            type="number"
            step="0.1"
            min="30"
            max="300"
            required
            placeholder="100.0"
            className="focus-ring mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50 placeholder:text-zinc-600"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-400">Data</span>
          <input
            name="measuredAt"
            type="date"
            required
            defaultValue={defaultDate}
            className="focus-ring mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50"
          />
        </label>
      </div>
      <textarea
        name="notes"
        rows={2}
        placeholder="Notas opcionais"
        className="focus-ring w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50 placeholder:text-zinc-600"
      />
      <button
        type="submit"
        disabled={pending}
        className="focus-ring w-full rounded-xl bg-white/[0.06] px-4 py-3.5 text-sm font-semibold text-zinc-50 ring-1 ring-white/10 transition hover:bg-white/[0.1] disabled:opacity-60"
      >
        {pending ? "A guardar..." : "Registar peso"}
      </button>
      <FormState state={state} />
    </form>
  );
}

function FormState({ state }: { state: ActionState }) {
  if (state.error) return <p className="text-sm text-rose-300">{state.error}</p>;
  if (state.ok) return <p className="text-sm text-emerald-300">Peso guardado.</p>;
  return null;
}
