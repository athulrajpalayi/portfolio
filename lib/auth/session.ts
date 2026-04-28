import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const adminSessionCookieName = "portfolio_admin_session";
export const pendingTwoFactorCookieName = "portfolio_admin_pending";

const encoder = new TextEncoder();

type TokenKind = "admin-session" | "pending-2fa";

type AdminTokenPayload = JWTPayload & {
  kind: TokenKind;
  email: string;
  role: string;
  sid?: string;
};

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "development-session-secret-change-me";
}

async function signToken(payload: AdminTokenPayload, expiresIn: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encoder.encode(getSessionSecret()));
}

export async function createAdminSessionToken(input: {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
}) {
  return signToken(
    {
      sub: input.userId,
      email: input.email,
      role: input.role,
      sid: input.sessionId,
      kind: "admin-session"
    },
    "12h"
  );
}

export async function createPendingTwoFactorToken(input: {
  userId: string;
  email: string;
  role: string;
}) {
  return signToken(
    {
      sub: input.userId,
      email: input.email,
      role: input.role,
      kind: "pending-2fa"
    },
    "10m"
  );
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(getSessionSecret()));
    return payload as AdminTokenPayload | null;
  } catch {
    return null;
  }
}

export const adminSessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 12
};

export const pendingTwoFactorCookieOptions = {
  ...adminSessionCookieOptions,
  maxAge: 60 * 10
};
