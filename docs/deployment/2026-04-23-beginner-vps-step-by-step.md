# Friendly VPS Deployment Guide

This guide is written for the exact portfolio project in this folder.

You already said:

- the domain is already pointed
- you are about to SSH into the server

So this guide starts from there.

Target:

- domain: `athulrajpalayi.com`
- server IP: `5.223.63.213`
- stack: `Next.js + PostgreSQL + Docker + Caddy`

If your VPS already hosts other websites with `nginx`, use the shared-VPS path instead of the Caddy path. In that mode the portfolio app runs on `127.0.0.1:3001` and your existing `nginx` forwards the domain to it.

## The simple idea

We are going to do this in order:

1. SSH into the server
2. Install Docker
3. Upload the project files
4. Create the production settings file
5. Generate your secure admin values
6. Start the app
7. Open the site in the browser
8. Log into the admin panel

If you follow this carefully, you do not need to understand every technical detail.

## Before you start

You need these ready:

- your SSH login for the VPS
- your project folder on your PC
- your final admin email
- one strong password you want to use for the admin login

Recommended admin email:

- `owner@athulrajpalayi.com`

Recommended:

- keep one text file or note open while doing this
- paste temporary values there while setting things up

## Step 1: SSH into the server

From Windows, you can use:

- `PuTTY`
- Windows Terminal with `ssh`

If using Windows Terminal:

```bash
ssh root@5.223.63.213
```

If your VPS username is not `root`, replace it with your real username.

When you connect successfully, you should see something like a Linux command line.

Example:

```bash
root@server-name:~#
```

If SSH does not connect:

- check your VPS username
- check your password
- make sure the VPS is running

## Step 2: Confirm the domain is reaching the server

Run this on the server:

```bash
hostname -I
```

You should see the server IP.

Then from your own browser, open:

- `http://athulrajpalayi.com`

It may not show the site yet, and that is fine.
Right now we only care that the domain is pointed correctly.

## Step 3: Update the server and install Docker

Copy and run these commands one by one:

```bash
apt update
apt upgrade -y
apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker --version
docker compose version
```

What success looks like:

- `docker --version` prints a version
- `docker compose version` prints a version

If that happens, Docker is ready.

## Step 4: Open ports if firewall is enabled

Run:

```bash
ufw status
```

If it says firewall is active, allow web traffic:

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw reload
ufw status
```

We need:

- `22` for SSH
- `80` for normal web traffic
- `443` for secure HTTPS

## Step 5: Create the project folder on the server

Run:

```bash
mkdir -p /var/www/athulrajpalayi
cd /var/www/athulrajpalayi
pwd
```

The last command should show:

```bash
/var/www/athulrajpalayi
```

## Step 6: Upload the project files from your PC

### Easiest method: WinSCP

Use `WinSCP` if possible. It is the easiest for beginners.

1. Open `WinSCP`
2. Connect to your server using:
   - Host: `5.223.63.213`
   - Username: your VPS username
   - Password: your VPS password
3. On the server side, open:
   `/var/www/athulrajpalayi`
4. On the local side, open your project folder:
   `C:\Users\USER\Music\Main Project\Portfolio 26`
5. Upload everything except `node_modules`

Important:

- upload the project files into `/var/www/athulrajpalayi`
- do not upload `node_modules`
- if there is a `.next` folder locally, you can skip that too

### After upload, verify on the server

Back in SSH, run:

```bash
cd /var/www/athulrajpalayi
ls
```

You should see things like:

- `app`
- `components`
- `lib`
- `prisma`
- `package.json`
- `docker-compose.prod.yml`
- `Dockerfile`
- `Caddyfile`

## Step 7: Create the production environment file

Run:

```bash
cd /var/www/athulrajpalayi
nano .env.production
```

Paste this exact template:

```env
NODE_ENV=production
PORT=3000
POSTGRES_PASSWORD=CHANGE_THIS_TO_A_STRONG_DATABASE_PASSWORD
DATABASE_URL=postgresql://portfolio_admin:CHANGE_THIS_TO_A_STRONG_DATABASE_PASSWORD@postgres:5432/portfolio26?schema=public
SESSION_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET
ADMIN_EMAIL=owner@athulrajpalayi.com
ADMIN_DISPLAY_NAME=Athulraj Palayi
ADMIN_PASSWORD_HASH=
ADMIN_TOTP_SECRET=
SITE_DOMAIN=athulrajpalayi.com
SERVER_IP=5.223.63.213
```

Do not save it yet if you still need the password hash and TOTP secret.

## Step 8: Generate secure values

We need four secure values:

1. `POSTGRES_PASSWORD`
2. `SESSION_SECRET`
3. `ADMIN_PASSWORD_HASH`
4. `ADMIN_TOTP_SECRET`

### 8A. Generate a database password

Run:

```bash
openssl rand -base64 24
```

Copy the output.
Use that as `POSTGRES_PASSWORD`.

### 8B. Generate a session secret

Run:

```bash
openssl rand -base64 48
```

Copy the output.
Use that as `SESSION_SECRET`.

### 8C. Generate the admin password hash

We will use the helper already included in this project.

Run:

```bash
cd /var/www/athulrajpalayi
docker run --rm -it -v $(pwd):/app -w /app node:22-alpine sh
```

Now you are inside a temporary container.

Run:

```bash
npm install
npm run admin:hash-password -- "YOUR-VERY-STRONG-ADMIN-PASSWORD"
```

Example:

```bash
npm run admin:hash-password -- "AthulrajSuperSafe2026!"
```

Copy the full output hash.
That becomes `ADMIN_PASSWORD_HASH`.

### 8D. Generate the admin 2FA secret

Still inside that same temporary container, run:

```bash
npm run admin:totp -- owner@athulrajpalayi.com
```

You will get output like:

```bash
SECRET=XXXXXXX
OTPAUTH_URL=otpauth://...
```

Copy the `SECRET=` value.
That becomes `ADMIN_TOTP_SECRET`.

Important:

- also copy the `OTPAUTH_URL`
- you may want it later to set up Google Authenticator, Microsoft Authenticator, or another authenticator app

The easiest setup method is manual:

1. Open your authenticator app
2. Choose `Enter setup key` or `Manual setup`
3. Account name: `Athulraj Portfolio Admin`
4. Secret key: paste the `SECRET=` value
5. Type: `Time based`

Then exit the temporary container:

```bash
exit
```

## Step 9: Fill in `.env.production`

Open the file again:

```bash
cd /var/www/athulrajpalayi
nano .env.production
```

Now replace:

- `POSTGRES_PASSWORD`
- `SESSION_SECRET`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_TOTP_SECRET`

