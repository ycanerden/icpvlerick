import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { currentWeekStart, getRequiredUserId } from "./lib";

async function requireMembership(ctx: any, userId: any) {
  const membership = await ctx.db
    .query("team_members")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();
  if (!membership) {
    throw new Error("Join or create a team first.");
  }
  return membership;
}

export const listForWeek = query({
  args: {
    weekStart: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getRequiredUserId(ctx);
    const membership = await requireMembership(ctx, userId);
    const weekStart = args.weekStart ?? currentWeekStart();
    return ctx.db
      .query("missions")
      .withIndex("by_team_week", (q: any) => q.eq("teamId", membership.teamId).eq("weekStart", weekStart))
      .collect();
  },
});

export const createMission = mutation({
  args: {
    title: v.string(),
    metric: v.string(),
    targetValue: v.string(),
    weekStart: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getRequiredUserId(ctx);
    const membership = await requireMembership(ctx, userId);
    const weekStart = args.weekStart ?? currentWeekStart();
    const existing = await ctx.db
      .query("missions")
      .withIndex("by_team_week", (q: any) => q.eq("teamId", membership.teamId).eq("weekStart", weekStart))
      .collect();
    if (existing.length >= 3) {
      throw new Error("Maximum 3 missions per week.");
    }
    return ctx.db.insert("missions", {
      teamId: membership.teamId,
      weekStart,
      title: args.title.trim(),
      metric: args.metric.trim(),
      targetValue: args.targetValue.trim(),
      status: "active",
      createdBy: userId,
      createdAt: Date.now(),
    });
  },
});

export const updateMissionStatus = mutation({
  args: {
    missionId: v.id("missions"),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("blocked")),
  },
  handler: async (ctx, args) => {
    const userId = await getRequiredUserId(ctx);
    const membership = await requireMembership(ctx, userId);
    const mission = await ctx.db.get(args.missionId);
    if (!mission || mission.teamId !== membership.teamId) {
      throw new Error("Mission not found.");
    }
    await ctx.db.patch(args.missionId, {
      status: args.status,
      completedAt: args.status === "completed" ? Date.now() : undefined,
    });
  },
});
