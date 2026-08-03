# portfolio-26

The source of [athulrajpalayi.com](https://athulrajpalayi.com) — a self-hosted Next.js application with its own PostgreSQL-backed admin CMS, so the projects, copy, and media on the site are content I manage at runtime rather than pages I redeploy.

Not a template and not a static site generator. The public site is the read side of a small content platform; everything it renders comes out of the database.

---

## What's in it

**Public site**

- Landing page assembled from database-driven sections
- Per-project detail pages at `/projects/[slug]`, composed of ordered content blocks with their own metrics and tags
- Contact form writing to a submissions inbox

**Admin CMS** (`/admin`)

| Area | Purpose |
|------|---------|
| `dashboard` | Overview |
| `projects`, `apps`, `systems` | Content types — projects with blocks/metrics/tags, an app catalogue, and a systems graph of nodes and edges |
| `content` | Landing-page section editor |
| `media` | Uploaded asset library |
| `inbox` | Contact-form submissions |
| `users`, `settings`, `security` | Admin accounts, site settings, audit trail |
| `login`, `verify-2fa` | Two-step authentication flow |

**Authentication and audit**

- bcrypt password hashing, server-side sessions
- TOTP two-factor authentication as a separate verification step
- Append-only audit log of privileged actions

## Stack

`Next.js 16` `React 19` `TypeScript` `Tailwind CSS v4` `Prisma 7 · PostgreSQL` `Vitest + Testing Library` `Docker` `nginx · Let's Encrypt`

The data model is 15 Prisma models spanning auth (`AdminUser`, `Session`, `TwoFactorSecret`, `AuditLog`), site configuration (`SiteSetting`, `LandingSection`), content (`Project`, `ProjectMetric`, `ProjectTag`, `ProjectBlock`, `AppItem`, `SystemNode`, `SystemEdge`, `MediaAsset`), and inbound messages (`ContactSubmission`).

## Running locally

```bash
npm install
cp .env.example .env      # then fill in real values — see below
npm run prisma:generate
npm run db:push
npm run bootstrap:admin   # creates the first admin account
npm run dev
```

`.env.example` documents every required variable. Two need generating rather than typing:

```bash
npm run admin:hash-password   # -> ADMIN_PASSWORD_HASH
npm run admin:totp            # -> ADMIN_TOTP_SECRET
```

## Scripts

| Script | Does |
|--------|------|
| `dev` / `build` / `start` | Next.js development, production build, production server |
| `lint` / `typecheck` | ESLint, `tsc --noEmit` |
| `test` | Vitest suite (auth, content, marketing, platform) |
| `prisma:generate` / `db:push` | Prisma client generation, schema sync |
| `bootstrap:admin` | One-time first-admin creation |
| `admin:hash-password` / `admin:totp` | Generate credentials for `.env` |

## Deployment

Dockerised behind host nginx with Let's Encrypt. Full runbook in [DEPLOY.md](DEPLOY.md); a longer annotated walkthrough is in [`docs/deployment/`](docs/deployment/).

Deploys run **on the server**, not locally. After the first setup, an update is:

```bash
cd /var/www/athulrajpalayi
git pull origin master
docker compose -f docker-compose.shared-vps.yml up -d --build --no-deps app
```

`--no-deps app` rebuilds only the application container, leaving PostgreSQL running. `docker-compose.prod.yml` is the standalone-host variant; the live deployment shares a VPS and uses `docker-compose.shared-vps.yml`.

## License

No licence is granted. This is the source of my personal site, published to be read rather than reused — see [LICENSE](LICENSE).
