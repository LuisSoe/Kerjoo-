"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Briefcase,
  Star,
  Search,
  Filter,
  Plus,
  Eye,
  MessageSquare,
  DollarSign,
  Target,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { CompanySidebar } from "@/components/company-sidebar"

export function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("")

  // Mock data
  const companyData = {
    name: "PT Digital Nusantara",
    activeProjects: 12,
    totalWorkers: 45,
    completedProjects: 128,
    averageRating: 4.7,
    monthlyBudget: 85000000,
  }

  const talentPool = [
    {
      id: 1,
      name: "Ahmad Rizki",
      avatar: "/placeholder.svg?key=talent1",
      skills: ["React.js", "Node.js", "TypeScript"],
      rating: 4.9,
      completedProjects: 24,
      hourlyRate: 150000,
      availability: "Available",
      matchScore: 95,
      lastActive: "2 jam lalu",
      location: "Jakarta",
    },
    {
      id: 2,
      name: "Sari Dewi",
      avatar: "/placeholder.svg?key=talent2",
      skills: ["UI/UX Design", "Figma", "Adobe XD"],
      rating: 4.8,
      completedProjects: 18,
      hourlyRate: 120000,
      availability: "Busy",
      matchScore: 88,
      lastActive: "1 hari lalu",
      location: "Bandung",
    },
    {
      id: 3,
      name: "Budi Santoso",
      avatar: "/placeholder.svg?key=talent3",
      skills: ["Content Writing", "SEO", "Digital Marketing"],
      rating: 4.7,
      completedProjects: 32,
      hourlyRate: 100000,
      availability: "Available",
      matchScore: 82,
      lastActive: "30 menit lalu",
      location: "Surabaya",
    },
  ]

  const activeProjects = [
    {
      id: 1,
      title: "E-commerce Mobile App",
      worker: "Ahmad Rizki",
      progress: 75,
      deadline: "2024-02-15",
      budget: 5000000,
      status: "In Progress",
    },
    {
      id: 2,
      title: "Company Website Redesign",
      worker: "Sari Dewi",
      progress: 45,
      deadline: "2024-02-20",
      budget: 3500000,
      status: "In Progress",
    },
    {
      id: 3,
      title: "Content Marketing Campaign",
      worker: "Budi Santoso",
      progress: 90,
      deadline: "2024-02-10",
      budget: 2000000,
      status: "Review",
    },
  ]

  const aiRecommendations = [
    {
      id: 1,
      worker: "Maya Putri",
      reason: "Perfect match for React.js project with 4.9 rating",
      skills: ["React.js", "JavaScript", "CSS"],
      matchScore: 97,
      estimatedCost: "Rp 2,500,000",
    },
    {
      id: 2,
      worker: "Andi Wijaya",
      reason: "Experienced in similar e-commerce projects",
      skills: ["Node.js", "MongoDB", "Express"],
      matchScore: 93,
      estimatedCost: "Rp 3,200,000",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Company Dashboard</h1>
              <p className="text-muted-foreground">Kelola proyek dan temukan talenta terbaik</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Post Proyek Baru
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="talent">Talent Pool</TabsTrigger>
              <TabsTrigger value="projects">Proyek</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proyek Aktif</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companyData.activeProjects}</div>
                    <p className="text-xs text-muted-foreground">+3 dari bulan lalu</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pekerja</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companyData.totalWorkers}</div>
                    <p className="text-xs text-muted-foreground">Aktif bekerja</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proyek Selesai</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companyData.completedProjects}</div>
                    <p className="text-xs text-muted-foreground">Success rate 98%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget Bulan Ini</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rp {(companyData.monthlyBudget / 1000000).toFixed(0)}M</div>
                    <p className="text-xs text-muted-foreground">75% terpakai</p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Proyek Aktif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">Dikerjakan oleh {project.worker}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Deadline: {new Date(project.deadline).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Rp {project.budget.toLocaleString()}</p>
                          <div className="w-24 bg-secondary rounded-full h-2 mt-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{project.progress}% selesai</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="talent" className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Cari berdasarkan nama, skill, atau lokasi..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by skill" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React.js</SelectItem>
                        <SelectItem value="design">UI/UX Design</SelectItem>
                        <SelectItem value="content">Content Writing</SelectItem>
                        <SelectItem value="marketing">Digital Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter Lanjutan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Talent Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {talentPool.map((talent) => (
                  <Card key={talent.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={talent.avatar || "/placeholder.svg"} alt={talent.name} />
                            <AvatarFallback>
                              {talent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{talent.name}</h3>
                            <p className="text-sm text-muted-foreground">{talent.location}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {talent.matchScore}% Match
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {talent.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{talent.rating}</span>
                            <span className="text-muted-foreground">({talent.completedProjects} proyek)</span>
                          </div>
                          <Badge variant={talent.availability === "Available" ? "default" : "secondary"}>
                            {talent.availability}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Rp {talent.hourlyRate.toLocaleString()}/jam</span>
                          <span className="text-muted-foreground">{talent.lastActive}</span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Profil
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Talent Recommendations
                  </CardTitle>
                  <p className="text-muted-foreground">Berdasarkan kebutuhan proyek dan performa historis</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiRecommendations.map((rec) => (
                    <div key={rec.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{rec.worker}</h4>
                          <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {rec.matchScore}% Match
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {rec.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{rec.estimatedCost}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Lihat Detail
                          </Button>
                          <Button size="sm">
                            Hubungi
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Project Success Rate</span>
                        <span className="font-semibold">98%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Delivery Time</span>
                        <span className="font-semibold">12 hari</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Worker Satisfaction</span>
                        <span className="font-semibold">4.7/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cost Efficiency</span>
                        <span className="font-semibold">+23%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Skills Demand</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">React.js Development</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }} />
                          </div>
                          <span className="text-xs">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">UI/UX Design</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "72%" }} />
                          </div>
                          <span className="text-xs">72%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content Writing</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }} />
                          </div>
                          <span className="text-xs">68%</span>
                        </div>
                      </div>
                    </div>
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
