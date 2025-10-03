import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get("category")
  const level = searchParams.get("level")
  const search = searchParams.get("search")

  let query = supabase.from("courses").select("*").eq("status", "published").order("created_at", { ascending: false })

  if (category) {
    query = query.eq("category", category)
  }
  if (level) {
    query = query.eq("level", level)
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data: courses, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ courses })
}
