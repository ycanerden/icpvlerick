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
      <body className="antialiased">
        <Providers>
          <Nav />
          <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
