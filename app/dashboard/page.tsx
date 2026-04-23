"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardContent />
    </AuthGate>
  );
}

function DashboardContent() {
  const me = useQuery("teams:me" as any);
  const createTeam = useMutation("teams:createTeam" as any);
  const joinTeam = useMutation("teams:joinTeam" as any);
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onCreate = async () => {
    setError("");
    setBusy(true);
    try {
      await createTeam({ name: teamName });
      setTeamName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create team");
    } finally {
      setBusy(false);
    }
  };

  const onJoin = async () => {
    setError("");
    setBusy(true);
    try {
      await joinTeam({ inviteCode: inviteCode.toUpperCase() });
      setInviteCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join team");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="stack">
      <div className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0 }}>Dashboard</h1>
        {me?.team ? (
          <div>
            <p>
              <strong>Team:</strong> {me.team.name}
            </p>
            <p>
              <strong>Invite code:</strong> {me.team.inviteCode}
            </p>
          </div>
        ) : (
          <p>You are not yet in a team. Create one or join with an invite code.</p>
        )}
      </div>

      {!me?.team ? (
        <div className="card" style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
          <div className="stack">
            <h3 style={{ margin: 0 }}>Create a team</h3>
            <input
              className="input"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team name"
            />
            <button className="btn btn-primary" onClick={onCreate} disabled={busy || !teamName.trim()}>
              Create team
            </button>
          </div>
          <hr style={{ borderColor: "#e2e8f0", width: "100%" }} />
          <div className="stack">
            <h3 style={{ margin: 0 }}>Join a team</h3>
            <input
              className="input"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Invite code"
            />
            <button
              className="btn btn-secondary"
              onClick={onJoin}
              disabled={busy || inviteCode.trim().length < 4}
            >
              Join with code
            </button>
          </div>
          {error ? <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
