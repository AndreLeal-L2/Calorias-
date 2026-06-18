"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Codigo secreto</span>
        <input
          name="code"
          type="password"
          required
          autoComplete="current-password"
          className="focus-ring mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-950 shadow-sm"
        />
      </label>
      {state.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="focus-ring w-full rounded-2xl bg-teal-700 px-4 py-3 font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "A validar..." : "Entrar"}
      </button>
    </form>
  );
}
