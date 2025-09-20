"use client"

import { useState } from "react"
import { Star, MapPin, Calendar, Award, TrendingUp, MessageCircle, Heart, Share2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Mock data for profile
const profileData = {
  id: 1,
  name: "Andi Pratama",
  title: "Full-Stack Developer & UI/UX Designer",
  location: "Jakarta, Indonesia",
  avatar: "/professional-indonesian-man.jpg",
  rating: 4.9,
  reviews: 127,
  completedProjects: 89,
  responseTime: "< 2 jam",
  memberSince: "Januari 2022",
  verified: true,
  bio: "Passionate full-stack developer dengan 5+ tahun pengalaman dalam membangun aplikasi web modern. Spesialisasi dalam React.js, Node.js, dan UI/UX design. Telah menyelesaikan 80+ proyek untuk berbagai klien dari startup hingga enterprise.",
  skills: [
    { name: "React.js", level: 95, endorsed: 45 },
    { name: "Node.js", level: 90, endorsed: 38 },
    { name: "TypeScript", level: 88, endorsed: 32 },
    { name: "UI/UX Design", level: 85, endorsed: 28 },
    { name: "MongoDB", level: 82, endorsed: 25 },
    { name: "Figma", level: 80, endorsed: 22 },
  ],
  portfolio: [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution dengan React.js dan Node.js",
      image: "/modern-ecommerce-website.png",
      technologies: ["React.js", "Node.js", "MongoDB", "Stripe"],
      client: "TechStart Indonesia",
      rating: 5.0,
      feedback: "Hasil kerja sangat memuaskan, komunikasi lancar, dan delivery tepat waktu.",
    },
    {
      id: 2,
      title: "Mobile Food Delivery App",
      description: "UI/UX design untuk aplikasi food delivery",
      image: "/mobile-food-delivery-app.png",
      technologies: ["Figma", "Adobe XD", "Prototyping"],
      client: "FoodieApp Co",
      rating: 4.8,
      feedback: "Design yang sangat menarik dan user-friendly. Highly recommended!",
    },
    {
      id: 3,
      title: "Corporate Dashboard",
      description: "Admin dashboard untuk manajemen data perusahaan",
      image: "/corporate-dashboard-interface.jpg",
      technologies: ["React.js", "TypeScript", "Chart.js"],
      client: "Corporate Solutions",
      rating: 4.9,
      feedback: "Professional work dengan attention to detail yang sangat baik.",
    },
  ],
  reviews: [
    {
      id: 1,
      client: "Sarah Johnson",
      company: "TechStart Indonesia",
      rating: 5.0,
      date: "2 minggu yang lalu",
      project: "E-commerce Platform",
      comment:
        "Andi adalah developer yang sangat profesional. Hasil kerjanya melebihi ekspektasi dan komunikasinya sangat baik. Pasti akan bekerja sama lagi di masa depan.",
    },
    {
      id: 2,
      client: "Michael Chen",
      company: "FoodieApp Co",
      rating: 4.8,
      date: "1 bulan yang lalu",
      project: "Mobile App Design",
      comment:
        "Design yang dibuat sangat user-friendly dan sesuai dengan brand guidelines. Proses revisi juga sangat cepat dan responsif.",
    },
    {
      id: 3,
      client: "Lisa Wong",
      company: "Corporate Solutions",
      rating: 4.9,
      date: "2 bulan yang lalu",
      project: "Dashboard Development",
      comment:
        "Kualitas code sangat baik dan dokumentasi lengkap. Andi juga memberikan training untuk tim kami. Sangat recommended!",
    },
  ],
  achievements: [
    { name: "Top Rated Freelancer", icon: "🏆", date: "2024" },
    { name: "100+ Projects Completed", icon: "🎯", date: "2024" },
    { name: "Client Satisfaction 98%", icon: "⭐", date: "2024" },
    { name: "Fast Responder", icon: "⚡", date: "2024" },
  ],
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <img
                src={profileData.avatar || "/placeholder.svg"}
                alt={profileData.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
              {profileData.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <Award className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profileData.name}</h1>
                  <p className="text-xl text-blue-400 mb-2">{profileData.title}</p>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profileData.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Member sejak {profileData.memberSince}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Hubungi
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{profileData.rating}</span>
                  </div>
                  <p className="text-sm text-gray-400">{profileData.reviews.length} reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{profileData.completedProjects}</div>
                  <p className="text-sm text-gray-400">Proyek Selesai</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{profileData.responseTime}</div>
                  <p className="text-sm text-gray-400">Response Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">98%</div>
                  <p className="text-sm text-gray-400">Success Rate</p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">{profileData.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-600">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-blue-600">
              Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Featured Portfolio */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Featured Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profileData.portfolio.slice(0, 2).map((project) => (
                        <div key={project.id} className="bg-gray-800 rounded-lg p-4">
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-semibold text-white mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm text-white">{project.rating}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-400">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Reviews */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.reviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="border-b border-gray-800 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-white">{review.client}</p>
                              <p className="text-sm text-gray-400">{review.company}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-white">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-2">"{review.comment}"</p>
                          <p className="text-sm text-gray-400">
                            {review.project} • {review.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Top Skills */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Top Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.skills.slice(0, 4).map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-400">{skill.endorsed} endorsements</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profileData.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <p className="text-white font-medium">{achievement.name}</p>
                            <p className="text-sm text-gray-400">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData.portfolio.map((project) => (
                <Card key={project.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-0">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-white">{project.rating}</span>
                        </div>
                        <p className="text-sm text-gray-400">{project.client}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {profileData.reviews.map((review) => (
                <Card key={review.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-white">{review.client}</h4>
                        <p className="text-gray-400">{review.company}</p>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="text-white font-semibold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">"{review.comment}"</p>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {review.project}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileData.skills.map((skill) => (
                <Card key={skill.name} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-400">{skill.endorsed} endorsements</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-400">Proficiency</span>
                        <span className="text-sm text-white">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
