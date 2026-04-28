# DEPLOY.md — Portfolio 26 Deployment Guide

Target: `athulrajpalayi.com` → VPS `5.223.63.213`
Stack: Next.js 16 · PostgreSQL · Docker · nginx (host) · Let's Encrypt (already active)

---

## What You Need Before Starting

1. Your production secrets generated locally (steps below)
2. Google Authenticator app on your phone
3. SSH access to the VPS as root

---

## PART A — Local Machine (Windows)

### A1. Delete the plaintext credential file

```bash
del "POstgre p[ass.txt"
```

### A2. Update your WhatsApp number

Open `lib/content/site-content.ts` and replace `971000000000` with your real number:

```ts
whatsapp: "https://wa.me/971XXXXXXXXX",
```

### A3. Generate production secrets

Run these in the project directory (Git Bash):

```bash
# 1. SESSION_SECRET — copy the output
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Admin password hash — choose a strong password you'll remember
npm run admin:hash-password -- "YourStrongAdminPassword!"

# 3. TOTP secret — already done, secret is in the otpauth URL output
#    Your secret: see otpauth URL → secret=XXXX parameter
```

### A4. Add your admin account to Google Authenticator

- Open Google Authenticator → tap **+** → **Enter a setup key**
- Account name: `Athulraj Portfolio Admin`
- Key: paste the `secret=` value from the `admin:totp` output
- Type: **Time-based**
- Tap **Add**

You will use the 6-digit codes from this entry to log into the admin panel.

### A5. Commit and push to GitHub

```bash
git add -A
git status    # confirm "POstgre p[ass.txt" is NOT listed
git commit -m "Initial portfolio platform"
git branch -M main
git remote add origin https://github.com/athulrajpalayi/portfolio-26.git
git push -u main
```

---

## PART B — Server: Stop the Broken Existing Deployment

```bash
ssh root@5.223.63.213
cd /var/www/athulrajpalayi

# Stop and remove the current broken containers
docker compose -f docker-compose.prod.yml down

# Remove the old postgres data volume (app never bootstrapped — no real data)
docker volume rm athulrajpalayi_postgres_data
```

---

## PART C — Server: Get the Updated Code

```bash
# If no git repo exists at /var/www/athulrajpalayi yet:
rm -rf /var/www/athulrajpalayi
git clone https://github.com/athulrajpalayi/portfolio-26.git /var/www/athulrajpalayi

# If the git repo already exists there:
cd /var/www/athulrajpalayi
git pull origin main
```

---

## PART D — Server: Create `.env.production`

This file lives ONLY on the server. Never commit it.

```bash
nano /var/www/athulrajpalayi/.env.production
```

Paste and fill in every placeholder:

```env
# PostgreSQL container initialization
POSTGRES_DB=portfolio26
POSTGRES_USER=portfolio_admin
POSTGRES_PASSWORD=ChooseAStrongRandomPassword

# App — "postgres" is the Docker service name, not localhost
DATABASE_URL=postgresql://portfolio_admin:ChooseAStrongRandomPassword@postgres:5432/portfolio26

# Session signing — paste the hex output from step A3
SESSION_SECRET=pasteyour64charhexhere

# Admin login
ADMIN_EMAIL=imathulraj@gmail.com
ADMIN_DISPLAY_NAME=Athulraj Palayi
ADMIN_PASSWORD_HASH=pasteyourbcrypthashfromstepA3here
ADMIN_TOTP_SECRET=pasteyoursecretfromtheotpauthURLhere

# Site metadata
SITE_DOMAIN=athulrajpalayi.com
SERVER_IP=5.223.63.213
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

Verify it saved:

```bash
cat /var/www/athulrajpalayi/.env.production
```

---

## PART E — Server: Update the Nginx Config

```bash
nano /etc/nginx/sites-available/athulrajpalayi
```

Replace the entire file with this (preserves `/ansiya/magenta` and all Certbot lines):

```nginx
server {
    server_name athulrajpalayi.com www.athulrajpalayi.com;

    # Portfolio app — proxied to Docker container on port 3001
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_buffer_size 16k;
        proxy_buffers 8 16k;
        proxy_busy_buffers_size 32k;
    }

    # Existing app — PRESERVED, do not touch
    location = /ansiya/magenta {
        return 301 /ansiya/magenta/;
    }

    location /ansiya/magenta/ {
        proxy_pass http://127.0.0.1:5002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/athulrajpalayi.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/athulrajpalayi.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.athulrajpalayi.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = athulrajpalayi.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name athulrajpalayi.com www.athulrajpalayi.com;
    return 404; # managed by Certbot
}
```

Test and reload nginx:

```bash
nginx -t
# Must say: "syntax is ok" and "test is successful"
systemctl reload nginx
```

---

## PART F — Server: Build and Launch

```bash
cd /var/www/athulrajpalayi

# Build the image and start postgres + app (first build: 3-5 minutes)
docker compose -f docker-compose.shared-vps.yml up -d --build
```

Watch the startup sequence:

```bash
docker compose -f docker-compose.shared-vps.yml logs -f app
```

You will see (in order):
1. `prisma db push` — creates all database tables
2. `Bootstrapped admin owner: clXXXXXX` — seeds admin + all content
3. `▲ Next.js ready` — app is live

Press `Ctrl+C` to stop watching. Containers keep running.

---

## PART G — Verify

```bash
# Are both containers healthy?
docker compose -f docker-compose.shared-vps.yml ps
# Expected: both show "running", not "restarting"

# Does the app respond directly?
curl -I http://127.0.0.1:3001
# Expected: HTTP/1.1 200 OK

# Does the public site work over HTTPS?
curl -I https://athulrajpalayi.com
# Expected: HTTP/2 200

# Is the existing /ansiya/magenta still working?
curl -I https://athulrajpalayi.com/ansiya/magenta/
# Expected: same response as before
```

---

## PART H — Admin First Login

1. Open `https://athulrajpalayi.com/admin` in your browser
2. Enter email `imathulraj@gmail.com` and the password from step A3
3. Redirected to `/admin/verify-2fa` — enter the 6-digit code from Google Authenticator
4. You're in the dashboard

**First things to do in admin:**
- **Settings** → verify display name, domain, contact info
- **Content** → verify hero text seeded correctly
- **Projects** → verify 3 case studies are present

---

## PART I — Future Deploys (After First Setup)

```bash
ssh root@5.223.63.213
cd /var/www/athulrajpalayi
git pull origin main

# Rebuild only the app container (leave postgres running)
docker compose -f docker-compose.shared-vps.yml up -d --build --no-deps app
```

---

## RAM Note

Your VPS has limited RAM. After deploy, check:

```bash
free -h
# Look at the "available" column — needs to stay above 200MB
```

If memory is tight, add a 1 GB swap file (one-time):

```bash
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## Troubleshooting

**App container keeps restarting:**
```bash
docker compose -f docker-compose.shared-vps.yml logs app --tail 50
```

**Nginx returns 502 Bad Gateway:**
The app container isn't running yet or hasn't finished starting up. Wait 60–90 seconds and retry.

**Can't log into admin:**
- Wrong password → re-run `npm run admin:hash-password` locally, update `.env.production`, redeploy
- Wrong TOTP code → ensure your phone time is synced (Settings → Date & Time → Automatic)

**Force fresh database (nuclear reset):**
```bash
docker compose -f docker-compose.shared-vps.yml down
docker volume rm athulrajpalayi_postgres_data
docker compose -f docker-compose.shared-vps.yml up -d --build
```
