"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <div className="card" style={{ padding: "1rem" }}>Checking session...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="card" style={{ padding: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Please login first</h3>
        <p>This section is available for logged in team members.</p>
        <Link href="/login" className="btn btn-primary">
          Go to login
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
