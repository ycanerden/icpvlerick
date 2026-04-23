import { z } from "zod";

export const missionSchema = z.object({
  title: z.string().min(4).max(80),
  metric: z.string().min(2).max(80),
  targetValue: z.string().min(1).max(50),
});

export const winSchema = z.object({
  content: z.string().min(3).max(200),
});

export const eventSchema = z.object({
  title: z.string().min(3).max(80),
  startAt: z.number(),
  endAt: z.number(),
  isClassEvent: z.boolean(),
  sharedWithClass: z.boolean(),
});

export function parseIsoDate(value: string): number {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    throw new Error("Invalid date.");
  }
  return parsed;
}
