"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
    <section className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Manage your team membership and invite code.</CardDescription>
        </CardHeader>
        <CardContent>
        {me?.team ? (
          <div className="space-y-2">
            <p className="text-slate-700">
              <strong>Team:</strong> {me.team.name}
            </p>
            <p className="text-slate-700">
              <strong>Invite code:</strong>{" "}
              <Badge variant="secondary" className="ml-1 tracking-wide">
                {me.team.inviteCode}
              </Badge>
            </p>
          </div>
        ) : (
          <p className="text-slate-600">You are not yet in a team. Create one or join with an invite code.</p>
        )}
        </CardContent>
      </Card>

      {!me?.team ? (
        <Card>
          <CardContent className="grid gap-5 p-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Create a team</h3>
              <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team name"
            />
              <Button onClick={onCreate} disabled={busy || !teamName.trim()}>
              Create team
              </Button>
          </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Join a team</h3>
              <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Invite code"
            />
              <Button
                variant="outline"
              onClick={onJoin}
              disabled={busy || inviteCode.trim().length < 4}
            >
              Join with code
              </Button>
          </div>
            {error ? (
              <Alert className="border-red-200 bg-red-50 text-red-900">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
