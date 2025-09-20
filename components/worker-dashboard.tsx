"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Wallet, Star, Award, DollarSign, BookOpen, ChevronRight, Plus, Edit } from "lucide-react"
import { WorkerSidebar } from "@/components/worker-sidebar"
import Link from "next/link"

export function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Mock data with fallback to user data
  const workerData = {
    name: user?.name || "Ahmad Rizki",
    email: user?.email || "ahmad.rizki@email.com",
    avatar: "/professional-indonesian-man.jpg",
    level: "Intermediate",
    completedProjects: 24,
    rating: 4.8,
    earnings: 15750000,
    skillPoints: 1250,
    badges: ["Fast Delivery", "Quality Work", "Communication Expert"],
  }

  const skills = [
    { name: "Web Development", level: 85, category: "Technical" },
    { name: "UI/UX Design", level: 72, category: "Design" },
    { name: "Content Writing", level: 90, category: "Content" },
    { name: "Digital Marketing", level: 68, category: "Marketing" },
  ]

  const recentProjects = [
    {
      id: 1,
      title: "E-commerce Website Development",
      client: "PT Digital Nusantara",
      status: "Completed",
      rating: 5,
      earnings: 2500000,
      completedAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Mobile App UI Design",
      client: "Startup Teknologi",
      status: "In Progress",
      earnings: 1800000,
      progress: 75,
    },
    {
      id: 3,
      title: "Content Marketing Strategy",
      client: "CV Kreatif Media",
      status: "Completed",
      rating: 4.9,
      earnings: 1200000,
      completedAt: "2024-01-10",
    },
  ]

  const recommendedProjects = [
    {
      id: 1,
      title: "React.js Dashboard Development",
      client: "PT Tech Solutions",
      budget: "Rp 3,000,000 - Rp 5,000,000",
      deadline: "2 minggu",
      matchScore: 95,
      skills: ["React.js", "JavaScript", "CSS"],
    },
    {
      id: 2,
      title: "Landing Page Design & Development",
      client: "Startup Fintech",
      budget: "Rp 2,000,000 - Rp 3,500,000",
      deadline: "1 minggu",
      matchScore: 88,
      skills: ["HTML", "CSS", "JavaScript", "Figma"],
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <WorkerSidebar />

      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Selamat datang kembali, {workerData.name}!</p>
            </div>
            <Button asChild>
              <Link href="/jobs">
                <Plus className="w-4 h-4 mr-2" />
                Cari Proyek Baru
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="projects">Proyek</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="earnings">Penghasilan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proyek Selesai</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{workerData.completedProjects}</div>
                    <p className="text-xs text-muted-foreground">+2 dari bulan lalu</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{workerData.rating}</div>
                    <p className="text-xs text-muted-foreground">Dari 5.0</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Penghasilan</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rp {workerData.earnings.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+15% dari bulan lalu</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Skill Points</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{workerData.skillPoints}</div>
                    <p className="text-xs text-muted-foreground">Level {workerData.level}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Projects & Recommendations */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Proyek Terbaru</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">{project.client}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                            {project.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{project.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Rp {project.earnings.toLocaleString()}</p>
                          {project.progress && (
                            <div className="w-20 mt-2">
                              <Progress value={project.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rekomendasi Proyek</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendedProjects.map((project) => (
                      <div key={project.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{project.title}</h4>
                          <Badge variant="secondary">{project.matchScore}% Match</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.client}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{project.budget}</span>
                          <span>•</span>
                          <span>{project.deadline}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full">
                          Lihat Detail
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profil Saya</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={workerData.avatar || "/placeholder.svg"} alt={workerData.name} />
                      <AvatarFallback>
                        {workerData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{workerData.name}</h3>
                      <p className="text-muted-foreground">{workerData.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge>{workerData.level}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{workerData.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profil
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Badge & Pencapaian</h4>
                    <div className="flex flex-wrap gap-2">
                      {workerData.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Development</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{skill.name}</h4>
                          <p className="text-sm text-muted-foreground">{skill.category}</p>
                        </div>
                        <Badge variant="outline">{skill.level}%</Badge>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}

                  <Button className="w-full mt-6" asChild>
                    <Link href="/learning">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Ikuti Learning Module
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Saldo Tersedia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rp 2,450,000</div>
                    <Button className="w-full mt-4" asChild>
                      <Link href="/wallet">
                        <Wallet className="w-4 h-4 mr-2" />
                        Tarik Dana
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Penghasilan Bulan Ini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rp 4,200,000</div>
                    <p className="text-sm text-muted-foreground">+25% dari bulan lalu</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rata-rata per Proyek</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rp 1,750,000</div>
                    <p className="text-sm text-muted-foreground">Berdasarkan 24 proyek</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
