import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Vlerick Accountability MVP",
  description: "Gamified startup accountability app for teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          <main className="container" style={{ padding: "1.2rem 0 2rem" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
