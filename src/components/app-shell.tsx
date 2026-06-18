import type { ReactNode } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  ChartBarIcon,
  FireIcon
} from "@heroicons/react/24/outline";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-[#f7f4ee]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-900/20">
              <FireIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-950">Calorias</p>
              <p className="text-xs text-zinc-600">Perda de peso pessoal</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a
              href="#estatisticas"
              className="focus-ring hidden rounded-2xl border border-zinc-200 bg-white/75 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-white sm:inline-flex"
            >
              <ChartBarIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              Estatisticas
            </a>
            <a
              href="/logout"
              className="focus-ring inline-flex rounded-2xl border border-zinc-200 bg-white/75 p-2.5 text-zinc-800 shadow-sm transition hover:bg-white"
              aria-label="Sair"
            >
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
