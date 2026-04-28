import { createTotpSetup } from "../lib/auth/totp";

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL || "owner@athulrajpalayi.com";
  const setup = createTotpSetup(email);

  console.log(`SECRET=${setup.secret}`);
  console.log(`OTPAUTH_URL=${setup.otpauthUrl}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
