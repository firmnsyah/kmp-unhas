import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18n(request);
}

export const config = {
  // Lewati health check, API, callback auth, internal Next.js, dan file statis.
  matcher: "/((?!api|auth|health|_next|_vercel|.*\\..*).*)",
};
