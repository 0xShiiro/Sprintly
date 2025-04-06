import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
]);

export default clerkMiddleware((auth,req)=>{
  
    if (!auth().userId && isProtectedRoute(req)) {
      return auth().redirectToSignIn();
    }

    if(
      auth().userId &&
      !auth().orgId &&
      req.nextUrl.pathname !== "/onboarding" &&
      req.nextUrl.pathname !== "/"
    ){
      return NextResponse.redirect(new URL("/onboarding",req.url));
    }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
