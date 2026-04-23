"use client";

import { useMutation, useQuery } from "convex/react";
import { AuthGate } from "@/components/auth-gate";

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
    <section className="stack">
      <div className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0 }}>Leaderboard</h1>
        <p style={{ marginTop: 0 }}>
          Points: mission created (+2), mission completed (+8), quick wins (+1, max 3).
        </p>
        <button className="btn btn-secondary" onClick={() => recalculate()}>
          Recalculate snapshots
        </button>
      </div>

      <div className="card" style={{ padding: "1rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Rank</th>
              <th>Team</th>
              <th>Points</th>
              <th>Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row: any, index: number) => (
              <tr key={row.teamId} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={{ padding: "0.4rem 0" }}>{index + 1}</td>
                <td>{row.teamName}</td>
                <td>{row.points}</td>
                <td>
                  C:{row.breakdown.missionCreated} / D:{row.breakdown.missionCompleted} / W:
                  {row.breakdown.winPosted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
