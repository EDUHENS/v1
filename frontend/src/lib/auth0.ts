// src/lib/auth0.ts
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";

// Customize the Auth0 client to gracefully handle callback errors
// e.g., when the user cancels at the IdP and Auth0 redirects back with error=access_denied
export const auth0 = new Auth0Client({
  // Reason: Request API tokens for the backend by default so /api/auth/access-token
  // returns a token the backend accepts (audience must match backend's expected audience).
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: process.env.AUTH0_SCOPE || "openid profile email offline_access",
  },
  routes: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    callback: "/api/auth/callback",
    profile: "/api/auth/me",
    accessToken: "/api/auth/access-token",
  },
  onCallback: async (error, ctx) => {
    const baseUrl = process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL || "http://localhost:3000";
    const safeReturnTo = ctx?.returnTo || "/dashboard-selection";
    console.info("[Auth0] onCallback invoked", {
      hasError: Boolean(error),
      safeReturnTo,
      baseUrl,
    });

    if (error) {
      const reason = ("cause" in error && (error as any).cause?.code) || error.code || "access_denied";
      console.error("[Auth0] onCallback error", { reason });
      const url = new URL("/", baseUrl);
      url.searchParams.set("returnTo", safeReturnTo);
      url.searchParams.set("authError", String(reason));
      console.info("[Auth0] redirecting due to error", url.toString());
      return NextResponse.redirect(url);
    }

    const url = new URL("/", baseUrl);
    if (safeReturnTo && safeReturnTo !== "/dashboard-selection") {
      url.searchParams.set("returnTo", safeReturnTo);
    }
    url.searchParams.set("_auth", "1");
    console.info("[Auth0] successful callback redirect", url.toString());
    return NextResponse.redirect(url);
  },
});
