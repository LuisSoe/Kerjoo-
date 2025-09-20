"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CompanySidebar } from "@/components/company-sidebar"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Users,
  DollarSign,
  Clock,
  Target,
} from "lucide-react"

const analyticsData = {
  overview: [
    {
      title: "Total Projects",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: Target,
    },
    {
      title: "Active Workers",
      value: "18",
      change: "+8%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Revenue",
      value: "Rp 450M",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Avg. Completion Time",
      value: "28 days",
      change: "-5%",
      trend: "down",
      icon: Clock,
    },
  ],
  projectStats: [
    { status: "Completed", count: 12, percentage: 50, color: "bg-green-500" },
    { status: "In Progress", count: 8, percentage: 33, color: "bg-blue-500" },
    { status: "Planning", count: 3, percentage: 13, color: "bg-yellow-500" },
    { status: "On Hold", count: 1, percentage: 4, color: "bg-gray-500" },
  ],
  monthlyData: [
    { month: "Jan", projects: 8, revenue: 120, workers: 15 },
    { month: "Feb", projects: 6, revenue: 95, workers: 14 },
    { month: "Mar", projects: 10, revenue: 150, workers: 18 },
    { month: "Apr", projects: 12, revenue: 180, workers: 20 },
    { month: "May", projects: 9, revenue: 135, workers: 17 },
    { month: "Jun", projects: 11, revenue: 165, workers: 19 },
  ],
  topWorkers: [
    { name: "Ahmad Rizki", projects: 8, rating: 4.9, earnings: "Rp 45M" },
    { name: "Sari Dewi", projects: 6, rating: 4.8, earnings: "Rp 38M" },
    { name: "Budi Santoso", projects: 7, rating: 4.7, earnings: "Rp 42M" },
    { name: "Maya Putri", projects: 5, rating: 4.9, earnings: "Rp 35M" },
  ],
}

export default function CompanyAnalytics() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("6months")

  useEffect(() => {
    const userData = localStorage.getItem("kerjoo_user")
    const authStatus = localStorage.getItem("kerjoo_auth")

    if (!userData || !authStatus || authStatus !== "true") {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/login")
    }
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics & Reports</h1>
              <p className="text-muted-foreground">Analisis mendalam tentang performa proyek dan tim Anda</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Last 6 Months
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {analyticsData.overview.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {item.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={item.trend === "up" ? "text-green-600" : "text-red-600"}>{item.change}</span>
                    dari bulan lalu
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Distribusi Status Proyek
                </CardTitle>
                <CardDescription>Breakdown proyek berdasarkan status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.projectStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                        <span className="text-sm font-medium">{stat.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{stat.count}</span>
                        <Badge variant="outline">{stat.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="flex rounded-lg overflow-hidden h-2">
                    {analyticsData.projectStats.map((stat, index) => (
                      <div key={index} className={stat.color} style={{ width: `${stat.percentage}%` }}></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Tren Bulanan
                </CardTitle>
                <CardDescription>Proyek dan revenue 6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8">{data.month}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{data.projects} proyek</span>
                            <span>•</span>
                            <span>{data.workers} workers</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Rp {data.revenue}M</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Workers</CardTitle>
              <CardDescription>Worker dengan performa terbaik bulan ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topWorkers.map((worker, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{worker.name}</h4>
                        <p className="text-sm text-muted-foreground">{worker.projects} proyek selesai</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm font-medium">{worker.earnings}</div>
                        <div className="text-xs text-muted-foreground">Total earnings</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{worker.rating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">94%</div>
                <p className="text-sm text-muted-foreground mt-1">Proyek selesai tepat waktu dan sesuai budget</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">4.8/5</div>
                <p className="text-sm text-muted-foreground mt-1">Rating rata-rata dari klien</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Worker Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">89%</div>
                <p className="text-sm text-muted-foreground mt-1">Worker yang kembali mengerjakan proyek</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
