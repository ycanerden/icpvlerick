"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const authActions = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!authActions?.signIn) {
        throw new Error("Convex auth is not configured. Set NEXT_PUBLIC_CONVEX_URL first.");
      }
      await authActions.signIn("password", {
        flow: "signUp",
        email,
        password,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card" style={{ padding: "1rem", maxWidth: 420 }}>
      <h1 style={{ marginTop: 0 }}>Create account</h1>
      <form className="stack" onSubmit={onSubmit}>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        {error ? <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </section>
  );
}
