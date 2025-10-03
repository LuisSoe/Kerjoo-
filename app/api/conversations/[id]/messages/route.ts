import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get("limit") || "50"

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("conversation_id", id)
    .order("created_at", { ascending: false })
    .limit(Number.parseInt(limit))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ messages: messages.reverse() })
}

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
  const { content } = body

  // Create message
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: id,
      sender_id: user.id,
      content,
      read: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update conversation last_message_at
  await supabase
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
    })
    .eq("id", id)

  // Get conversation to find recipient
  const { data: conversation } = await supabase.from("conversations").select("*").eq("id", id).single()

  if (conversation) {
    const recipientId = conversation.participant_1 === user.id ? conversation.participant_2 : conversation.participant_1

    // Create notification for recipient
    await supabase.from("notifications").insert({
      user_id: recipientId,
      type: "message",
      title: "Pesan Baru",
      content: content.substring(0, 100),
      link: `/messages/${id}`,
      read: false,
    })
  }

  return NextResponse.json({ message })
}
