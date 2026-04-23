import { describe, expect, it } from "vitest";
import { calculateScore } from "@/lib/scoring";

describe("calculateScore", () => {
  it("calculates score with caps applied", () => {
    const score = calculateScore({
      missionCount: 3,
      completedCount: 2,
      winsCount: 5,
    });

    expect(score.missionCreated).toBe(6);
    expect(score.missionCompleted).toBe(16);
    expect(score.winPosted).toBe(3);
    expect(score.total).toBe(25);
  });
});
