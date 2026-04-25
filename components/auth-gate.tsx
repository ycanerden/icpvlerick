"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <Card className="max-w-md"><CardContent className="p-6">Checking session...</CardContent></Card>;
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Please login first</CardTitle>
          <CardDescription>This section is available for logged in team members.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/login">Go to login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
