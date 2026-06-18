import { AppShell } from "@/components/app-shell";
import { DashboardCards } from "@/components/dashboard-cards";
import { HistoryList } from "@/components/history-list";
import { MealForm } from "@/components/meal-form";
import { Reveal } from "@/components/reveal";
import { SettingsForm } from "@/components/settings-form";
import { StatsChart } from "@/components/stats-chart";
import { TrainingForm } from "@/components/training-form";
import { TrainingSummary } from "@/components/training-summary";
import { WeightForm } from "@/components/weight-form";
import { requireAuth } from "@/lib/auth";
import { getDashboardData } from "@/lib/db";
import {
  buildDailySummary,
  calculateSevenDayAverage,
  calculateTrainingSummary,
  groupMealsByDay,
  toDateKey
} from "@/lib/metrics";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await requireAuth();

  const data = await getDashboardData();
  const now = new Date();
  const today = toDateKey(now);
  const defaultDateTime = toLocalDateTimeInput(now);
  const groups = groupMealsByDay(data.meals);
  const dailySummary = buildDailySummary(
    data.meals,
    today,
    data.settings.dailyCalorieTarget
  );
  const sevenDayAverage = calculateSevenDayAverage(data.meals, today);
  const trainingSummary = calculateTrainingSummary(
    data.trainingSessions,
    today,
    data.settings.weeklyGymTarget,
    data.settings.dailyCardioTargetMinutes * 7
  );
  const latestWeight = data.weights[0]?.weightKg;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <Reveal>
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-700">
                Hoje, {formatLongDate(now)}
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-zinc-950 sm:text-6xl">
                Controla calorias, treino e progresso.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-700">
                Meta atual: {data.settings.dailyCalorieTarget} kcal por dia,
                ginasio {data.settings.weeklyGymTarget}x por semana e cardio
                em casa como habito diario ajustavel.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-zinc-950/5">
              <p className="text-sm font-medium text-zinc-600">Uso da meta diaria</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-5xl font-semibold text-zinc-950">
                  {dailySummary.percentUsed}%
                </p>
                <p className="pb-2 text-sm text-zinc-600">
                  {dailySummary.consumed}/{dailySummary.target} kcal
                </p>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-teal-700"
                  style={{ width: `${Math.min(dailySummary.percentUsed, 100)}%` }}
                />
              </div>
            </div>
          </section>
        </Reveal>

        <div className="mt-8 space-y-8">
          <Reveal delay={0.05}>
            <DashboardCards
              summary={dailySummary}
              sevenDayAverage={sevenDayAverage}
              latestWeight={latestWeight}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <TrainingSummary summary={trainingSummary} />
          </Reveal>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal delay={0.12}>
              <Panel title="Adicionar refeicao" description="Registo rapido para usar no telemovel durante o dia.">
                <MealForm defaultDateTime={defaultDateTime} />
              </Panel>
            </Reveal>
            <Reveal delay={0.16}>
              <Panel title="Historico recente" description="Ultimos dias agrupados por consumo total.">
                <HistoryList groups={groups} />
              </Panel>
            </Reveal>
          </section>

          <section id="estatisticas" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal delay={0.1}>
              <Panel title="Tendencia de calorias" description="Compara consumo real com a meta configurada.">
                <StatsChart groups={groups} target={data.settings.dailyCalorieTarget} />
              </Panel>
            </Reveal>
            <Reveal delay={0.14}>
              <Panel title="Treino" description="Regista ginasio, bicicleta ou esteira.">
                <TrainingForm defaultDateTime={defaultDateTime} />
              </Panel>
            </Reveal>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Reveal delay={0.1}>
              <Panel title="Peso corporal" description="Acompanha a evolucao sem depender da memoria.">
                <WeightForm defaultDate={today} />
              </Panel>
            </Reveal>
            <Reveal delay={0.14}>
              <Panel title="Metas pessoais" description="Ajusta agressividade sem alterar codigo.">
                <SettingsForm settings={data.settings} />
              </Panel>
            </Reveal>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Panel({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-zinc-950/5 backdrop-blur sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

function toLocalDateTimeInput(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}
