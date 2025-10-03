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

  const body = await request.json()
  const { enrollment_id, completed } = body

  // Check if progress already exists
  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("enrollment_id", enrollment_id)
    .eq("lesson_id", id)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    // Update existing progress
    const { data, error } = await supabase
      .from("lesson_progress")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update enrollment progress
    await updateEnrollmentProgress(supabase, enrollment_id, user.id)

    return NextResponse.json({ progress: data })
  }

  // Create new progress
  const { data, error } = await supabase
    .from("lesson_progress")
    .insert({
      enrollment_id,
      lesson_id: id,
      user_id: user.id,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update enrollment progress
  await updateEnrollmentProgress(supabase, enrollment_id, user.id)

  return NextResponse.json({ progress: data })
}

async function updateEnrollmentProgress(supabase: any, enrollmentId: string, userId: string) {
  // Get enrollment with course data
  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select(`
      *,
      courses(
        course_modules(
          course_lessons(id)
        )
      )
    `)
    .eq("id", enrollmentId)
    .eq("user_id", userId)
    .single()

  if (!enrollment) return

  // Count total lessons
  let totalLessons = 0
  enrollment.courses.course_modules.forEach((module: any) => {
    totalLessons += module.course_lessons.length
  })

  // Count completed lessons
  const { count: completedCount } = await supabase
    .from("lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("enrollment_id", enrollmentId)
    .eq("user_id", userId)
    .eq("completed", true)

  // Calculate progress percentage
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // Update enrollment
  await supabase
    .from("course_enrollments")
    .update({
      progress,
      completed: progress === 100,
      completed_at: progress === 100 ? new Date().toISOString() : null,
    })
    .eq("id", enrollmentId)
}
