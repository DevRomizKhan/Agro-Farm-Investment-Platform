# Amanah Farm

Amanah Farm is a Sharia-compliant agricultural co-ownership platform built
for Project Adi. Investors can review share packages, complete KYC, submit
investment requests, track ownership, and receive transparent project
reporting. Owners manage plans, investments, KYC reviews, blog content, leads,
notifications, and reports from the admin panel.

## Stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS v4
- Supabase Auth, Postgres, Storage, and Row Level Security
- Server Actions for validated application workflows

## Local development

1. Install dependencies with `pnpm install`.
2. Copy the required values from `.env.local` or [DEPLOYMENT.md](./DEPLOYMENT.md).
3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open `http://localhost:3000`.

The active database migration history is in `supabase/migrations/`. The files
under `database/` are archived reference material and are not used by the
Supabase CLI.

## Quality checks

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

## Deployment

Deploy to Vercel or another Node-compatible host with the environment variables
listed in [DEPLOYMENT.md](./DEPLOYMENT.md). Keep
`SUPABASE_SERVICE_ROLE_KEY` server-only; it must never be exposed to a client
component or public environment variable.
