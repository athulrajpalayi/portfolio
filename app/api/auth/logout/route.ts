import { NextResponse } from "next/server";

import {
  adminSessionCookieName,
  pendingTwoFactorCookieName,
  verifySessionToken
} from "@/lib/auth/session";
import { runOptionalDatabaseQuery } from "@/lib/db/prisma";

export const runtime = "nodejs";

function getRequestBase(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  const base = getRequestBase(request);
  const sessionCookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminSessionCookieName}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  const payload = sessionCookie ? await verifySessionToken(sessionCookie) : null;

  if (payload?.sid) {
    await runOptionalDatabaseQuery((db) =>
      db.session.deleteMany({
        where: {
          id: payload.sid
        }
      })
    );
  }

  const response = NextResponse.redirect(new URL("/admin/login", base));
  response.cookies.delete(adminSessionCookieName);
  response.cookies.delete(pendingTwoFactorCookieName);
  return response;
}
