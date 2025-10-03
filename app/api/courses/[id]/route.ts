import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: course, error } = await supabase
    .from("courses")
    .select(`
      *,
      course_modules(
        *,
        course_lessons(*)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Check if user is enrolled
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("*")
      .eq("course_id", id)
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({ course, enrollment })
  }

  return NextResponse.json({ course })
}
