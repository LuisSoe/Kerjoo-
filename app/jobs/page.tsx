"use client"

import { useState } from "react"
import { Search, MapPin, Clock, DollarSign, Star, Filter, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const jobs = [
  {
    id: 1,
    title: "UI/UX Designer untuk Mobile App",
    company: "TechStart Indonesia",
    location: "Remote",
    type: "Freelance",
    budget: "Rp 2,500,000 - Rp 4,000,000",
    duration: "2-3 minggu",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    description:
      "Mencari UI/UX designer berpengalaman untuk merancang aplikasi mobile e-commerce. Harus memiliki portfolio yang kuat dan pengalaman minimal 2 tahun.",
    rating: 4.8,
    reviews: 127,
    posted: "2 hari yang lalu",
    saved: false,
  },
  {
    id: 2,
    title: "Content Writer untuk Blog Teknologi",
    company: "Digital Media Corp",
    location: "Jakarta",
    type: "Part-time",
    budget: "Rp 500,000 - Rp 800,000",
    duration: "1 minggu",
    skills: ["Content Writing", "SEO", "Research", "WordPress"],
    description:
      "Membutuhkan content writer untuk menulis artikel blog tentang teknologi terbaru. Minimal 5 artikel per minggu dengan kualitas SEO yang baik.",
    rating: 4.6,
    reviews: 89,
    posted: "1 hari yang lalu",
    saved: true,
  },
  {
    id: 3,
    title: "React Developer untuk Dashboard Admin",
    company: "StartupXYZ",
    location: "Remote",
    type: "Contract",
    budget: "Rp 8,000,000 - Rp 12,000,000",
    duration: "1-2 bulan",
    skills: ["React.js", "TypeScript", "Node.js", "MongoDB"],
    description:
      "Mengembangkan dashboard admin untuk platform e-learning. Membutuhkan developer dengan pengalaman React.js minimal 3 tahun.",
    rating: 4.9,
    reviews: 203,
    posted: "3 hari yang lalu",
    saved: false,
  },
  {
    id: 4,
    title: "Social Media Manager",
    company: "Fashion Brand Co",
    location: "Bandung",
    type: "Freelance",
    budget: "Rp 1,500,000 - Rp 2,500,000",
    duration: "1 bulan",
    skills: ["Social Media", "Content Creation", "Analytics", "Canva"],
    description:
      "Mengelola akun social media brand fashion. Membuat konten kreatif dan menganalisis performa engagement.",
    rating: 4.7,
    reviews: 156,
    posted: "5 hari yang lalu",
    saved: false,
  },
]

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [savedJobs, setSavedJobs] = useState<number[]>([2])

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" ||
      job.skills.some(
        (skill) =>
          (selectedCategory === "design" && ["Figma", "Adobe XD", "Canva"].includes(skill)) ||
          (selectedCategory === "development" && ["React.js", "Node.js", "TypeScript"].includes(skill)) ||
          (selectedCategory === "content" && ["Content Writing", "SEO", "Social Media"].includes(skill)),
      )

    const matchesType = selectedType === "all" || job.type.toLowerCase() === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Cari Pekerjaan</h1>
          <p className="text-gray-400">Temukan proyek dan pekerjaan yang sesuai dengan keahlian Anda</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Pekerjaan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Kategori</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="design">Design & UI/UX</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="content">Content & Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Tipe Pekerjaan</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Budget Range</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-600 bg-gray-800" />
                      <span className="text-sm text-gray-300">&lt; Rp 1,000,000</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-600 bg-gray-800" />
                      <span className="text-sm text-gray-300">Rp 1,000,000 - Rp 5,000,000</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-600 bg-gray-800" />
                      <span className="text-sm text-gray-300">&gt; Rp 5,000,000</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Cari pekerjaan, perusahaan, atau skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-400">
                Menampilkan {filteredJobs.length} pekerjaan dari {jobs.length} total pekerjaan
              </p>
            </div>

            {/* Job Cards */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="bg-gray-900 border-gray-800 hover:border-blue-500 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveJob(job.id)}
                            className="text-gray-400 hover:text-blue-400"
                          >
                            {savedJobs.includes(job.id) ? (
                              <BookmarkCheck className="h-5 w-5" />
                            ) : (
                              <Bookmark className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <span className="font-medium text-blue-400">{job.company}</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            {job.rating} ({job.reviews} reviews)
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-blue-600 text-white mb-2">
                          {job.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-green-400 font-semibold">
                          <DollarSign className="h-4 w-4" />
                          {job.budget}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-gray-600 text-gray-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{job.posted}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                        >
                          Lihat Detail
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Lamar Sekarang</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Tidak ada pekerjaan yang sesuai dengan filter Anda</p>
                  <p className="text-sm">Coba ubah kata kunci pencarian atau filter yang dipilih</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
