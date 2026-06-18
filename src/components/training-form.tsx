"use client";

import { useActionState } from "react";
import { addTrainingAction, type ActionState } from "@/app/actions";

export function TrainingForm({ defaultDateTime }: { defaultDateTime: string }) {
  const [state, formAction, pending] = useActionState(addTrainingAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <label>
          <span className="text-xs font-medium text-zinc-600">Tipo</span>
          <select
            name="type"
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          >
            <option value="gym">Ginasio</option>
            <option value="bike">Bicicleta</option>
            <option value="treadmill">Esteira</option>
          </select>
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-600">Minutos</span>
          <input
            name="durationMinutes"
            type="number"
            min="1"
            max="600"
            required
            placeholder="45"
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label>
          <span className="text-xs font-medium text-zinc-600">Data</span>
          <input
            name="performedAt"
            type="datetime-local"
            required
            defaultValue={defaultDateTime}
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-600">Intensidade</span>
          <input
            name="intensity"
            placeholder="leve, moderado, forte"
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
        className="focus-ring w-full rounded-xl bg-zinc-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
      >
        {pending ? "A guardar..." : "Adicionar treino"}
      </button>
      <FormState state={state} />
    </form>
  );
}

function FormState({ state }: { state: ActionState }) {
  if (state.error) return <p className="text-sm text-red-700">{state.error}</p>;
  if (state.ok) return <p className="text-sm text-teal-700">Treino guardado.</p>;
  return null;
}
