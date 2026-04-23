"use client";

import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
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
    <section className="stack">
      <div className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0 }}>Shared Calendar</h1>
        <div className="stack">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
          />
          <label>
            Start
            <input
              className="input"
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </label>
          <label>
            End
            <input className="input" type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
          </label>
          <label style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isClassEvent}
              onChange={(e) => setIsClassEvent(e.target.checked)}
            />
            This is a mandatory class event
          </label>
          <label style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={sharedWithClass}
              onChange={(e) => setSharedWithClass(e.target.checked)}
            />
            Share with all teams
          </label>
          <button className="btn btn-primary" onClick={onCreate}>
            Add event
          </button>
        </div>
        {error ? <p style={{ color: "#b91c1c", marginBottom: 0 }}>{error}</p> : null}
      </div>

      <div className="stack">
        {events?.map((event: any) => (
          <article key={event._id} className="card" style={{ padding: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <strong>{event.title}</strong>
              <span
                style={{
                  background: event.isClassEvent ? "#fee2e2" : "#dbeafe",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                }}
              >
                {event.isClassEvent ? "Class" : "Startup"}
              </span>
            </div>
            <p style={{ marginBottom: 0, color: "#334155" }}>
              {format(event.startAt, "PPpp")} - {format(event.endAt, "PPpp")}
            </p>
          </article>
        ))}
        {!events?.length ? (
          <div className="card" style={{ padding: "1rem" }}>
            No events this month.
          </div>
        ) : null}
      </div>
    </section>
  );
}
