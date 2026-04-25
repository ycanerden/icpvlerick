"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <section className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Missions</CardTitle>
          <CardDescription>Add up to 3 specific and measurable missions each week.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Mission title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Success metric (eg: user interviews)"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          />
          <Input
            placeholder="Target (eg: 10 interviews)"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
          />
          <Button onClick={onCreate}>Add mission</Button>
          {error ? (
            <Alert className="border-red-200 bg-red-50 text-red-900">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {missions?.map((mission: any) => (
          <Card key={mission._id}>
            <CardContent className="p-5">
              <h3 className="mb-2 text-lg font-medium">{mission.title}</h3>
              <p className="text-sm text-slate-700">
              <strong>Metric:</strong> {mission.metric}
              </p>
              <p className="mb-3 mt-1 text-sm text-slate-700">
              <strong>Target:</strong> {mission.targetValue}
              </p>
              <Badge variant="secondary" className="mb-3">
                {mission.status}
              </Badge>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setMissionStatus(mission._id, "active")}>
                Active
                </Button>
                <Button size="sm" onClick={() => setMissionStatus(mission._id, "completed")}>
                Completed
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMissionStatus(mission._id, "blocked")}>
                Blocked
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!missions?.length ? (
          <Card>
            <CardContent className="p-5 text-slate-600">
            No missions yet for this week.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
