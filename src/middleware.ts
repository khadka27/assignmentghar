import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/pricing",
    "/blog",
    "/testimonials",
    "/privacy",
    "/robots.txt",
    "/sitemap.xml",
  ];

  // Admin-only routes - completely separate from student site
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Student-only routes - admins should not access these
  const studentRoutes = ["/chat", "/submit"];
  const isStudentRoute = studentRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Allow API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If not logged in and trying to access protected route, redirect to login
  if (!session && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in, enforce strict role-based separation
  if (session?.user) {
    const userRole = session.user.role;

    // ADMIN trying to access student routes → block
    if (userRole === "ADMIN" && isStudentRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // STUDENT trying to access admin routes → block
    if (userRole === "STUDENT" && isAdminRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect from login page if already logged in
    if (pathname === "/login" || pathname === "/register") {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
