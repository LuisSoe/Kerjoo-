import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const status = searchParams.get("status")
  const limit = searchParams.get("limit") || "50"

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let query = supabase
    .from("transactions")
    .select(`
      *,
      projects(
        title
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(Number.parseInt(limit))

  if (type) {
    query = query.eq("type", type)
  }
  if (status) {
    query = query.eq("status", status)
  }

  const { data: transactions, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ transactions })
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
  const { type, amount, description, project_id, reference_id } = body

  // Get wallet
  const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single()

  if (!wallet) {
    return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
  }

  // Create transaction
  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert({
      wallet_id: wallet.id,
      user_id: user.id,
      type,
      amount,
      description,
      project_id,
      reference_id,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ transaction })
}
