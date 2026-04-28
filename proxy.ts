import { NextResponse, type NextRequest } from "next/server";

import { adminSessionCookieName, verifySessionToken } from "@/lib/auth/session";

const publicAdminRoutes = new Set(["/admin/login", "/admin/verify-2fa"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (publicAdminRoutes.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(adminSessionCookieName)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const payload = await verifySessionToken(token);

  if (!payload || payload.kind !== "admin-session") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
