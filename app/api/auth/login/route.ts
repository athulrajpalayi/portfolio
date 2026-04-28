import { NextResponse } from "next/server";

import { findStoredAdminUserByEmail, getAdminAuthState } from "@/lib/auth/admin-users";
import {
  createPendingTwoFactorToken,
  pendingTwoFactorCookieName,
  pendingTwoFactorCookieOptions
} from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/passwords";
import { applyRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

function getBootstrapAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

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
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const rateLimit = applyRateLimit(`login:${email}`);
  if (!rateLimit.ok) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent("Too many attempts. Try again shortly.")}`, base)
    );
  }

  const authState = await getAdminAuthState();
  if (!authState.configured) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent("Admin auth is not configured yet.")}`, base)
    );
  }

  const storedUser = await findStoredAdminUserByEmail(email);

  if (storedUser) {
    const validPassword = await verifyPassword(password, storedUser.passwordHash);

    if (!validPassword) {
      return NextResponse.redirect(
        new URL(`/admin/login?error=${encodeURIComponent("Invalid credentials.")}`, base)
      );
    }

    const pendingToken = await createPendingTwoFactorToken({
      userId: storedUser.id,
      email: storedUser.email,
      role: storedUser.role
    });
    const response = NextResponse.redirect(new URL("/admin/verify-2fa", base));
    response.cookies.set(
      pendingTwoFactorCookieName,
      pendingToken,
      pendingTwoFactorCookieOptions
    );
    return response;
  }

  if (email !== getBootstrapAdminEmail()) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent("Invalid credentials.")}`, base)
    );
  }

  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  const validPassword = await verifyPassword(password, expectedHash);

  if (!validPassword) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent("Invalid credentials.")}`, base)
    );
  }

  const pendingToken = await createPendingTwoFactorToken({
    userId: email,
    email,
    role: "OWNER"
  });
  const response = NextResponse.redirect(new URL("/admin/verify-2fa", base));
  response.cookies.set(
    pendingTwoFactorCookieName,
    pendingToken,
    pendingTwoFactorCookieOptions
  );

  return response;
}
