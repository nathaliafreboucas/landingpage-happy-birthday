import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and its API
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/set-session")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Quick expiry check (HMAC is fully verified inside API routes)
    const dot = token.indexOf(".");
    if (dot === -1) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const exp = parseInt(token.slice(0, dot), 10);
    if (isNaN(exp) || Date.now() > exp) {
      const res = NextResponse.redirect(new URL("/admin/login", request.url));
      res.cookies.delete("admin_session");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
