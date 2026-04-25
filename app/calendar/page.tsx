"use client";

import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { eventSchema, parseIsoDate } from "@/lib/validators";

export default function CalendarPage() {
  return (
    <AuthGate>
      <CalendarContent />
    </AuthGate>
  );
}

function CalendarContent() {
  const now = useMemo(() => new Date(), []);
  const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();
  const events = useQuery("events:listInRange" as any, { startAt: start, endAt: end });
  const createEvent = useMutation("events:createEvent" as any);

  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [isClassEvent, setIsClassEvent] = useState(false);
  const [sharedWithClass, setSharedWithClass] = useState(true);
  const [error, setError] = useState("");

  const onCreate = async () => {
    setError("");
    try {
      const payload = {
        title,
        startAt: parseIsoDate(startAt),
        endAt: parseIsoDate(endAt),
        isClassEvent,
        sharedWithClass,
      };
      eventSchema.parse(payload);
      await createEvent(payload);
      setTitle("");
      setStartAt("");
      setEndAt("");
      setIsClassEvent(false);
      setSharedWithClass(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create event");
    }
  };

  return (
    <section className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Shared Calendar</CardTitle>
          <CardDescription>Share startup events and mandatory class sessions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
          />
          <Label className="space-y-2">
            Start
            <Input
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </Label>
          <Label className="space-y-2">
            End
            <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
          </Label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <Checkbox checked={isClassEvent} onChange={(e) => setIsClassEvent(e.target.checked)} />
            This is a mandatory class event
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <Checkbox checked={sharedWithClass} onChange={(e) => setSharedWithClass(e.target.checked)} />
            Share with all teams
          </label>
          <Button onClick={onCreate}>Add event</Button>
          {error ? (
            <Alert className="border-red-200 bg-red-50 text-red-900">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {events?.map((event: any) => (
          <Card key={event._id}>
            <CardContent className="flex items-start justify-between gap-3 p-5">
              <div>
              <strong>{event.title}</strong>
                <p className="mt-1 text-sm text-slate-600">
              {format(event.startAt, "PPpp")} - {format(event.endAt, "PPpp")}
                </p>
              </div>
              <Badge variant={event.isClassEvent ? "class" : "startup"}>
                {event.isClassEvent ? "Class" : "Startup"}
              </Badge>
            </CardContent>
          </Card>
        ))}
        {!events?.length ? (
          <Card>
            <CardContent className="p-5 text-slate-600">
            No events this month.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
