import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export function handleDbError(error: unknown): never {
  console.error("[v0] Database error:", error)
  throw new Error("Database operation failed")
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  password_hash: string
  role: "worker" | "company"
  avatar_url?: string
  created_at: Date
  updated_at: Date
  last_login?: Date
}

export interface WorkerProfile {
  id: number
  user_id: number
  bio?: string
  location?: string
  level: "beginner" | "intermediate" | "advanced"
  skill_points: number
  completed_projects_count: number
  average_rating: number
  total_earnings: number
  availability_status: "available" | "busy" | "unavailable"
  hourly_rate: number
  created_at: Date
  updated_at: Date
}

export interface CompanyProfile {
  id: number
  user_id: number
  company_name: string
  industry?: string
  company_size?: string
  website?: string
  description?: string
  verified: boolean
  created_at: Date
  updated_at: Date
}

export interface Project {
  id: number
  company_id: number
  title: string
  description?: string
  category?: string
  status: "planning" | "active" | "completed" | "on-hold" | "cancelled"
  budget?: number
  deadline?: Date
  progress_percentage: number
  priority: "low" | "medium" | "high"
  required_skills?: any
  created_at: Date
  updated_at: Date
}

export interface Wallet {
  id: number
  worker_id: number
  total_balance: number
  available_balance: number
  pending_balance: number
  created_at: Date
  updated_at: Date
}

export interface Transaction {
  id: number
  wallet_id: number
  type: "income" | "withdrawal" | "fee"
  amount: number
  description?: string
  project_id?: number
  status: "pending" | "processing" | "completed" | "failed"
  payment_method?: string
  bank_name?: string
  account_number?: string
  created_at: Date
  processed_at?: Date
}
