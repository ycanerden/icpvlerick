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

export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getRequiredUserId(ctx);
    const membership = await requireMembership(ctx, userId);
    const wins = await ctx.db
      .query("wins")
      .withIndex("by_team", (q: any) => q.eq("teamId", membership.teamId))
      .collect();
    return wins.sort((a, b) => b.createdAt - a.createdAt).slice(0, 40);
  },
});

export const createWin = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getRequiredUserId(ctx);
    const membership = await requireMembership(ctx, userId);
    const weekStart = currentWeekStart();
    const winsThisWeek = await ctx.db
      .query("wins")
      .withIndex("by_team_week", (q: any) => q.eq("teamId", membership.teamId).eq("weekStart", weekStart))
      .collect();
    if (winsThisWeek.length >= 3) {
      throw new Error("Maximum 3 wins per week are counted.");
    }
    return ctx.db.insert("wins", {
      teamId: membership.teamId,
      authorId: userId,
      content: args.content.trim(),
      createdAt: Date.now(),
      weekStart,
    });
  },
});
