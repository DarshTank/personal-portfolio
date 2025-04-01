import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/sign-in", "/sign-up", "/verify-email", "/forgot-password", "/reset-password"];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // If accessing a public path and has token, redirect to dashboard
  if (isPublicPath && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      // Token is invalid, continue to public path
    }
  }

  // If accessing a protected path and no token, redirect to sign-in
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If accessing a protected path and has token, verify it
  if (!isPublicPath && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.next();
    } catch (error) {
      // Token is invalid, redirect to sign-in
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 