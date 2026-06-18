import { describe, expect, it } from "vitest";
import {
  buildDailySummary,
  calculateSevenDayAverage,
  calculateTrainingSummary,
  groupMealsByDay
} from "./metrics";

describe("metrics", () => {
  const meals = [
    { id: 1, name: "Pequeno-almoco", calories: 420, eatenAt: "2026-06-18T08:15:00.000Z" },
    { id: 2, name: "Almoco", calories: 780, eatenAt: "2026-06-18T13:10:00.000Z" },
    { id: 3, name: "Jantar", calories: 640, eatenAt: "2026-06-17T20:00:00.000Z" }
  ];

  it("builds a daily calorie summary for the selected day", () => {
    expect(buildDailySummary(meals, "2026-06-18", 1900)).toEqual({
      consumed: 1200,
      target: 1900,
      remaining: 700,
      percentUsed: 63
    });
  });

  it("does not return negative remaining calories", () => {
    expect(buildDailySummary(meals, "2026-06-18", 1000).remaining).toBe(0);
  });

  it("calculates the seven day average including days with no meals", () => {
    expect(calculateSevenDayAverage(meals, "2026-06-18")).toBe(263);
  });

  it("groups meals by calendar day in descending order", () => {
    expect(groupMealsByDay(meals).map((group) => group.date)).toEqual([
      "2026-06-18",
      "2026-06-17"
    ]);
  });

  it("summarizes weekly gym and cardio progress", () => {
    const sessions = [
      { id: 1, type: "gym" as const, durationMinutes: 70, performedAt: "2026-06-17T18:00:00.000Z" },
      { id: 2, type: "bike" as const, durationMinutes: 25, performedAt: "2026-06-18T07:00:00.000Z" },
      { id: 3, type: "treadmill" as const, durationMinutes: 30, performedAt: "2026-06-16T07:00:00.000Z" }
    ];

    expect(calculateTrainingSummary(sessions, "2026-06-18", 3, 140)).toEqual({
      gymCompleted: 1,
      gymTarget: 3,
      gymPercent: 33,
      cardioMinutes: 55,
      cardioTarget: 140,
      cardioPercent: 39
    });
  });
});
