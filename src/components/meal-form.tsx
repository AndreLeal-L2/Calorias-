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
          <span className="text-xs font-medium text-zinc-400">Refeicao</span>
          <input
            name="name"
            required
            placeholder="O que comeste?"
            className="focus-ring mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50 placeholder:text-zinc-600"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-zinc-400">Kcal</span>
          <input
            name="calories"
            required
            type="number"
            inputMode="numeric"
            min="1"
            max="6000"
            placeholder="750"
            className="focus-ring mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50 placeholder:text-zinc-600"
          />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
      <label>
        <span className="text-xs font-medium text-zinc-400">Hora</span>
        <input
          name="eatenAt"
          required
          type="datetime-local"
          defaultValue={defaultDateTime}
          className="focus-ring mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50"
        />
      </label>
      <label>
        <span className="text-xs font-medium text-zinc-400">Notas</span>
        <textarea
          name="notes"
          rows={1}
          placeholder="Opcional"
          className="focus-ring mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] text-zinc-50 placeholder:text-zinc-600"
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
      className="focus-ring w-full rounded-xl bg-emerald-400 px-4 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "A guardar..." : idle}
    </button>
  );
}

function FormState({ state }: { state: ActionState }) {
  if (state.error) {
    return <p className="text-sm text-rose-300">{state.error}</p>;
  }

  if (state.ok) {
    return <p className="text-sm text-emerald-300">Registo guardado.</p>;
  }

  return null;
}
