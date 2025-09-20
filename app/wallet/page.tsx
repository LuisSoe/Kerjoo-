"use client"

import { useState } from "react"
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, Download, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const transactions = [
  {
    id: 1,
    type: "income",
    description: "Payment dari TechStart Indonesia",
    project: "E-commerce Platform Development",
    amount: 4500000,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    type: "withdrawal",
    description: "Withdraw ke Bank BCA",
    amount: 2000000,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: 3,
    type: "income",
    description: "Payment dari FoodieApp Co",
    project: "Mobile App UI/UX Design",
    amount: 2800000,
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: 4,
    type: "fee",
    description: "Platform Fee",
    amount: 225000,
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: 5,
    type: "income",
    description: "Payment dari Corporate Solutions",
    project: "Dashboard Development",
    amount: 6200000,
    date: "2024-01-10",
    status: "pending",
  },
]

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const totalBalance = 8275000
  const pendingBalance = 6200000
  const availableBalance = totalBalance - pendingBalance

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-400 mb-2">Wallet Kerjoo!</h1>
              <p className="text-gray-400">Kelola penghasilan dan pembayaran Anda</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Top Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-white" />
                  <span className="text-white font-medium">Total Balance</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:bg-white/10"
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-3xl font-bold text-white">
                {showBalance ? formatCurrency(totalBalance) : "••••••••"}
              </div>
              <p className="text-blue-100 text-sm mt-2">+12.5% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ArrowDownLeft className="h-6 w-6 text-green-400" />
                <span className="text-white font-medium">Available</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {showBalance ? formatCurrency(availableBalance) : "••••••••"}
              </div>
              <p className="text-gray-400 text-sm mt-2">Siap untuk withdraw</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpRight className="h-6 w-6 text-yellow-400" />
                <span className="text-white font-medium">Pending</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {showBalance ? formatCurrency(pendingBalance) : "••••••••"}
              </div>
              <p className="text-gray-400 text-sm mt-2">Menunggu konfirmasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button className="bg-green-600 hover:bg-green-700 h-16 flex-col gap-2">
            <ArrowDownLeft className="h-5 w-5" />
            <span>Withdraw</span>
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 h-16 flex-col gap-2 bg-transparent">
            <CreditCard className="h-5 w-5" />
            <span>Add Card</span>
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 h-16 flex-col gap-2 bg-transparent">
            <Plus className="h-5 w-5" />
            <span>Top Up</span>
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 h-16 flex-col gap-2 bg-transparent">
            <Download className="h-5 w-5" />
            <span>Statement</span>
          </Button>
        </div>

        {/* Transactions */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              All Transactions
            </TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-blue-600">
              Income
            </TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-600">
              Expenses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-600"
                              : transaction.type === "withdrawal"
                                ? "bg-blue-600"
                                : "bg-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowDownLeft className="h-4 w-4 text-white" />
                          ) : transaction.type === "withdrawal" ? (
                            <ArrowUpRight className="h-4 w-4 text-white" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{transaction.description}</p>
                          {transaction.project && <p className="text-sm text-gray-400">{transaction.project}</p>}
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "income"
                              ? "text-green-400"
                              : transaction.type === "withdrawal"
                                ? "text-blue-400"
                                : "text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge
                          variant={transaction.status === "completed" ? "default" : "secondary"}
                          className={transaction.status === "completed" ? "bg-green-600" : "bg-yellow-600"}
                        >
                          {transaction.status === "completed" ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Income Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions
                    .filter((t) => t.type === "income")
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-green-600">
                            <ArrowDownLeft className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{transaction.description}</p>
                            {transaction.project && <p className="text-sm text-gray-400">{transaction.project}</p>}
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-400">+{formatCurrency(transaction.amount)}</p>
                          <Badge
                            variant={transaction.status === "completed" ? "default" : "secondary"}
                            className={transaction.status === "completed" ? "bg-green-600" : "bg-yellow-600"}
                          >
                            {transaction.status === "completed" ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Expenses & Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions
                    .filter((t) => t.type !== "income")
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "withdrawal" ? "bg-blue-600" : "bg-red-600"
                            }`}
                          >
                            {transaction.type === "withdrawal" ? (
                              <ArrowUpRight className="h-4 w-4 text-white" />
                            ) : (
                              <CreditCard className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              transaction.type === "withdrawal" ? "text-blue-400" : "text-red-400"
                            }`}
                          >
                            -{formatCurrency(transaction.amount)}
                          </p>
                          <Badge
                            variant={transaction.status === "completed" ? "default" : "secondary"}
                            className={transaction.status === "completed" ? "bg-green-600" : "bg-yellow-600"}
                          >
                            {transaction.status === "completed" ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
