import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
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

type LocalStore = {
  nextMealId: number;
  nextTrainingId: number;
  nextWeightId: number;
  meals: MealRecord[];
  trainingSessions: TrainingRecord[];
  weights: WeightRecord[];
  settings: SettingsRecord;
};

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

function shouldUseLocalStore(): boolean {
  if (process.env.CALORIAS_STORAGE === "local") {
    return true;
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return (
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("user:pass@localhost:5432/db")
  );
}

export async function getSettings(): Promise<SettingsRecord> {
  if (shouldUseLocalStore()) {
    return (await readLocalStore()).settings;
  }

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
  if (shouldUseLocalStore()) {
    const store = await readLocalStore();
    return {
      meals: store.meals.sort(sortByDateDesc("eatenAt")),
      trainingSessions: store.trainingSessions.sort(sortByDateDesc("performedAt")),
      weights: store.weights.sort(sortByDateDesc("measuredAt")),
      settings: store.settings
    };
  }

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
  if (shouldUseLocalStore()) {
    const store = await readLocalStore();
    const now = new Date().toISOString();
    store.meals.unshift({
      id: store.nextMealId,
      name: input.name,
      calories: input.calories,
      eatenAt: new Date(input.eatenAt).toISOString(),
      notes: input.notes,
      createdAt: now,
      updatedAt: now
    });
    store.nextMealId += 1;
    await writeLocalStore(store);
    return;
  }

  await sql()`
    insert into meals (name, calories, eaten_at, notes)
    values (${input.name}, ${input.calories}, ${input.eatenAt}, ${input.notes})
  `;
}

export async function insertTraining(input: TrainingInput): Promise<void> {
  if (shouldUseLocalStore()) {
    const store = await readLocalStore();
    const now = new Date().toISOString();
    store.trainingSessions.unshift({
      id: store.nextTrainingId,
      type: input.type,
      durationMinutes: input.durationMinutes,
      performedAt: new Date(input.performedAt).toISOString(),
      intensity: input.intensity,
      notes: input.notes,
      createdAt: now,
      updatedAt: now
    });
    store.nextTrainingId += 1;
    await writeLocalStore(store);
    return;
  }

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
  if (shouldUseLocalStore()) {
    const store = await readLocalStore();
    store.weights.unshift({
      id: store.nextWeightId,
      weightKg: input.weightKg,
      measuredAt: input.measuredAt,
      notes: input.notes,
      createdAt: new Date().toISOString()
    });
    store.nextWeightId += 1;
    await writeLocalStore(store);
    return;
  }

  await sql()`
    insert into body_weights (weight_kg, measured_at, notes)
    values (${input.weightKg}, ${input.measuredAt}, ${input.notes})
  `;
}

export async function updateSettings(input: SettingsInput): Promise<void> {
  if (shouldUseLocalStore()) {
    const store = await readLocalStore();
    store.settings = {
      ...store.settings,
      dailyCalorieTarget: input.dailyCalorieTarget,
      weeklyGymTarget: input.weeklyGymTarget,
      dailyCardioTargetMinutes: input.dailyCardioTargetMinutes,
      updatedAt: new Date().toISOString()
    };
    await writeLocalStore(store);
    return;
  }

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

async function readLocalStore(): Promise<LocalStore> {
  const path = localStorePath();

  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    const now = new Date().toISOString();
    return {
      nextMealId: 1,
      nextTrainingId: 1,
      nextWeightId: 1,
      meals: [],
      trainingSessions: [],
      weights: [],
      settings: {
        id: 1,
        dailyCalorieTarget: 1900,
        weeklyGymTarget: 3,
        dailyCardioTargetMinutes: 20,
        createdAt: now,
        updatedAt: now
      }
    };
  }
}

async function writeLocalStore(store: LocalStore): Promise<void> {
  const path = localStorePath();
  await mkdir(join(process.cwd(), ".data"), { recursive: true });
  await writeFile(path, JSON.stringify(store, null, 2));
}

function localStorePath(): string {
  return join(process.cwd(), ".data", "calorias.json");
}

function sortByDateDesc<T extends Record<K, string>, K extends keyof T>(key: K) {
  return (left: T, right: T) =>
    new Date(right[key]).getTime() - new Date(left[key]).getTime();
}
