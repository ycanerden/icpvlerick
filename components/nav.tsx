import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/missions", label: "Missions" },
  { href: "/feed", label: "Feed" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/calendar", label: "Calendar" },
];

export function Nav() {
  return (
    <header style={{ background: "#0f172a", color: "#fff", padding: "0.9rem 0" }}>
      <div className="container" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <strong>Vlerick Accountability</strong>
        <nav style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} style={{ opacity: 0.95 }}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <Link href="/login" className="btn btn-secondary">
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
}
