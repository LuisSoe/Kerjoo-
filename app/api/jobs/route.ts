import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get("category")
  const jobType = searchParams.get("job_type")
  const experienceLevel = searchParams.get("experience_level")
  const search = searchParams.get("search")

  let query = supabase
    .from("jobs")
    .select(`
      *,
      company_profiles(
        id,
        company_name,
        location,
        verified
      )
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false })

  if (category) {
    query = query.eq("category", category)
  }
  if (jobType) {
    query = query.eq("job_type", jobType)
  }
  if (experienceLevel) {
    query = query.eq("experience_level", experienceLevel)
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data: jobs, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ jobs })
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
  const {
    title,
    description,
    category,
    job_type,
    experience_level,
    budget_min,
    budget_max,
    location,
    remote_allowed,
    deadline,
    required_skills,
  } = body

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      company_id: user.id,
      title,
      description,
      category,
      job_type,
      experience_level,
      budget_min,
      budget_max,
      location,
      remote_allowed,
      deadline,
      required_skills,
      status: "open",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ job: data })
}
