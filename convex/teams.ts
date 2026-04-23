import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { createInviteCode, getRequiredUserId } from "./lib";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getRequiredUserId(ctx);
    const membership = await ctx.db
      .query("team_members")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .first();

    if (!membership) {
      return null;
    }

    const team = await ctx.db.get(membership.teamId);
    return {
      membership,
      team,
    };
  },
});

export const createTeam = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getRequiredUserId(ctx);
    const existingMembership = await ctx.db
      .query("team_members")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .first();
    if (existingMembership) {
      throw new Error("You are already in a team.");
    }

    const inviteCode = createInviteCode();
    const teamId = await ctx.db.insert("teams", {
      name: args.name.trim(),
      inviteCode,
      createdBy: userId,
      createdAt: Date.now(),
    });
    await ctx.db.insert("team_members", {
      teamId,
      userId,
      role: "owner",
      createdAt: Date.now(),
    });
    return teamId;
  },
});

export const joinTeam = mutation({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getRequiredUserId(ctx);
    const existingMembership = await ctx.db
      .query("team_members")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .first();
    if (existingMembership) {
      throw new Error("You are already in a team.");
    }

    const team = await ctx.db
      .query("teams")
      .withIndex("by_invite_code", (q: any) => q.eq("inviteCode", args.inviteCode.toUpperCase()))
      .first();
    if (!team) {
      throw new Error("Invite code is invalid.");
    }

    const existingForTeam = await ctx.db
      .query("team_members")
      .withIndex("by_team_user", (q: any) => q.eq("teamId", team._id).eq("userId", userId))
      .first();

    if (!existingForTeam) {
      await ctx.db.insert("team_members", {
        teamId: team._id,
        userId,
        role: "member",
        createdAt: Date.now(),
      });
    }

    return team._id;
  },
});
