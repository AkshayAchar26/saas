import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home",
]);

const isPublicApi = createRouteMatcher(["/api/public-videos"]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);
  const isAccessingHomeRoute = currentUrl.pathname === "/home";
  const isAccessingApi = currentUrl.pathname.startsWith("/api");

  // user is logged-in and trying to access sign-in or sign-up page
  if (userId && isPublicRoute(req) && !isAccessingHomeRoute) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // user is not logged-in
  if (!userId) {
    // trying to access protected routes and protected api (social-share,user-videos,video-upload,/api/user-videos)
    if (!isPublicRoute(req) && !isPublicApi(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isAccessingApi && !isPublicApi(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (currentUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
