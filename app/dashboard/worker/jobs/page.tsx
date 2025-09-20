"use client"

import { WorkerSidebar } from "@/components/worker-sidebar"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, DollarSign, Briefcase } from "lucide-react"

const jobListings = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "PT Tech Innovasi",
    location: "Jakarta",
    type: "Full-time",
    salary: "Rp 8,000,000 - 12,000,000",
    description: "Mencari frontend developer berpengalaman dengan React dan TypeScript",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    posted: "2 hari yang lalu",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Digital Creative Studio",
    location: "Bandung",
    type: "Contract",
    salary: "Rp 6,000,000 - 9,000,000",
    description: "Desainer UI/UX untuk proyek aplikasi mobile dan web",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    posted: "1 hari yang lalu",
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "Startup Fintech",
    location: "Surabaya",
    type: "Full-time",
    salary: "Rp 10,000,000 - 15,000,000",
    description: "Developer backend untuk sistem payment dan API integration",
    skills: ["Node.js", "PostgreSQL", "Docker"],
    posted: "3 hari yang lalu",
  },
  {
    id: 4,
    title: "Mobile Developer",
    company: "E-commerce Giant",
    location: "Jakarta",
    type: "Full-time",
    salary: "Rp 9,000,000 - 13,000,000",
    description: "Pengembang aplikasi mobile untuk platform e-commerce",
    skills: ["React Native", "Flutter", "Firebase"],
    posted: "1 hari yang lalu",
  },
]

export default function WorkerJobsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const userData = sessionStorage.getItem("kerjoo_user") || localStorage.getItem("kerjoo_user")
      const authStatus = sessionStorage.getItem("kerjoo_auth") || localStorage.getItem("kerjoo_auth")

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

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLocation = locationFilter === "all" || job.location === locationFilter
    const matchesType = typeFilter === "all" || job.type === typeFilter

    return matchesSearch && matchesLocation && matchesType
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Memuat halaman...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen pt-16">
      <WorkerSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Cari Pekerjaan</h1>
            <p className="text-muted-foreground">Temukan peluang kerja yang sesuai dengan keahlian Anda</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cari pekerjaan, perusahaan, atau skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Lokasi</SelectItem>
                  <SelectItem value="Jakarta">Jakarta</SelectItem>
                  <SelectItem value="Bandung">Bandung</SelectItem>
                  <SelectItem value="Surabaya">Surabaya</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipe Pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-base font-medium text-foreground">{job.company}</CardDescription>
                    </div>
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.posted}
                      </div>
                    </div>
                    <Button>Lamar Sekarang</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Tidak ada pekerjaan ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
