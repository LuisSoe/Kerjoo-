import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Get user profile to determine redirect
      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", data.user.id).single()

      const redirectUrl =
        profile?.user_type === "company" ? `${origin}/dashboard/company` : `${origin}/dashboard/worker`

      return NextResponse.redirect(redirectUrl)
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(`${origin}/login`)
}
