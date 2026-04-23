"use client";

import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { winSchema } from "@/lib/validators";

export default function FeedPage() {
  return (
    <AuthGate>
      <FeedContent />
    </AuthGate>
  );
}

function FeedContent() {
  const wins = useQuery("wins:listRecent" as any);
  const createWin = useMutation("wins:createWin" as any);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const onPost = async () => {
    setError("");
    try {
      winSchema.parse({ content });
      await createWin({ content });
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to post win");
    }
  };

  return (
    <section className="stack">
      <div className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0 }}>Quick Wins Feed</h1>
        <p style={{ marginTop: 0 }}>Share short progress updates with your cohort.</p>
        <div className="stack">
          <textarea
            className="input"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Example: Closed our first pilot customer call this week."
          />
          <button className="btn btn-primary" onClick={onPost}>
            Post quick win
          </button>
        </div>
        {error ? <p style={{ color: "#b91c1c", marginBottom: 0 }}>{error}</p> : null}
      </div>

      <div className="stack">
        {wins?.map((win: any) => (
          <article key={win._id} className="card" style={{ padding: "0.9rem" }}>
            <p style={{ marginTop: 0 }}>{win.content}</p>
            <small style={{ color: "#475569" }}>
              {formatDistanceToNow(win.createdAt, { addSuffix: true })}
            </small>
          </article>
        ))}
        {!wins?.length ? (
          <div className="card" style={{ padding: "1rem" }}>
            No wins posted yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
