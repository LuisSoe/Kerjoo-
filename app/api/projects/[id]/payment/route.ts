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
  const { amount, milestone_id } = body

  // Get project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("company_id", user.id)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  // Get worker wallet
  const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", project.worker_id).single()

  if (!wallet) {
    return NextResponse.json({ error: "Worker wallet not found" }, { status: 404 })
  }

  // Create transaction for worker
  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .insert({
      wallet_id: wallet.id,
      user_id: project.worker_id,
      type: "earning",
      amount,
      status: "completed",
      description: `Pembayaran untuk proyek: ${project.title}`,
      project_id: id,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (txError) {
    return NextResponse.json({ error: txError.message }, { status: 500 })
  }

  // Update wallet balance
  await supabase
    .from("wallets")
    .update({
      balance: Number.parseFloat(wallet.balance) + Number.parseFloat(amount),
      available_balance: Number.parseFloat(wallet.available_balance) + Number.parseFloat(amount),
      total_earned: Number.parseFloat(wallet.total_earned) + Number.parseFloat(amount),
      updated_at: new Date().toISOString(),
    })
    .eq("id", wallet.id)

  // Update project paid amount
  await supabase
    .from("projects")
    .update({
      paid_amount: Number.parseFloat(project.paid_amount) + Number.parseFloat(amount),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  // Update worker profile total earnings
  await supabase.rpc("update_worker_earnings", {
    worker_id: project.worker_id,
    amount: Number.parseFloat(amount),
  })

  // If milestone_id provided, mark milestone as approved
  if (milestone_id) {
    await supabase
      .from("project_milestones")
      .update({
        status: "approved",
      })
      .eq("id", milestone_id)
  }

  return NextResponse.json({ transaction })
}
