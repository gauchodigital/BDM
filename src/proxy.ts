import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Auth de admin + evita que la CDN cachee respuestas de /admin como HTML. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("admin-session");
    const token = process.env.ADMIN_TOKEN;

    if (!token || !session || session.value !== token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const response = NextResponse.next();

  if (pathname.startsWith("/admin")) {
    response.headers.set(
      "Cache-Control",
      "private, no-store, no-cache, max-age=0, must-revalidate",
    );
    response.headers.set("CDN-Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
