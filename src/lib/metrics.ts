export type MealMetric = {
  id: number;
  name: string;
  calories: number;
  eatenAt: string;
};

export type TrainingType = "gym" | "bike" | "treadmill";

export type TrainingMetric = {
  id: number;
  type: TrainingType;
  durationMinutes: number;
  performedAt: string;
};

export type DailySummary = {
  consumed: number;
  target: number;
  remaining: number;
  percentUsed: number;
};

export type MealDayGroup = {
  date: string;
  meals: MealMetric[];
  totalCalories: number;
};

export type TrainingSummary = {
  gymCompleted: number;
  gymTarget: number;
  gymPercent: number;
  cardioMinutes: number;
  cardioTarget: number;
  cardioPercent: number;
};

export function toDateKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

export function buildDailySummary(
  meals: MealMetric[],
  dateKey: string,
  target: number
): DailySummary {
  const consumed = meals
    .filter((meal) => toDateKey(meal.eatenAt) === dateKey)
    .reduce((total, meal) => total + meal.calories, 0);

  return {
    consumed,
    target,
    remaining: Math.max(target - consumed, 0),
    percentUsed: target > 0 ? Math.round((consumed / target) * 100) : 0
  };
}

export function calculateSevenDayAverage(
  meals: MealMetric[],
  endDateKey: string
): number {
  const end = new Date(`${endDateKey}T12:00:00.000Z`);
  let total = 0;

  for (let offset = 0; offset < 7; offset += 1) {
    const day = new Date(end);
    day.setUTCDate(end.getUTCDate() - offset);
    const key = toDateKey(day);
    total += meals
      .filter((meal) => toDateKey(meal.eatenAt) === key)
      .reduce((sum, meal) => sum + meal.calories, 0);
  }

  return Math.round(total / 7);
}

export function groupMealsByDay(meals: MealMetric[]): MealDayGroup[] {
  const groups = new Map<string, MealMetric[]>();

  for (const meal of meals) {
    const key = toDateKey(meal.eatenAt);
    groups.set(key, [...(groups.get(key) ?? []), meal]);
  }

  return Array.from(groups.entries())
    .map(([date, dayMeals]) => ({
      date,
      meals: dayMeals.sort(
        (left, right) =>
          new Date(right.eatenAt).getTime() - new Date(left.eatenAt).getTime()
      ),
      totalCalories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0)
    }))
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function calculateTrainingSummary(
  sessions: TrainingMetric[],
  endDateKey: string,
  gymTarget: number,
  cardioTarget: number
): TrainingSummary {
  const weekSessions = filterCurrentWeek(sessions, endDateKey);
  const gymCompleted = weekSessions.filter((session) => session.type === "gym").length;
  const cardioMinutes = weekSessions
    .filter((session) => session.type === "bike" || session.type === "treadmill")
    .reduce((total, session) => total + session.durationMinutes, 0);

  return {
    gymCompleted,
    gymTarget,
    gymPercent: gymTarget > 0 ? Math.round((gymCompleted / gymTarget) * 100) : 0,
    cardioMinutes,
    cardioTarget,
    cardioPercent:
      cardioTarget > 0 ? Math.round((cardioMinutes / cardioTarget) * 100) : 0
  };
}

function filterCurrentWeek<T extends { performedAt: string }>(
  rows: T[],
  endDateKey: string
): T[] {
  const end = new Date(`${endDateKey}T23:59:59.999Z`);
  const start = new Date(end);
  const day = start.getUTCDay();
  const offsetToMonday = day === 0 ? 6 : day - 1;
  start.setUTCDate(start.getUTCDate() - offsetToMonday);
  start.setUTCHours(0, 0, 0, 0);

  return rows.filter((row) => {
    const date = new Date(row.performedAt);
    return date >= start && date <= end;
  });
}
