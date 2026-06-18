import postgres from "postgres";
import type { MealMetric, TrainingMetric, TrainingType } from "./metrics";
import type {
  MealInput,
  SettingsInput,
  TrainingInput,
  WeightInput
} from "./validation";

export type MealRecord = MealMetric & {
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TrainingRecord = TrainingMetric & {
  intensity: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WeightRecord = {
  id: number;
  weightKg: number;
  measuredAt: string;
  notes: string | null;
  createdAt: string;
};

export type SettingsRecord = {
  id: number;
  dailyCalorieTarget: number;
  weeklyGymTarget: number;
  dailyCardioTargetMinutes: number;
  createdAt: string;
  updatedAt: string;
};

export type DashboardData = {
  meals: MealRecord[];
  trainingSessions: TrainingRecord[];
  weights: WeightRecord[];
  settings: SettingsRecord;
};

let client: postgres.Sql | undefined;

function sql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  client ??= postgres(process.env.DATABASE_URL, {
    max: 1,
    ssl: process.env.NODE_ENV === "production" ? "require" : undefined
  });

  return client;
}

export async function getSettings(): Promise<SettingsRecord> {
  await sql()`
    insert into settings (id)
    values (1)
    on conflict (id) do nothing
  `;

  const rows = await sql()<DbSettings[]>`
    select *
    from settings
    where id = 1
    limit 1;
  `;

  return mapSettings(rows.at(-1) ?? defaultSettingsRow());
}

export async function getDashboardData(): Promise<DashboardData> {
  const [settings, meals, trainingSessions, weights] = await Promise.all([
    getSettings(),
    sql()<DbMeal[]>`
      select *
      from meals
      order by eaten_at desc
      limit 120
    `,
    sql()<DbTraining[]>`
      select *
      from training_sessions
      order by performed_at desc
      limit 120
    `,
    sql()<DbWeight[]>`
      select *
      from body_weights
      order by measured_at desc
      limit 60
    `
  ]);

  return {
    settings,
    meals: meals.map(mapMeal),
    trainingSessions: trainingSessions.map(mapTraining),
    weights: weights.map(mapWeight)
  };
}

export async function insertMeal(input: MealInput): Promise<void> {
  await sql()`
    insert into meals (name, calories, eaten_at, notes)
    values (${input.name}, ${input.calories}, ${input.eatenAt}, ${input.notes})
  `;
}

export async function insertTraining(input: TrainingInput): Promise<void> {
  await sql()`
    insert into training_sessions (
      type,
      duration_minutes,
      performed_at,
      intensity,
      notes
    )
    values (
      ${input.type},
      ${input.durationMinutes},
      ${input.performedAt},
      ${input.intensity},
      ${input.notes}
    )
  `;
}

export async function insertWeight(input: WeightInput): Promise<void> {
  await sql()`
    insert into body_weights (weight_kg, measured_at, notes)
    values (${input.weightKg}, ${input.measuredAt}, ${input.notes})
  `;
}

export async function updateSettings(input: SettingsInput): Promise<void> {
  await sql()`
    insert into settings (
      id,
      daily_calorie_target,
      weekly_gym_target,
      daily_cardio_target_minutes,
      updated_at
    )
    values (
      1,
      ${input.dailyCalorieTarget},
      ${input.weeklyGymTarget},
      ${input.dailyCardioTargetMinutes},
      now()
    )
    on conflict (id) do update
    set
      daily_calorie_target = excluded.daily_calorie_target,
      weekly_gym_target = excluded.weekly_gym_target,
      daily_cardio_target_minutes = excluded.daily_cardio_target_minutes,
      updated_at = now()
  `;
}

type DbMeal = {
  id: number;
  name: string;
  calories: number;
  eaten_at: Date;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
};

type DbTraining = {
  id: number;
  type: TrainingType;
  duration_minutes: number;
  performed_at: Date;
  intensity: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
};

type DbWeight = {
  id: number;
  weight_kg: string | number;
  measured_at: Date;
  notes: string | null;
  created_at: Date;
};

type DbSettings = {
  id: number;
  daily_calorie_target: number;
  weekly_gym_target: number;
  daily_cardio_target_minutes: number;
  created_at: Date;
  updated_at: Date;
};

function mapMeal(row: DbMeal): MealRecord {
  return {
    id: row.id,
    name: row.name,
    calories: row.calories,
    eatenAt: row.eaten_at.toISOString(),
    notes: row.notes,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

function mapTraining(row: DbTraining): TrainingRecord {
  return {
    id: row.id,
    type: row.type,
    durationMinutes: row.duration_minutes,
    performedAt: row.performed_at.toISOString(),
    intensity: row.intensity,
    notes: row.notes,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

function mapWeight(row: DbWeight): WeightRecord {
  return {
    id: row.id,
    weightKg: Number(row.weight_kg),
    measuredAt: row.measured_at.toISOString().slice(0, 10),
    notes: row.notes,
    createdAt: row.created_at.toISOString()
  };
}

function mapSettings(row: DbSettings): SettingsRecord {
  return {
    id: row.id,
    dailyCalorieTarget: row.daily_calorie_target,
    weeklyGymTarget: row.weekly_gym_target,
    dailyCardioTargetMinutes: row.daily_cardio_target_minutes,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

function defaultSettingsRow(): DbSettings {
  const now = new Date();

  return {
    id: 1,
    daily_calorie_target: 1900,
    weekly_gym_target: 3,
    daily_cardio_target_minutes: 20,
    created_at: now,
    updated_at: now
  };
}
