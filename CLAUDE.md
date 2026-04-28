# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server (Turbopack)
npm run build        # Production build (outputs standalone)
npm run lint         # ESLint
npm run typecheck    # TypeScript check without emit
npm test             # Run all Vitest tests

# Run a single test file
npx vitest run tests/auth/auth-utils.test.ts

# Database
npm run prisma:generate    # Regenerate Prisma client after schema changes
npm run db:push            # Push schema to database (no migration files)

# Admin bootstrap (requires DATABASE_URL)
npm run bootstrap:admin    # Create initial admin user
npm run admin:hash-password
npm run admin:totp         # Generate TOTP setup QR
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. App runs without it (falls back to hardcoded content). |
| `SESSION_SECRET` | JWT signing secret for admin sessions. Defaults to a dev placeholder. |

## Architecture

Single Next.js App Router application with two surfaces:

**Marketing surface** — `app/(marketing)/` route group. Pages are server components that call `getMarketingContent()` from `lib/content/queries.ts`. Content comes from the database when `DATABASE_URL` is set; otherwise falls back to the static `marketingContent` object in `lib/content/site-content.ts`. This means the app builds and runs without a database.

**Admin surface** — `app/admin/` routes, all protected by the middleware in `proxy.ts` (exported and consumed by Next.js middleware). Authentication is email/password + mandatory TOTP 2FA. Auth flow: `/admin/login` → sets a short-lived `pending-2fa` JWT → `/admin/verify-2fa` → sets a full `admin-session` JWT (12h). Server actions in `app/admin/actions.ts` handle all mutations; they call into `lib/admin/` helpers and call `revalidatePath` before redirecting.

**Content pipeline:**
```
Database (PostgreSQL via Prisma)
  → lib/content/repository.ts   (queries + mapping)
  → lib/content/queries.ts      (thin facade)
  → app/(marketing)/page.tsx    (server component)
  → components/marketing/home-page-view.tsx
```

`runOptionalDatabaseQuery()` in `lib/db/prisma.ts` wraps every DB call — it returns `null` if `DATABASE_URL` is unset or the query throws, so the public site degrades gracefully.

## Key Patterns

**Path alias:** `@/` maps to the project root (`tsconfig.json` `paths` + Vitest `resolve.alias`).

**Prisma client:** Uses `@prisma/adapter-pg` (pgpool driver). Singleton stored on `globalThis.prismaGlobal`. Always call `getPrismaClient()` — never instantiate directly.

**Admin mutations:** Use Next.js Server Actions (`"use server"` in `app/admin/actions.ts`). FormData helpers (`getString`, `getLines`, `getCsv`, `getMetrics`, `getTimeline`) parse raw form input before passing to `lib/admin/` functions.

**Validation:** Zod schemas live in `lib/validation/`. Used in both API route handlers and admin server actions.

**Session tokens:** Two JWT kinds — `"admin-session"` (full access, 12h) and `"pending-2fa"` (pre-2FA, 10m). Both verified by `verifySessionToken()` in `lib/auth/session.ts`. The middleware checks for `"admin-session"` specifically.

**Design system:** CSS custom properties defined in `styles/tokens.css`, consumed via Tailwind. Glass surfaces use `rgba(255,255,255,0.06)` background, 14–20px blur. Core accent colors: teal `#28F0D3`, blue `#3B82F6`, violet `#8B5CF6` on base `#070A12`.

**Motion:** Framer Motion components in `components/motion/`. All animations should respect `prefers-reduced-motion` — fall back to opacity/short positional transitions only.

## Testing

Vitest + Testing Library with jsdom. Setup file at `vitest.setup.ts`. Tests live under `tests/` mirroring the source structure (`tests/auth/`, `tests/content/`, `tests/marketing/`).

Component tests import view components directly and pass content props; they do not test DB or auth.

## Deployment

Targets a VPS with Caddy as the reverse proxy (see `Caddyfile`). Next.js `output: "standalone"` is set. Caddy proxies `athulrajpalayi.com` → `app:3000`. The `.dockerignore` and standalone output suggest a Docker-based deployment.
