import { z } from "zod";

const requiredText = z.string().trim().min(1);
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null);

const positiveIntegerFromForm = z.coerce.number().int().positive();
const positiveNumberFromForm = z.coerce.number().positive();

export const mealSchema = z.object({
  name: requiredText.max(120),
  calories: positiveIntegerFromForm.max(6000),
  eatenAt: requiredText,
  notes: optionalText
});

export const trainingSchema = z.object({
  type: z.enum(["gym", "bike", "treadmill"]),
  durationMinutes: positiveIntegerFromForm.max(600),
  performedAt: requiredText,
  intensity: optionalText,
  notes: optionalText
});

export const weightSchema = z.object({
  weightKg: positiveNumberFromForm.min(30).max(300),
  measuredAt: requiredText,
  notes: optionalText
});

export const settingsSchema = z.object({
  dailyCalorieTarget: positiveIntegerFromForm.min(1000).max(5000),
  weeklyGymTarget: z.coerce.number().int().min(0).max(7),
  dailyCardioTargetMinutes: z.coerce.number().int().min(0).max(240)
});

export type MealInput = z.infer<typeof mealSchema>;
export type TrainingInput = z.infer<typeof trainingSchema>;
export type WeightInput = z.infer<typeof weightSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
