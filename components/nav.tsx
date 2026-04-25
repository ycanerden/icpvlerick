import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/missions", label: "Missions" },
  { href: "/feed", label: "Feed" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/calendar", label: "Calendar" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-5 px-4 py-3 md:px-6">
        <Link href="/" className="text-sm font-semibold text-slate-900">
          Vlerick Accountability
        </Link>
        <nav className="hidden gap-4 text-sm text-slate-700 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Signup</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
