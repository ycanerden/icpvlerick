import Link from "next/link";

export default function HomePage() {
  return (
    <section className="stack">
      <div className="card" style={{ padding: "1.2rem" }}>
        <h1 style={{ marginTop: 0 }}>2-Month Startup Sprint Tracker</h1>
        <p>
          Keep every team aligned with weekly missions, quick wins, a shared calendar, and a simple
          leaderboard.
        </p>
        <div style={{ display: "flex", gap: "0.7rem" }}>
          <Link href="/signup" className="btn btn-primary">
            Create your team
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            Open dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
