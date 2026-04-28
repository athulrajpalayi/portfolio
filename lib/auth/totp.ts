import { generateSecret, generateURI, verify } from "otplib";

const issuer = "Athulraj Portfolio Admin";

export function createTotpSetup(email: string) {
  const secret = generateSecret();

  return {
    secret,
    issuer,
    otpauthUrl: generateURI({
      secret,
      issuer,
      label: email
    })
  };
}

export function verifyTotpToken(secret: string, token: string) {
  return verify({ secret, token }).then((result) => result.valid);
}
