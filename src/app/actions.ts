"use server";

import {
  insertMeal,
  insertTraining,
  insertWeight,
  updateSettings
} from "@/lib/db";
import {
  mealSchema,
  settingsSchema,
  trainingSchema,
  weightSchema
} from "@/lib/validation";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ActionState = {
  ok?: boolean;
  error?: string;
};

export async function addMealAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAuth();
  const parsed = mealSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Confirma os dados da refeicao." };
  }

  await insertMeal(parsed.data);
  revalidatePath("/");
  return { ok: true };
}

export async function addTrainingAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAuth();
  const parsed = trainingSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Confirma os dados do treino." };
  }

  await insertTraining(parsed.data);
  revalidatePath("/");
  return { ok: true };
}

export async function addWeightAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAuth();
  const parsed = weightSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Confirma o peso registado." };
  }

  await insertWeight(parsed.data);
  revalidatePath("/");
  return { ok: true };
}

export async function updateSettingsAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAuth();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Confirma as metas definidas." };
  }

  await updateSettings(parsed.data);
  revalidatePath("/");
  return { ok: true };
}
