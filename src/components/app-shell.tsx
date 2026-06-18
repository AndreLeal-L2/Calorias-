import type { ReactNode } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  ChartBarIcon,
  FireIcon,
  HomeIcon,
  PlusCircleIcon,
  TrophyIcon
} from "@heroicons/react/24/outline";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen pb-24 text-zinc-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070807]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#hoje" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-zinc-950">
              <FireIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-4 text-zinc-50">Calorias</p>
              <p className="text-xs text-zinc-500">Hoje</p>
            </div>
          </a>
          <nav className="flex items-center gap-2">
            <a
              href="#refeicao"
              className="focus-ring hidden rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 sm:inline-flex"
            >
              Registar
            </a>
            <a
              href="#estatisticas"
              className="focus-ring hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07] sm:inline-flex"
            >
              <ChartBarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Estatisticas
            </a>
            <a
              href="/logout"
              className="focus-ring inline-flex rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07]"
              aria-label="Sair"
            >
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>
      {children}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0d0c]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          <MobileNavItem href="#hoje" label="Hoje" icon={<HomeIcon />} />
          <MobileNavItem href="#refeicao" label="Registar" icon={<PlusCircleIcon />} />
          <MobileNavItem href="#treino" label="Treino" icon={<TrophyIcon />} />
          <MobileNavItem href="#estatisticas" label="Stats" icon={<ChartBarIcon />} />
        </div>
      </nav>
    </main>
  );
}

function MobileNavItem({
  href,
  label,
  icon
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      className="focus-ring flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-zinc-400"
    >
      <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      {label}
    </a>
  );
}
