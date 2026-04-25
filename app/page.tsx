import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <section className="grid gap-6">
      <Card className="border-slate-200/70 bg-white/95">
        <CardContent className="p-8 md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
            <Trophy className="h-3.5 w-3.5" />
            Vlerick startup sprint companion
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Keep every startup team accountable for the next 2 months.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
          Keep every team aligned with weekly missions, quick wins, a shared calendar, and a simple
          leaderboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Create your team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
