"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/app/actions/auth"

export default function RegisterPage() {
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Password tidak cocok!")
      setIsLoading(false)
      return
    }

    if (!role) {
      setError("Silakan pilih peran Anda!")
      setIsLoading(false)
      return
    }

    formData.set("role", role)

    try {
      console.log("[v0] Submitting registration form...")
      const result = await registerUser(formData)
      console.log("[v0] Registration result:", result)

      if (result.success && result.user) {
        // Store user in localStorage for client-side access
        localStorage.setItem("kerjoo_user", JSON.stringify(result.user))
        localStorage.setItem("kerjoo_auth", "true")

        // Redirect based on role
        if (result.user.role === "company") {
          router.push("/dashboard/company")
        } else {
          router.push("/dashboard/worker")
        }
      } else {
        setError(result.error || "Registrasi gagal")
      }
    } catch (err) {
      console.error("[v0] Registration error:", err)
      setError("Terjadi kesalahan saat mendaftar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-16">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Kerjoo!</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Buat Akun Baru</h1>
          <p className="text-muted-foreground">Bergabunglah dengan ribuan pekerja mikro di Kerjoo!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" placeholder="Nama lengkap Anda" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="nama@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" name="phone" placeholder="08123456789" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Daftar Sebagai</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worker">Pekerja Mikro</SelectItem>
                    <SelectItem value="company">Perusahaan/HRD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {role === "company" && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nama Perusahaan</Label>
                  <Input id="companyName" name="companyName" placeholder="PT. Nama Perusahaan" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <Input id="confirm-password" name="confirmPassword" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Daftar Sekarang"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Masuk di sini
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
