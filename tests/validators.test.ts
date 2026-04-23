import { describe, expect, it } from "vitest";
import { missionSchema, parseIsoDate, winSchema } from "@/lib/validators";

describe("validators", () => {
  it("accepts a valid mission payload", () => {
    expect(() =>
      missionSchema.parse({
        title: "Get 5 customer calls",
        metric: "Customer calls",
        targetValue: "5",
      }),
    ).not.toThrow();
  });

  it("rejects short win content", () => {
    expect(() => winSchema.parse({ content: "ok" })).toThrow();
  });

  it("parses iso date values", () => {
    expect(parseIsoDate("2026-05-20T10:00")).toBeGreaterThan(0);
  });
});
