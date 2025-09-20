"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { WorkerSidebar } from "@/components/worker-sidebar"
import { Plus, Star, TrendingUp, Award } from "lucide-react"

const skillCategories = [
  {
    name: "Frontend Development",
    skills: [
      { name: "React", level: 85, verified: true },
      { name: "Next.js", level: 80, verified: true },
      { name: "TypeScript", level: 75, verified: false },
      { name: "Tailwind CSS", level: 90, verified: true },
      { name: "HTML/CSS", level: 95, verified: true },
    ],
  },
  {
    name: "Backend Development",
    skills: [
      { name: "Node.js", level: 70, verified: true },
      { name: "Python", level: 65, verified: false },
      { name: "PostgreSQL", level: 75, verified: true },
      { name: "REST API", level: 80, verified: true },
    ],
  },
  {
    name: "Tools & Others",
    skills: [
      { name: "Git", level: 85, verified: true },
      { name: "Docker", level: 60, verified: false },
      { name: "AWS", level: 55, verified: false },
      { name: "Figma", level: 70, verified: true },
    ],
  },
]

const achievements = [
  {
    title: "React Expert",
    description: "Menyelesaikan 10+ proyek React dengan rating 4.8+",
    icon: "🏆",
    date: "Jan 2024",
  },
  {
    title: "Fast Learner",
    description: "Menguasai 3 teknologi baru dalam 6 bulan terakhir",
    icon: "⚡",
    date: "Dec 2023",
  },
  {
    title: "Client Favorite",
    description: "Mendapat 95% positive feedback dari klien",
    icon: "⭐",
    date: "Nov 2023",
  },
]

export default function WorkerSkills() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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

  const getSkillLevelText = (level: number) => {
    if (level >= 80) return "Expert"
    if (level >= 60) return "Intermediate"
    if (level >= 40) return "Beginner"
    return "Learning"
  }

  const getSkillLevelColor = (level: number) => {
    if (level >= 80) return "text-green-600"
    if (level >= 60) return "text-blue-600"
    if (level >= 40) return "text-yellow-600"
    return "text-gray-600"
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <WorkerSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Skills & Keahlian</h1>
              <p className="text-muted-foreground">Kelola dan tingkatkan keahlian profesional Anda</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Skill
            </Button>
          </div>

          {/* Skills Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">13</div>
                <p className="text-xs text-muted-foreground">+2 dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Skills</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">62% dari total skills</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Level</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75%</div>
                <p className="text-xs text-muted-foreground">Intermediate level</p>
              </CardContent>
            </Card>
          </div>

          {/* Skills by Category */}
          <div className="space-y-6">
            {skillCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.skills.length} skills dalam kategori ini</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{skill.name}</span>
                            {skill.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${getSkillLevelColor(skill.level)}`}>
                              {getSkillLevelText(skill.level)}
                            </span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Pencapaian</CardTitle>
              <CardDescription>Badge dan sertifikat yang telah Anda raih</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{achievement.date}</p>
                    </div>
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
