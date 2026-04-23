# Vlerick Accountability MVP

Small gamified accountability app for startup teams during the 2-month sprint.

## Stack

- Next.js (App Router, TypeScript)
- Convex backend
- Convex Auth (email + password)

## Features in V1

- Team login/signup
- Team creation/join via invite code
- Weekly missions (max 3)
- Quick wins feed
- Leaderboard with transparent point rules
- Shared calendar, including class-event flag

## Local setup

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - `cp .env.example .env.local`
3. Set Convex deployment values in `.env.local`:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `CONVEX_DEPLOYMENT`
4. Start Convex dev/codegen in one terminal:
   - `npx convex dev`
5. Start Next.js in another terminal:
   - `npm run dev`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

## Deploy to Railway

1. Create a new Railway project and connect this repository.
2. Add environment variables in Railway:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `CONVEX_DEPLOYMENT`
3. Ensure Convex schema/functions are deployed first:
   - `npx convex deploy`
4. Railway will build and deploy automatically from your default branch.
5. For manual deploys with CLI:
   - `railway up`

If the CLI asks for authentication, run `railway login` once and rerun.
