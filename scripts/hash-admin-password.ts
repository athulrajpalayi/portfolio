import { hashPassword } from "../lib/auth/passwords";

async function main() {
  const password = process.argv[2];

  if (!password) {
    throw new Error("Usage: npm run admin:hash-password -- \"YourStrongPassword\"");
  }

  const hash = await hashPassword(password);
  console.log(hash);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
