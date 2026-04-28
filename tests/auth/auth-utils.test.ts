import { hashPassword, verifyPassword } from "@/lib/auth/passwords";
import { createTotpSetup } from "@/lib/auth/totp";

describe("auth utils", () => {
  test("hashes and verifies admin passwords", async () => {
    const hash = await hashPassword("StrongPassword!234");
    await expect(verifyPassword("StrongPassword!234", hash)).resolves.toBe(
      true
    );
  });

  test("creates a valid TOTP setup descriptor", () => {
    const setup = createTotpSetup("owner@example.com");
    expect(setup.otpauthUrl).toContain("otpauth://");
  });
});
