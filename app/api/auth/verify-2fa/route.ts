import { NextResponse } from "next/server";

import { findStoredAdminUserByEmail } from "@/lib/auth/admin-users";
import {
  adminSessionCookieName,
  adminSessionCookieOptions,
  createAdminSessionToken,
  pendingTwoFactorCookieName,
  verifySessionToken
} from "@/lib/auth/session";
import { verifyTotpToken } from "@/lib/auth/totp";
import { getPrismaClient, isDatabaseConfigured } from "@/lib/db/prisma";
import { applyRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

function getRequestBase(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  const base = getRequestBase(request);
  const url = new URL(request.url);
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "").trim();
  const cookieHeader = request.headers.get("cookie") ?? "";
  const pendingCookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${pendingTwoFactorCookieName}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  const rateLimit = applyRateLimit("verify-2fa");
  if (!rateLimit.ok) {
    return NextResponse.redirect(
      new URL(`/admin/verify-2fa?error=${encodeURIComponent("Too many verification attempts.")}`, base)
    );
  }

  if (!pendingCookie) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent("Login session expired. Start again.")}`, base)
    );
  }

  const pendingPayload = await verifySessionToken(pendingCookie);
  if (!pendingPayload?.sub || pendingPayload.kind !== "pending-2fa") {
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent("Login session expired. Start again.")}`, base)
    );
  }

  const storedUser = await findStoredAdminUserByEmail(String(pendingPayload.email ?? ""));
  const secret = storedUser?.twoFactor?.secret ?? process.env.ADMIN_TOTP_SECRET ?? "";
  const validToken = await verifyTotpToken(secret, token);

  if (!validToken) {
    return NextResponse.redirect(
      new URL(`/admin/verify-2fa?error=${encodeURIComponent("Invalid authenticator code.")}`, base)
    );
  }

  const sessionRecord =
    storedUser && isDatabaseConfigured()
      ? await getPrismaClient().session.create({
          data: {
            token: crypto.randomUUID(),
            userId: storedUser.id,
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
          }
        })
      : null;

  const sessionToken = await createAdminSessionToken({
    userId: String(pendingPayload.sub),
    email: String(pendingPayload.email ?? ""),
    role: String(pendingPayload.role ?? "OWNER"),
    sessionId: sessionRecord?.id
  });
  const response = NextResponse.redirect(new URL("/admin/dashboard", base));
  response.cookies.set(adminSessionCookieName, sessionToken, adminSessionCookieOptions);
  response.cookies.delete(pendingTwoFactorCookieName);

  return response;
}
