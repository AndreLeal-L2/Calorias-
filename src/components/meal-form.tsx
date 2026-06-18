"use client";

import { useActionState } from "react";
import { addMealAction, type ActionState } from "@/app/actions";

const initialState: ActionState = {};

export function MealForm({ defaultDateTime }: { defaultDateTime: string }) {
  const [state, formAction, pending] = useActionState(addMealAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-[1fr_7.25rem] gap-2 sm:grid-cols-[1.4fr_0.8fr]">
        <label>
          <span className="text-xs font-medium text-zinc-600">Refeicao</span>
          <input
            name="name"
            required
            placeholder="O que comeste?"
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-600">Kcal</span>
          <input
            name="calories"
            required
            type="number"
            inputMode="numeric"
            min="1"
            max="6000"
            placeholder="750"
            className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
          />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
      <label>
        <span className="text-xs font-medium text-zinc-600">Hora</span>
        <input
          name="eatenAt"
          required
          type="datetime-local"
          defaultValue={defaultDateTime}
          className="focus-ring mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
        />
      </label>
      <label>
        <span className="text-xs font-medium text-zinc-600">Notas</span>
        <textarea
          name="notes"
          rows={1}
          placeholder="Opcional"
          className="focus-ring mt-1.5 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-[16px]"
        />
      </label>
      </div>
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
      className="focus-ring w-full rounded-xl bg-zinc-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
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
