"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { WorkerSidebar } from "@/components/worker-sidebar"
import { Save, Bell, Shield, User, CreditCard, Globe } from "lucide-react"

export default function WorkerSettings() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    projectUpdates: true,
    marketingEmails: false,
    twoFactorAuth: false,
    profileVisibility: true,
    availabilityStatus: true,
  })

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

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", settings)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <WorkerSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Pengaturan</h1>
              <p className="text-muted-foreground">Kelola preferensi akun dan pengaturan privasi Anda</p>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Simpan Perubahan
            </Button>
          </div>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Akun
              </CardTitle>
              <CardDescription>Kelola informasi dasar akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" value={user.name || ""} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email || ""} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" value="+62 812-3456-7890" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <Input id="location" value="Jakarta, Indonesia" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value="Saya adalah seorang developer dengan pengalaman 3+ tahun dalam pengembangan web dan mobile."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifikasi
              </CardTitle>
              <CardDescription>Atur preferensi notifikasi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Terima notifikasi push di browser</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="project-updates">Project Updates</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi update proyek dan deadline</p>
                </div>
                <Switch
                  id="project-updates"
                  checked={settings.projectUpdates}
                  onCheckedChange={(checked) => handleSettingChange("projectUpdates", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Terima email promosi dan tips</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privasi & Keamanan
              </CardTitle>
              <CardDescription>Kelola pengaturan privasi dan keamanan akun</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Tambahkan lapisan keamanan ekstra</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">Tampilkan profil Anda di pencarian publik</p>
                </div>
                <Switch
                  id="profile-visibility"
                  checked={settings.profileVisibility}
                  onCheckedChange={(checked) => handleSettingChange("profileVisibility", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="availability-status">Availability Status</Label>
                  <p className="text-sm text-muted-foreground">Tampilkan status ketersediaan untuk proyek baru</p>
                </div>
                <Switch
                  id="availability-status"
                  checked={settings.availabilityStatus}
                  onCheckedChange={(checked) => handleSettingChange("availabilityStatus", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pembayaran
              </CardTitle>
              <CardDescription>Kelola metode pembayaran dan informasi bank</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bank-name">Nama Bank</Label>
                <Input id="bank-name" value="Bank Central Asia (BCA)" className="mt-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="account-number">Nomor Rekening</Label>
                  <Input id="account-number" value="1234567890" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="account-name">Nama Pemilik Rekening</Label>
                  <Input id="account-name" value={user.name || ""} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Bahasa & Wilayah
              </CardTitle>
              <CardDescription>Atur preferensi bahasa dan zona waktu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Bahasa</Label>
                  <Input id="language" value="Bahasa Indonesia" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="timezone">Zona Waktu</Label>
                  <Input id="timezone" value="WIB (UTC+7)" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
