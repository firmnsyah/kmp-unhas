import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.includes("/dashboard");
}

export async function middleware(request: NextRequest) {
  // 1) Routing locale (next-intl) menghasilkan response dasar.
  const response = handleI18n(request);
  const pathname = request.nextUrl.pathname;

  // 2) Tanpa Supabase, dashboard tidak bisa dipakai → arahkan ke login.
  if (!url || !anonKey) {
    if (isDashboardPath(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  // 3) Refresh sesi Supabase (tulis cookie ke response yang sama).
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) =>
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        ),
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4) Proteksi dashboard: wajib login. Gate per-role ditangani layout dashboard.
  if (isDashboardPath(pathname) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  // Lewati API, callback auth, internal Next.js, dan file statis (mengandung titik)
  matcher: "/((?!api|auth|_next|_vercel|.*\\..*).*)",
};
