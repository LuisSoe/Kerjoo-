import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get("job_id")

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let query = supabase
    .from("applications")
    .select(`
      *,
      jobs(
        id,
        title,
        category,
        company_profiles(
          company_name
        )
      ),
      worker_profiles(
        id,
        bio,
        hourly_rate,
        rating,
        profiles(
          full_name,
          avatar_url
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (jobId) {
    query = query.eq("job_id", jobId)
  } else {
    // Get applications for current user (worker or company)
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    if (profile?.user_type === "worker") {
      query = query.eq("worker_id", user.id)
    } else {
      // For companies, get applications for their jobs
      query = query.in("job_id", supabase.from("jobs").select("id").eq("company_id", user.id))
    }
  }

  const { data: applications, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ applications })
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
  const { job_id, cover_letter, proposed_rate } = body

  const { data, error } = await supabase
    .from("applications")
    .insert({
      job_id,
      worker_id: user.id,
      cover_letter,
      proposed_rate,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Increment application count on job
  await supabase.rpc("increment_job_applications", { job_id })

  return NextResponse.json({ application: data })
}
