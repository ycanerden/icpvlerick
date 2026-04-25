"use client";

import { useMutation, useQuery } from "convex/react";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeaderboardPage() {
  return (
    <AuthGate>
      <LeaderboardContent />
    </AuthGate>
  );
}

function LeaderboardContent() {
  const rows = useQuery("leaderboard:weekly" as any);
  const recalculate = useMutation("leaderboard:recalculateSnapshots" as any);

  return (
    <section className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
          Points: mission created (+2), mission completed (+8), quick wins (+1, max 3).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => recalculate()}>
          Recalculate snapshots
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3">Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row: any, index: number) => (
              <tr key={row.teamId} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium">{index + 1}</td>
                <td className="px-4 py-3">{row.teamName}</td>
                <td className="px-4 py-3">{row.points}</td>
                <td className="px-4 py-3 text-slate-600">
                  C:{row.breakdown.missionCreated} / D:{row.breakdown.missionCompleted} / W:
                  {row.breakdown.winPosted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </CardContent>
      </Card>
    </section>
  );
}
