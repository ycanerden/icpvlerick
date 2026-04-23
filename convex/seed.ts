import { mutation } from "./_generated/server";
import { currentWeekStart } from "./lib";

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const weekStart = currentWeekStart();
    const teams = await ctx.db.query("teams").collect();
    if (teams.length > 0) {
      return { seeded: false, reason: "Teams already exist" };
    }
    return { seeded: false, reason: "Create auth users first, then seed from dashboard flow" };
  },
});
