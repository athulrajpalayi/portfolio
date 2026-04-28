# Portfolio VPS Deployment

## Target

- Domain: `athulrajpalayi.com`
- Server: `5.223.63.213`
- Stack: `Next.js + PostgreSQL + Caddy`

## Environment

Populate these values in `.env.production` on the VPS:

- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `SESSION_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_DISPLAY_NAME`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_TOTP_SECRET`
- `SITE_DOMAIN`
- `SERVER_IP`

Use `.env.example` as the reference template.

## Bootstrap commands

1. Generate the owner password hash:
   `npm run admin:hash-password -- "YourStrongPassword"`
2. Generate the TOTP secret and authenticator URL:
   `npm run admin:totp -- owner@athulrajpalayi.com`
3. Push the Prisma schema:
   `npm run db:push`
4. Seed the first owner account and default portfolio content:
   `npm run bootstrap:admin`

## Docker deployment

The repository includes:

- `Dockerfile` for the app container
- `docker-compose.prod.yml` for `app + postgres + caddy`
- `docker-compose.shared-vps.yml` for `app + postgres` behind an existing host `nginx`
- `Caddyfile` configured for `athulrajpalayi.com`

Run on the VPS:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Shared VPS with existing nginx

If the VPS already hosts other sites on host-level `nginx`, do **not** stop `nginx` and do **not** use the Caddy-based stack on ports `80/443`.

Use:

```bash
docker compose -f docker-compose.shared-vps.yml up -d --build
```

This binds the app only to `127.0.0.1:3001`, so host `nginx` can reverse proxy `athulrajpalayi.com` without affecting the other sites on the server.

## Notes

- `bootstrap:admin` is idempotent, so re-running it is safe when updating the owner seed values.
- Public content still has build-safe fallbacks, but the admin panel expects PostgreSQL for persistent writes.
- The current media layer exposes the live resume path and leaves upload storage as the next logical extension.
- If a temporary helper container rejects `npm ci`, use `npm install` instead.
