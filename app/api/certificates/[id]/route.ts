import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: certificate, error } = await supabase
    .from("certificates")
    .select(`
      *,
      courses(
        title,
        category,
        instructor_name,
        duration_hours
      ),
      profiles(
        full_name
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ certificate })
}
