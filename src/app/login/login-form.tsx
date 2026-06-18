"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Codigo secreto</span>
        <input
          name="code"
          type="password"
          required
          autoComplete="current-password"
          className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-zinc-50"
        />
      </label>
      {state.error ? (
        <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="focus-ring w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "A validar..." : "Entrar"}
      </button>
    </form>
  );
}
