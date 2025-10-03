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

  const { data: withdrawals, error } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ withdrawals })
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
  const { amount, bank_name, account_number, account_holder } = body

  // Get wallet
  const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single()

  if (!wallet) {
    return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
  }

  // Check if user has enough balance
  if (Number.parseFloat(wallet.available_balance) < Number.parseFloat(amount)) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
  }

  // Create withdrawal request
  const { data: withdrawal, error } = await supabase
    .from("withdrawal_requests")
    .insert({
      user_id: user.id,
      wallet_id: wallet.id,
      amount,
      bank_name,
      account_number,
      account_holder,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update wallet to move balance to pending
  await supabase
    .from("wallets")
    .update({
      available_balance: Number.parseFloat(wallet.available_balance) - Number.parseFloat(amount),
      pending_balance: Number.parseFloat(wallet.pending_balance) + Number.parseFloat(amount),
      updated_at: new Date().toISOString(),
    })
    .eq("id", wallet.id)

  // Create transaction record
  await supabase.from("transactions").insert({
    wallet_id: wallet.id,
    user_id: user.id,
    type: "withdrawal",
    amount,
    status: "pending",
    description: `Penarikan ke ${bank_name} - ${account_number}`,
    reference_id: withdrawal.id,
  })

  return NextResponse.json({ withdrawal })
}
