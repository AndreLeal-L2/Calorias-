import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-teal-950/10 backdrop-blur">
        <p className="text-sm font-semibold uppercase text-teal-700">
          Acesso pessoal
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
          Entra no teu painel
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Usa o codigo secreto configurado na Vercel. Nada fica exposto no
          frontend.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
