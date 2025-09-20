"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WorkerSidebar } from "@/components/worker-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, TrendingUp, CreditCard, Banknote, ArrowUpRight, ArrowDownLeft, Plus, Minus } from "lucide-react"

export default function WalletPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("kerjoo_user") || sessionStorage.getItem("kerjoo_user")
      const authStatus = localStorage.getItem("kerjoo_auth") || sessionStorage.getItem("kerjoo_auth")

      if (!userData || !authStatus) {
        router.push("/login")
        return
      }

      try {
        const parsedUser = JSON.parse(userData)
        if (parsedUser.role !== "worker") {
          router.push("/dashboard/company")
          return
        }
        setUser(parsedUser)
        setIsLoading(false)
      } catch (error) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const transactions = [
    {
      id: 1,
      type: "income",
      description: "Pembayaran Proyek Website E-commerce",
      amount: 2500000,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      type: "income",
      description: "Bonus Penyelesaian Tepat Waktu",
      amount: 500000,
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: 3,
      type: "withdrawal",
      description: "Penarikan ke Bank BCA",
      amount: 1000000,
      date: "2024-01-12",
      status: "processing",
    },
    {
      id: 4,
      type: "income",
      description: "Pembayaran Proyek Mobile App",
      amount: 3200000,
      date: "2024-01-10",
      status: "completed",
    },
  ]

  const totalBalance = 8750000
  const pendingBalance = 1000000
  const availableBalance = totalBalance - pendingBalance

  return (
    <div className="flex min-h-screen pt-16">
      <WorkerSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Dompet Digital</h1>
            <p className="text-muted-foreground">Kelola penghasilan dan transaksi Anda</p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {totalBalance.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12% dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Tersedia</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Rp {availableBalance.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">Siap untuk ditarik</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">Rp {pendingBalance.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">Sedang diproses</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Top Up
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Minus className="h-4 w-4" />
              Tarik Dana
            </Button>
          </div>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <CardDescription>Daftar transaksi terbaru Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}Rp {transaction.amount.toLocaleString("id-ID")}
                        </p>
                        <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                          {transaction.status === "completed" ? "Selesai" : "Proses"}
                        </Badge>
                      </div>
                    </div>
                    {index < transactions.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
