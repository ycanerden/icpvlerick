"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeAuthError } from "@/lib/auth-errors";

export default function SignupPage() {
  const authActions = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ type: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
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
      setError(normalizeAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Sign up your team workspace and start the weekly sprint.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="name@startup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {error ? (
              <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                <AlertTitle>{error.type === "existing-account" ? "Account already exists" : "Sign up failed"}</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            ) : null}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
            {error?.type === "existing-account" ? (
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Go to login</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
