import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("course_id", id)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: "Already enrolled" }, { status: 400 })
  }

  // Create enrollment
  const { data: enrollment, error } = await supabase
    .from("course_enrollments")
    .insert({
      course_id: id,
      user_id: user.id,
      progress: 0,
      completed: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Increment course enrollment count
  await supabase.rpc("increment_course_enrollments", { course_id: id })

  return NextResponse.json({ enrollment })
}
