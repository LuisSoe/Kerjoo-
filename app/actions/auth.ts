"use server"

import { sql, testDatabaseConnection } from "@/lib/db"
import { cookies } from "next/headers"

// Simple password hashing (in production, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  // For demo purposes, we'll use a simple hash
  // In production, use bcryptjs or similar
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function registerUser(formData: FormData) {
  try {
    console.log("[v0] Starting registration process...")

    // Test database connection first
    const dbTest = await testDatabaseConnection()
    if (!dbTest.success) {
      console.error("[v0] Database connection test failed:", dbTest.error)
      return {
        success: false,
        error: "Koneksi database gagal. Pastikan DATABASE_URL sudah diatur di Vercel.",
      }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as "worker" | "company"
    const companyName = formData.get("companyName") as string | null

    console.log("[v0] Registration data:", { name, email, phone, role, companyName })

    // Check if user exists
    console.log("[v0] Checking if user exists...")
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log("[v0] User already exists")
      return { success: false, error: "Email sudah terdaftar" }
    }

    // Hash password
    console.log("[v0] Hashing password...")
    const passwordHash = await hashPassword(password)

    // Insert user
    console.log("[v0] Inserting user into database...")
    const [user] = await sql`
      INSERT INTO users (name, email, phone, password_hash, role, avatar_url)
      VALUES (${name}, ${email}, ${phone}, ${passwordHash}, ${role}, '/professional-indonesian-man.jpg')
      RETURNING id, name, email, phone, role, avatar_url, created_at
    `
    console.log("[v0] User created:", user.id)

    // Create profile based on role
    if (role === "worker") {
      console.log("[v0] Creating worker profile...")
      const [workerProfile] = await sql`
        INSERT INTO worker_profiles (user_id, location)
        VALUES (${user.id}, 'Jakarta')
        RETURNING id
      `
      console.log("[v0] Worker profile created:", workerProfile.id)

      // Create wallet for worker
      console.log("[v0] Creating wallet...")
      await sql`
        INSERT INTO wallets (worker_id, total_balance, available_balance, pending_balance)
        VALUES (${workerProfile.id}, 0, 0, 0)
      `
      console.log("[v0] Wallet created")
    } else {
      console.log("[v0] Creating company profile...")
      await sql`
        INSERT INTO company_profiles (user_id, company_name, verified)
        VALUES (${user.id}, ${companyName || name}, false)
      `
      console.log("[v0] Company profile created")
    }

    // Set session cookie
    console.log("[v0] Setting session cookie...")
    const cookieStore = await cookies()
    cookieStore.set("kerjoo_user_id", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("[v0] Registration successful!")
    return { success: true, user }
  } catch (error) {
    console.error("[v0] Registration error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error details:", errorMessage)
    return {
      success: false,
      error: `Terjadi kesalahan saat mendaftar: ${errorMessage}`,
    }
  }
}

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (!user) {
      return { success: false, error: "Email atau password salah" }
    }

    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return { success: false, error: "Email atau password salah" }
    }

    // Update last login
    await sql`
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}
    `

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("kerjoo_user_id", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { success: false, error: "Terjadi kesalahan saat login" }
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("kerjoo_user_id")?.value

    if (!userId) {
      return null
    }

    const [user] = await sql`
      SELECT id, name, email, phone, role, avatar_url, created_at, last_login
      FROM users WHERE id = ${Number.parseInt(userId)}
    `

    if (!user) {
      return null
    }

    // Get profile based on role
    let profile = null
    if (user.role === "worker") {
      const [workerProfile] = await sql`
        SELECT * FROM worker_profiles WHERE user_id = ${user.id}
      `
      profile = workerProfile
    } else {
      const [companyProfile] = await sql`
        SELECT * FROM company_profiles WHERE user_id = ${user.id}
      `
      profile = companyProfile
    }

    return { ...user, profile }
  } catch (error) {
    console.error("[v0] Get current user error:", error)
    return null
  }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("kerjoo_user_id")
  return { success: true }
}
