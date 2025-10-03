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

  // Get transaction
  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (txError || !transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
  }

  // Update transaction status
  const { error: updateError } = await supabase
    .from("transactions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Update wallet balance based on transaction type
  const { data: wallet } = await supabase.from("wallets").select("*").eq("id", transaction.wallet_id).single()

  if (wallet) {
    let updates: any = {}

    if (transaction.type === "earning" || transaction.type === "bonus" || transaction.type === "refund") {
      updates = {
        balance: Number.parseFloat(wallet.balance) + Number.parseFloat(transaction.amount),
        available_balance: Number.parseFloat(wallet.available_balance) + Number.parseFloat(transaction.amount),
        total_earned: Number.parseFloat(wallet.total_earned) + Number.parseFloat(transaction.amount),
      }
    } else if (transaction.type === "withdrawal") {
      updates = {
        balance: Number.parseFloat(wallet.balance) - Number.parseFloat(transaction.amount),
        total_withdrawn: Number.parseFloat(wallet.total_withdrawn) + Number.parseFloat(transaction.amount),
      }
    }

    await supabase
      .from("wallets")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", wallet.id)
  }

  return NextResponse.json({ success: true })
}
