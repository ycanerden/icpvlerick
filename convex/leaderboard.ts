import { mutation, query } from "./_generated/server";
import { currentWeekStart, getRequiredUserId } from "./lib";

function scoreBreakdown(missionCount: number, completedCount: number, winsCount: number) {
  const missionCreated = missionCount * 2;
  const missionCompleted = completedCount * 8;
  const winPosted = Math.min(winsCount, 3) * 1;
  return {
    missionCreated,
    missionCompleted,
    winPosted,
    total: missionCreated + missionCompleted + winPosted,
  };
}

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

export const weekly = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getRequiredUserId(ctx);
    await requireMembership(ctx, userId);
    const weekStart = currentWeekStart();
    const teams = await ctx.db.query("teams").collect();

    const rows = await Promise.all(
      teams.map(async (team) => {
        const missions = await ctx.db
          .query("missions")
          .withIndex("by_team_week", (q: any) => q.eq("teamId", team._id).eq("weekStart", weekStart))
          .collect();
        const wins = await ctx.db
          .query("wins")
          .withIndex("by_team_week", (q: any) => q.eq("teamId", team._id).eq("weekStart", weekStart))
          .collect();
        const completedCount = missions.filter((mission) => mission.status === "completed").length;
        const breakdown = scoreBreakdown(missions.length, completedCount, wins.length);
        return {
          teamId: team._id,
          teamName: team.name,
          points: breakdown.total,
          breakdown: {
            missionCreated: breakdown.missionCreated,
            missionCompleted: breakdown.missionCompleted,
            winPosted: breakdown.winPosted,
          },
        };
      }),
    );

    return rows.sort((a, b) => b.points - a.points);
  },
});

export const recalculateSnapshots = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getRequiredUserId(ctx);
    const membership = await requireMembership(ctx, userId);
    if (membership.role !== "owner") {
      throw new Error("Only team owners can recalculate snapshots.");
    }

    const weekStart = currentWeekStart();
    const existing = await ctx.db
      .query("leaderboard_snapshots")
      .withIndex("by_week", (q: any) => q.eq("weekStart", weekStart))
      .collect();
    await Promise.all(existing.map((item) => ctx.db.delete(item._id)));

    const teams = await ctx.db.query("teams").collect();
    for (const team of teams) {
      const missions = await ctx.db
        .query("missions")
        .withIndex("by_team_week", (q: any) => q.eq("teamId", team._id).eq("weekStart", weekStart))
        .collect();
      const wins = await ctx.db
        .query("wins")
        .withIndex("by_team_week", (q: any) => q.eq("teamId", team._id).eq("weekStart", weekStart))
        .collect();
      const completedCount = missions.filter((mission) => mission.status === "completed").length;
      const breakdown = scoreBreakdown(missions.length, completedCount, wins.length);
      await ctx.db.insert("leaderboard_snapshots", {
        teamId: team._id,
        weekStart,
        points: breakdown.total,
        breakdown: {
          missionCreated: breakdown.missionCreated,
          missionCompleted: breakdown.missionCompleted,
          winPosted: breakdown.winPosted,
        },
        updatedAt: Date.now(),
      });
    }
    return { ok: true };
  },
});
