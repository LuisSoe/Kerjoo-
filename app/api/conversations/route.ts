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

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(`
      *,
      participant_1_profile:profiles!conversations_participant_1_fkey(
        id,
        full_name,
        avatar_url,
        user_type
      ),
      participant_2_profile:profiles!conversations_participant_2_fkey(
        id,
        full_name,
        avatar_url,
        user_type
      ),
      projects(
        id,
        title
      )
    `)
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order("last_message_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ conversations })
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
  const { participant_id, project_id } = body

  // Check if conversation already exists
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .or(
      `and(participant_1.eq.${user.id},participant_2.eq.${participant_id}),and(participant_1.eq.${participant_id},participant_2.eq.${user.id})`,
    )
    .single()

  if (existing) {
    return NextResponse.json({ conversation: existing })
  }

  // Create new conversation
  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({
      participant_1: user.id,
      participant_2: participant_id,
      project_id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ conversation })
}
