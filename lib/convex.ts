import { ConvexHttpClient } from "convex/browser";
import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud";

export const convexReactClient = new ConvexReactClient(convexUrl);
export const convexHttpClient = process.env.NEXT_PUBLIC_CONVEX_URL
  ? new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
  : null;

export const convexEnabled = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
