import { sql, handleDbError } from "./db"
import bcrypt from "bcryptjs"

export async function registerUser(data: {
  name: string
  email: string
  phone: string
  password: string
  role: "worker" | "company"
  companyName?: string
}) {
  try {
    // Hash password
    const password_hash = await bcrypt.hash(data.password, 10)

    // Insert user
    const [user] = await sql`
      INSERT INTO users (name, email, phone, password_hash, role, avatar_url)
      VALUES (${data.name}, ${data.email}, ${data.phone}, ${password_hash}, ${data.role}, '/professional-indonesian-man.jpg')
      RETURNING id, name, email, phone, role, avatar_url, created_at
    `

    // Create profile based on role
    if (data.role === "worker") {
      await sql`
        INSERT INTO worker_profiles (user_id, location, level, skill_points, availability_status)
        VALUES (${user.id}, 'Jakarta', 'beginner', 0, 'available')
      `

      // Create wallet for worker
      await sql`
        INSERT INTO wallets (worker_id, total_balance, available_balance, pending_balance)
        VALUES ((SELECT id FROM worker_profiles WHERE user_id = ${user.id}), 0, 0, 0)
      `
    } else {
      await sql`
        INSERT INTO company_profiles (user_id, company_name, verified)
        VALUES (${user.id}, ${data.companyName || data.name}, false)
      `
    }

    return user
  } catch (error) {
    handleDbError(error)
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      throw new Error("Invalid credentials")
    }

    // Update last login
    await sql`
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}
    `

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    handleDbError(error)
  }
}

export async function getUserWithProfile(userId: number) {
  try {
    const [user] = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `

    if (!user) {
      return null
    }

    let profile = null
    if (user.role === "worker") {
      const [workerProfile] = await sql`
        SELECT * FROM worker_profiles WHERE user_id = ${userId}
      `
      profile = workerProfile
    } else {
      const [companyProfile] = await sql`
        SELECT * FROM company_profiles WHERE user_id = ${userId}
      `
      profile = companyProfile
    }

    const { password_hash, ...userWithoutPassword } = user
    return { ...userWithoutPassword, profile }
  } catch (error) {
    handleDbError(error)
  }
}
