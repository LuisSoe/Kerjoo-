"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Settings,
  LogOut,
  Zap,
  Bell,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard/company", icon: LayoutDashboard },
  { name: "Talent Pool", href: "/dashboard/company/talent", icon: Users },
  { name: "Proyek", href: "/dashboard/company/projects", icon: Briefcase },
  { name: "AI Recommendations", href: "/dashboard/company/recommendations", icon: Sparkles },
  { name: "Analytics", href: "/dashboard/company/analytics", icon: TrendingUp },
  { name: "Messages", href: "/dashboard/company/messages", icon: MessageSquare },
  { name: "Pengaturan", href: "/dashboard/company/settings", icon: Settings },
]

export function CompanySidebar() {
  const pathname = usePathname()
  const [notifications] = useState(5)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("kerjoo_user")
    localStorage.removeItem("kerjoo_auth")
    sessionStorage.removeItem("kerjoo_user")
    sessionStorage.removeItem("kerjoo_auth")
    router.push("/")
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 p-6 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Kerjoo!</span>
        </div>

        {/* Company Info */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?key=company" />
              <AvatarFallback>DN</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">PT Digital Nusantara</p>
              <p className="text-xs text-muted-foreground">Premium Account</p>
            </div>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </Button>
        </div>
      </div>
    </div>
  )
}
