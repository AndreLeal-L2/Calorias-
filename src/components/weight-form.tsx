"use client";

import { useActionState } from "react";
import { addWeightAction, type ActionState } from "@/app/actions";

export function WeightForm({ defaultDate }: { defaultDate: string }) {
  const [state, formAction, pending] = useActionState(addWeightAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <label>
          <span className="text-xs font-medium text-zinc-600">Peso</span>
          <input
            name="weightKg"
            type="number"
            step="0.1"
            min="30"
            max="300"
            required
            placeholder="100.0"
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-600">Data</span>
          <input
            name="measuredAt"
            type="date"
            required
            defaultValue={defaultDate}
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          />
        </label>
      </div>
      <textarea
        name="notes"
        rows={2}
        placeholder="Notas opcionais"
        className="focus-ring w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
      />
      <button
        type="submit"
        disabled={pending}
        className="focus-ring w-full rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-zinc-950 ring-1 ring-zinc-200 transition hover:bg-zinc-50 disabled:opacity-60"
      >
        {pending ? "A guardar..." : "Registar peso"}
      </button>
      <FormState state={state} />
    </form>
  );
}

function FormState({ state }: { state: ActionState }) {
  if (state.error) return <p className="text-sm text-red-700">{state.error}</p>;
  if (state.ok) return <p className="text-sm text-teal-700">Peso guardado.</p>;
  return null;
}
