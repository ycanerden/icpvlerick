"use client";

import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
    <section className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Wins Feed</CardTitle>
          <CardDescription>Share short progress updates with your cohort.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Example: Closed our first pilot customer call this week."
          />
          <Button onClick={onPost}>Post quick win</Button>
          {error ? (
            <Alert className="border-red-200 bg-red-50 text-red-900">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {wins?.map((win: any) => (
          <Card key={win._id}>
            <CardContent className="p-5">
              <p className="text-slate-800">{win.content}</p>
              <small className="text-slate-500">
              {formatDistanceToNow(win.createdAt, { addSuffix: true })}
              </small>
            </CardContent>
          </Card>
        ))}
        {!wins?.length ? (
          <Card>
            <CardContent className="p-5 text-slate-600">
            No wins posted yet.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
