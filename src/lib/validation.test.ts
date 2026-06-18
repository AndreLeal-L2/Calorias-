import { describe, expect, it } from "vitest";
import {
  mealSchema,
  settingsSchema,
  trainingSchema,
  weightSchema
} from "./validation";

describe("validation", () => {
  it("accepts a valid meal payload", () => {
    expect(
      mealSchema.parse({
        name: "Almoco",
        calories: "750",
        eatenAt: "2026-06-18T13:00",
        notes: "frango e arroz"
      })
    ).toEqual({
      name: "Almoco",
      calories: 750,
      eatenAt: "2026-06-18T13:00",
      notes: "frango e arroz"
    });
  });

  it("rejects invalid calorie values", () => {
    const result = mealSchema.safeParse({
      name: "Snack",
      calories: "0",
      eatenAt: "2026-06-18T17:00",
      notes: ""
    });

    expect(result.success).toBe(false);
  });

  it("accepts gym, bike, and treadmill training types", () => {
    for (const type of ["gym", "bike", "treadmill"]) {
      expect(
        trainingSchema.parse({
          type,
          durationMinutes: "45",
          performedAt: "2026-06-18T18:00",
          intensity: "moderado",
          notes: ""
        }).type
      ).toBe(type);
    }
  });

  it("accepts body weight entries", () => {
    expect(
      weightSchema.parse({
        weightKg: "99.4",
        measuredAt: "2026-06-18",
        notes: ""
      }).weightKg
    ).toBe(99.4);
  });

  it("accepts editable personal targets", () => {
    expect(
      settingsSchema.parse({
        dailyCalorieTarget: "1900",
        weeklyGymTarget: "3",
        dailyCardioTargetMinutes: "20"
      })
    ).toEqual({
      dailyCalorieTarget: 1900,
      weeklyGymTarget: 3,
      dailyCardioTargetMinutes: 20
    });
  });
});
