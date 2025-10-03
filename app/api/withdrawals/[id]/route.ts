import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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
  const { status, admin_notes } = body

  // Get withdrawal request
  const { data: withdrawal, error: wdError } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .eq("id", id)
    .single()

  if (wdError || !withdrawal) {
    return NextResponse.json({ error: "Withdrawal request not found" }, { status: 404 })
  }

  // Update withdrawal status
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .update({
      status,
      admin_notes,
      processed_at: status === "completed" || status === "rejected" ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update wallet and transaction based on status
  const { data: wallet } = await supabase.from("wallets").select("*").eq("id", withdrawal.wallet_id).single()

  if (wallet) {
    if (status === "completed") {
      // Move from pending to completed
      await supabase
        .from("wallets")
        .update({
          pending_balance: Number.parseFloat(wallet.pending_balance) - Number.parseFloat(withdrawal.amount),
          updated_at: new Date().toISOString(),
        })
        .eq("id", wallet.id)

      // Update transaction to completed
      await supabase
        .from("transactions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("reference_id", withdrawal.id)
        .eq("type", "withdrawal")
    } else if (status === "rejected") {
      // Return balance from pending to available
      await supabase
        .from("wallets")
        .update({
          available_balance: Number.parseFloat(wallet.available_balance) + Number.parseFloat(withdrawal.amount),
          pending_balance: Number.parseFloat(wallet.pending_balance) - Number.parseFloat(withdrawal.amount),
          updated_at: new Date().toISOString(),
        })
        .eq("id", wallet.id)

      // Update transaction to failed
      await supabase
        .from("transactions")
        .update({
          status: "failed",
        })
        .eq("reference_id", withdrawal.id)
        .eq("type", "withdrawal")
    }
  }

  return NextResponse.json({ withdrawal: data })
}
