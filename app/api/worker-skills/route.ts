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

  const { data: workerSkills, error } = await supabase
    .from("worker_skills")
    .select(
      `
      *,
      skills(*)
    `,
    )
    .eq("worker_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ workerSkills })
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
  const { skill_id, proficiency_level, years_experience } = body

  const { data, error } = await supabase
    .from("worker_skills")
    .insert({
      worker_id: user.id,
      skill_id,
      proficiency_level,
      years_experience,
    })
    .select(
      `
      *,
      skills(*)
    `,
    )
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ workerSkill: data })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const skillId = searchParams.get("skill_id")

  if (!skillId) {
    return NextResponse.json({ error: "Skill ID required" }, { status: 400 })
  }

  const { error } = await supabase.from("worker_skills").delete().eq("worker_id", user.id).eq("skill_id", skillId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
