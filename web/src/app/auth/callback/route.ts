import { getServerSupabase } from "@/shared/lib/supabase-server";
import { NextResponse } from "next/server";

// Callback Google OAuth (user publik): tukar code → sesi, lalu kembali.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await getServerSupabase();
    if (supabase) await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/"}`);
}