Very important:

The password inside `DATABASE_URL` must match `POSTGRES_PASSWORD`.

So if your database password becomes:

```env
POSTGRES_PASSWORD=abc123456XYZ
```

Then `DATABASE_URL` must also contain:

```env
postgresql://portfolio_admin:abc123456XYZ@postgres:5432/portfolio26?schema=public
```

### Save the file in nano

1. Press `Ctrl + O`
2. Press `Enter`
3. Press `Ctrl + X`

## Step 10: Start the project

Run:

```bash
cd /var/www/athulrajpalayi
docker compose -f docker-compose.prod.yml up -d --build
```

This may take a few minutes the first time.

What it does:

- starts PostgreSQL
- builds the app
- pushes the database schema
- creates the first admin user
- starts the website
- starts Caddy for HTTPS

## Step 11: Check if everything started

Run:

```bash
docker compose -f docker-compose.prod.yml ps
```

You want to see these services running:

- `postgres`
- `app`
- `caddy`

Then run:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100
```

If you want live logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

Press `Ctrl + C` to stop watching logs.

## Step 12: Open the site

Now try in your browser:

- `http://athulrajpalayi.com`
- `https://athulrajpalayi.com`
- `https://www.athulrajpalayi.com`

Usually:

- HTTP may open first
- HTTPS may take a little longer the first time because Caddy is creating SSL automatically

If HTTPS does not work immediately:

- wait 2 to 5 minutes
- try again

## Step 13: Open the admin panel

Go to:

- `https://athulrajpalayi.com/admin/login`

Login with:

- email: your `ADMIN_EMAIL`
- password: the real password you chose
- 2FA code: from your authenticator app

If you have not yet added the account to your authenticator app, use the `OTPAUTH_URL` you saved when generating the TOTP secret.

## Step 14: Replace placeholder content after first login

Once login works, do these next:

1. Update contact email, WhatsApp, and LinkedIn
2. Update site settings if needed
3. Replace the placeholder resume file with your real PDF
4. Review projects and polish wording

## Step 15: Replace the resume file later

Right now the project uses a placeholder resume file.

Later you will replace:

- the placeholder file in `public`
- or the resume path through admin settings if you want to change the public target

If you want, I can guide you through that separately after the server is live.

## How to update the site in the future

When you make changes on your computer later:

1. Upload the changed files again to `/var/www/athulrajpalayi`
2. Run:

```bash
cd /var/www/athulrajpalayi
docker compose -f docker-compose.prod.yml up -d --build
```

That rebuilds and restarts the live app.

## Useful commands

See running containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

Restart everything:

```bash
docker compose -f docker-compose.prod.yml restart
```

Rebuild after changes:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Stop everything:

```bash
docker compose -f docker-compose.prod.yml down
```

Watch logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

## If something goes wrong

### Problem: website does not open

Check:

- the domain still points to `5.223.63.213`
- `docker compose -f docker-compose.prod.yml ps`
- ports `80` and `443` are open

### Problem: admin login fails

Check:

- `ADMIN_EMAIL` is correct
- `ADMIN_PASSWORD_HASH` is correct
- `ADMIN_TOTP_SECRET` is correct
- the authenticator app is using the correct account

### Problem: app container failed

Run:

```bash
docker compose -f docker-compose.prod.yml logs app --tail=100
```

### Problem: Caddy failed

Run:

```bash
docker compose -f docker-compose.prod.yml logs caddy --tail=100
```

### Problem: database failed

Run:

```bash
docker compose -f docker-compose.prod.yml logs postgres --tail=100
```

## Very important safety notes

- do not share `.env.production`
- do not share your admin password
- do not share the TOTP secret
- do not share the session secret
- do not share the database password

## Best next move

If you are literally about to SSH into the server now, the smoothest path is:

1. SSH in
2. Install Docker
3. Upload the project
4. Create `.env.production`
5. Generate the secure values
6. Start the stack

Then message me with:

- what command you are on
- what output you got

and I can guide you step by step without you guessing.
