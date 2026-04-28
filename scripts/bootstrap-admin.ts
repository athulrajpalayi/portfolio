import { bootstrapPortfolioPlatform } from "../lib/admin/bootstrap";
import { isDatabaseConfigured } from "../lib/db/prisma";

function requireEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL must be configured before bootstrapping the admin owner.");
  }

  const owner = await bootstrapPortfolioPlatform({
    email: requireEnv("ADMIN_EMAIL"),
    displayName: process.env.ADMIN_DISPLAY_NAME?.trim() || "Athulraj Palayi",
    passwordHash: requireEnv("ADMIN_PASSWORD_HASH"),
    totpSecret: requireEnv("ADMIN_TOTP_SECRET"),
    domain: process.env.SITE_DOMAIN?.trim() || "athulrajpalayi.com",
    serverIp: process.env.SERVER_IP?.trim() || "5.223.63.213"
  });

  console.log(`Bootstrapped admin owner: ${owner.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
