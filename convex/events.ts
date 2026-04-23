import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getRequiredUserId } from "./lib";

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

export const listInRange = query({
  args: {
    startAt: v.number(),
    endAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getRequiredUserId(ctx);
    const membership = await requireMembership(ctx, userId);
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_at", (q: any) => q.gte("startAt", args.startAt).lte("startAt", args.endAt))
      .collect();
    return events.filter((event) => !event.teamId || event.teamId === membership.teamId);
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    startAt: v.number(),
    endAt: v.number(),
    isClassEvent: v.boolean(),
    sharedWithClass: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getRequiredUserId(ctx);
    const membership = await requireMembership(ctx, userId);
    return ctx.db.insert("events", {
      title: args.title.trim(),
      startAt: args.startAt,
      endAt: args.endAt,
      isClassEvent: args.isClassEvent,
      createdBy: userId,
      teamId: args.sharedWithClass ? undefined : membership.teamId,
    });
  },
});
