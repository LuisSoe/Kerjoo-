import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: enrollment, error } = await supabase
    .from("course_enrollments")
    .select(`
      *,
      courses(
        *,
        course_modules(
          *,
          course_lessons(*)
        )
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get lesson progress
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("enrollment_id", id)
    .eq("user_id", user.id)

  return NextResponse.json({ enrollment, progress })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { progress, completed } = body

  const updateData: any = {}
  if (progress !== undefined) updateData.progress = progress
  if (completed !== undefined) {
    updateData.completed = completed
    if (completed) {
      updateData.completed_at = new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from("course_enrollments")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If completed, generate certificate
  if (completed && !data.completed_at) {
    const { data: certificate } = await supabase
      .from("certificates")
      .insert({
        enrollment_id: id,
        user_id: user.id,
        course_id: data.course_id,
      })
      .select()
      .single()

    return NextResponse.json({ enrollment: data, certificate })
  }

  return NextResponse.json({ enrollment: data })
}
