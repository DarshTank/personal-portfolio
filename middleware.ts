import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/sign-in",
    },
  }
);

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    // Add other protected routes here
  ],
};