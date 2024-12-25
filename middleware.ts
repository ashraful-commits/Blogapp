import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  const protectedRoutes = [
    "/blogs",
    "/admin/dashboard",
    "/profile",
    "/bookmarks",
    "/create",
  ];

  // Redirect signed-in users away from the sign-in page
  if (session && pathname === "/api/auth/signin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // Proceed for all other requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/blogs/:path*",
    "/admin/dashboard/:path*",
    "/profile/:path*",
    "/bookmarks",
    "/create",
    "/api/auth/signin",
  ],
};
