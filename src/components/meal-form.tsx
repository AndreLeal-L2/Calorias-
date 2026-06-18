"use client";

import { useActionState } from "react";
import { addMealAction, type ActionState } from "@/app/actions";

const initialState: ActionState = {};

export function MealForm({ defaultDateTime }: { defaultDateTime: string }) {
  const [state, formAction, pending] = useActionState(addMealAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1.4fr_0.8fr]">
        <label>
          <span className="text-sm font-medium text-zinc-800">Refeicao</span>
          <input
            name="name"
            required
            placeholder="Ex: frango, arroz e salada"
            className="focus-ring mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-zinc-800">Calorias</span>
          <input
            name="calories"
            required
            type="number"
            inputMode="numeric"
            min="1"
            max="6000"
            placeholder="750"
            className="focus-ring mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
          />
        </label>
      </div>
      <label>
        <span className="text-sm font-medium text-zinc-800">Hora</span>
        <input
          name="eatenAt"
          required
          type="datetime-local"
          defaultValue={defaultDateTime}
          className="focus-ring mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
        />
      </label>
      <label>
        <span className="text-sm font-medium text-zinc-800">Notas</span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Opcional"
          className="focus-ring mt-2 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3"
        />
      </label>
      <SubmitButton pending={pending} idle="Adicionar refeicao" />
      <FormState state={state} />
    </form>
  );
}

function SubmitButton({ pending, idle }: { pending: boolean; idle: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="focus-ring w-full rounded-2xl bg-teal-700 px-4 py-3 font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "A guardar..." : idle}
    </button>
  );
}

function FormState({ state }: { state: ActionState }) {
  if (state.error) {
    return <p className="text-sm text-red-700">{state.error}</p>;
  }

  if (state.ok) {
    return <p className="text-sm text-teal-700">Registo guardado.</p>;
  }

  return null;
}
