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
      <div id="hoje" className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <Reveal>
          <section className="rounded-[1.75rem] border border-white/10 bg-[#111411] p-5 text-white shadow-2xl shadow-black/30 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">{formatLongDate(now)}</p>
                <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
                  {dailySummary.remaining}
                  <span className="ml-2 text-base font-medium text-zinc-400">kcal</span>
                </h1>
                <p className="mt-1 text-sm text-zinc-400">restantes hoje</p>
              </div>
              <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-sm text-emerald-200">
                {dailySummary.percentUsed}%
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>{dailySummary.consumed} consumidas</span>
                <span>{dailySummary.target} meta</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-300"
                  style={{ width: `${Math.min(dailySummary.percentUsed, 100)}%` }}
                />
              </div>
            </div>
          </section>
        </Reveal>

        <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
          <Reveal delay={0.05}>
            <DashboardCards
              summary={dailySummary}
              sevenDayAverage={sevenDayAverage}
              latestWeight={latestWeight}
            />
          </Reveal>

          <section id="refeicao" className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal delay={0.12}>
              <Panel title="Refeicao" actionLabel="rapido">
                <MealForm defaultDateTime={defaultDateTime} />
              </Panel>
            </Reveal>
            <Reveal delay={0.16}>
              <Panel title="Historico">
                <HistoryList groups={groups} />
              </Panel>
            </Reveal>
          </section>

          <section id="treino">
            <Reveal delay={0.1}>
              <TrainingSummary summary={trainingSummary} />
            </Reveal>
          </section>

          <section id="estatisticas" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal delay={0.1}>
              <Panel title="Calorias">
                <StatsChart groups={groups} target={data.settings.dailyCalorieTarget} />
              </Panel>
            </Reveal>
            <Reveal delay={0.14}>
              <Panel title="Treino">
                <TrainingForm defaultDateTime={defaultDateTime} />
              </Panel>
            </Reveal>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Reveal delay={0.1}>
              <Panel title="Peso">
                <WeightForm defaultDate={today} />
              </Panel>
            </Reveal>
            <Reveal delay={0.14}>
              <Panel title="Metas">
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
  actionLabel,
  children
}: {
  title: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#101311] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-50">{title}</h2>
        {actionLabel ? (
          <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-zinc-400">
            {actionLabel}
          </span>
        ) : null}
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
