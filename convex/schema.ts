import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  teams: defineTable({
    name: v.string(),
    inviteCode: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_invite_code", ["inviteCode"]),
  team_members: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("member")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_team", ["teamId"])
    .index("by_team_user", ["teamId", "userId"]),
  missions: defineTable({
    teamId: v.id("teams"),
    weekStart: v.string(),
    title: v.string(),
    metric: v.string(),
    targetValue: v.string(),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("blocked")),
    createdBy: v.id("users"),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_team_week", ["teamId", "weekStart"])
    .index("by_team_status", ["teamId", "status"]),
  wins: defineTable({
    teamId: v.id("teams"),
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    weekStart: v.string(),
  })
    .index("by_team", ["teamId"])
    .index("by_team_week", ["teamId", "weekStart"]),
  events: defineTable({
    teamId: v.optional(v.id("teams")),
    title: v.string(),
    startAt: v.number(),
    endAt: v.number(),
    isClassEvent: v.boolean(),
    createdBy: v.id("users"),
  })
    .index("by_team", ["teamId"])
    .index("by_start_at", ["startAt"]),
  leaderboard_snapshots: defineTable({
    weekStart: v.string(),
    teamId: v.id("teams"),
    points: v.number(),
    breakdown: v.object({
      missionCreated: v.number(),
      missionCompleted: v.number(),
      winPosted: v.number(),
    }),
    updatedAt: v.number(),
  }).index("by_week", ["weekStart"]),
});
