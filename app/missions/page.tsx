"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { missionSchema } from "@/lib/validators";

export default function MissionsPage() {
  return (
    <AuthGate>
      <MissionsContent />
    </AuthGate>
  );
}

function MissionsContent() {
  const missions = useQuery("missions:listForWeek" as any, {});
  const createMission = useMutation("missions:createMission" as any);
  const updateStatus = useMutation("missions:updateMissionStatus" as any);
  const [title, setTitle] = useState("");
  const [metric, setMetric] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [error, setError] = useState("");

  const onCreate = async () => {
    setError("");
    try {
      missionSchema.parse({ title, metric, targetValue });
      await createMission({ title, metric, targetValue });
      setTitle("");
      setMetric("");
      setTargetValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create mission");
    }
  };

  const setMissionStatus = async (missionId: string, status: "active" | "completed" | "blocked") => {
    try {
      await updateStatus({ missionId, status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update mission");
    }
  };

  return (
    <section className="stack">
      <div className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0 }}>Weekly Missions</h1>
        <p style={{ marginTop: 0 }}>Add up to 3 specific and measurable missions each week.</p>
        <div className="stack">
          <input
            className="input"
            placeholder="Mission title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input"
            placeholder="Success metric (eg: user interviews)"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          />
          <input
            className="input"
            placeholder="Target (eg: 10 interviews)"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
          />
          <button className="btn btn-primary" onClick={onCreate}>
            Add mission
          </button>
        </div>
        {error ? <p style={{ color: "#b91c1c", marginBottom: 0 }}>{error}</p> : null}
      </div>

      <div className="stack">
        {missions?.map((mission: any) => (
          <div key={mission._id} className="card" style={{ padding: "0.9rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "0.3rem" }}>{mission.title}</h3>
            <p style={{ margin: 0 }}>
              <strong>Metric:</strong> {mission.metric}
            </p>
            <p style={{ margin: "0.2rem 0 0.6rem" }}>
              <strong>Target:</strong> {mission.targetValue}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button className="btn btn-secondary" onClick={() => setMissionStatus(mission._id, "active")}>
                Active
              </button>
              <button className="btn btn-primary" onClick={() => setMissionStatus(mission._id, "completed")}>
                Completed
              </button>
              <button className="btn btn-secondary" onClick={() => setMissionStatus(mission._id, "blocked")}>
                Blocked
              </button>
            </div>
          </div>
        ))}
        {!missions?.length ? (
          <div className="card" style={{ padding: "1rem" }}>
            No missions yet for this week.
          </div>
        ) : null}
      </div>
    </section>
  );
}
