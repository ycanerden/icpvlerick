"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ReactNode } from "react";
import { convexReactClient } from "@/lib/convex";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ConvexAuthProvider client={convexReactClient}>{children}</ConvexAuthProvider>;
}
