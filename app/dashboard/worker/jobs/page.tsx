"use client"

import { WorkerSidebar } from "@/components/worker-sidebar"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Bookmark, Users } from "lucide-react"
import Image from "next/image"

const jobListings = [
  {
    id: 1,
    title: "Technical Support Specialist",
    company: "Google Inc.",
    location: "New Delhi, India",
    type: "PART-TIME",
    salary: "20,000 INR - 25,000 INR",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    applicants: "10+ applicants",
    applicantAvatars: [
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
    ],
  },
  {
    id: 2,
    title: "Senior UI/UX Designer",
    company: "Apple",
    location: "Boston, USA",
    type: "FULL-TIME",
    salary: "$30,000 - $55,000",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    applicants: "9+ applicants",
    applicantAvatars: [
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
    ],
  },
  {
    id: 3,
    title: "Marketing Officer",
    company: "Intel Corp",
    location: "Bangalore, India",
    type: "PART-TIME",
    salary: "15,000 INR - 35,000 INR",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg",
    applicants: "30+ applicants",
    applicantAvatars: [
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
    ],
  },
  
  {
    id: 4,
    title: "Senior UI/UX Designer",
    company: "Apple",
    location: "Boston, USA",
    type: "FULL-TIME",
    salary: "$30,000 - $55,000",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    applicants: "9+ applicants",
    applicantAvatars: [
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
    ],
  },
  {
    id: 5,
    title: "Senior UI/UX Designer",
    company: "Apple",
    location: "Boston, USA",
    type: "FREELANCE&MICROTASK",
    salary: "$30,000 - $55,000",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    applicants: "9+ applicants",
    applicantAvatars: [
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
      "/placeholder.svg?height=24&width=24",
    ],
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
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = locationFilter === "all" || job.location.includes(locationFilter)
    const matchesType = typeFilter === "all" || job.type.toLowerCase().includes(typeFilter.toLowerCase())

    return matchesSearch && matchesLocation && matchesType
  })

  const handleViewDetails = (jobId: number) => {
    router.push(`/dashboard/worker/jobs/${jobId}`)
  }

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
    <div className="flex min-h-screen bg-black text-white">
      <WorkerSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Cari Pekerjaan</h1>
            <p className="text-gray-400">Temukan peluang kerja yang sesuai dengan keahlian Anda</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari pekerjaan, perusahaan, atau skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black border border-gray-700 text-white"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48 bg-black border border-gray-700 text-white">
                  <SelectValue placeholder="Lokasi" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white">
                  <SelectItem value="all">Semua Lokasi</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48 bg-black border border-gray-700 text-white">
                  <SelectValue placeholder="Tipe Pekerjaan" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white">
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="freelance&microtask">Freelance & Micro Task</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow bg-black border border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mb-4">
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium px-3 py-1 rounded-full bg-blue-600 text-white"
                  >
                    {job.type}
                  </Badge>
                  <span className="ml-2 text-sm text-gray-400">Salary: {job.salary}</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white p-2 shadow-sm">
                    <Image
                      src={job.logo || "/placeholder.svg"}
                      alt={job.company}
                      width={24}
                      height={24}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">{job.company}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex -space-x-2">
                    {job.applicantAvatars.map((avatar, index) => (
                      <div key={index} className="w-6 h-6 rounded-full bg-gray-600 border-2 border-gray-900">
                        <Image
                          src={avatar || "/placeholder.svg"}
                          alt="Applicant"
                          width={24}
                          height={24}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">{job.applicants}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-black border border-gray-700 text-white hover:bg-gray-900"
                    onClick={() => handleViewDetails(job.id)}
                  >
                    View details
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Apply now</Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Tidak ada pekerjaan ditemukan</h3>
              <p className="text-gray-400">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
