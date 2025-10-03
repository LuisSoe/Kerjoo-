import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get user type to determine which projects to fetch
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  let query = supabase
    .from("projects")
    .select(`
      *,
      company_profiles(
        company_name,
        profiles(
          full_name,
          avatar_url
        )
      ),
      worker_profiles(
        profiles(
          full_name,
          avatar_url
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (profile?.user_type === "worker") {
    query = query.eq("worker_id", user.id)
  } else {
    query = query.eq("company_id", user.id)
  }

  const { data: projects, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { job_id, worker_id, title, description, budget, deadline } = body

  const { data, error } = await supabase
    .from("projects")
    .insert({
      job_id,
      company_id: user.id,
      worker_id,
      title,
      description,
      budget,
      deadline,
      status: "active",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ project: data })
}
