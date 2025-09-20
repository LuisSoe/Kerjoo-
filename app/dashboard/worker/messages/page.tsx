"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WorkerSidebar } from "@/components/worker-sidebar"
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"
import { messageService, type Message } from "@/lib/message-service"

const conversations = [
  {
    id: 1,
    name: "PT. Tech Solutions",
    avatar: "/company-logo-tech.jpg",
    lastMessage: "Terima kasih untuk proposal yang sudah dikirim. Kami akan review dan memberikan feedback.",
    timestamp: "5 menit lalu",
    unread: 1,
    online: true,
    project: "E-commerce Platform",
  },
  {
    id: 2,
    name: "CV. Digital Kreasi",
    avatar: "/company-logo-digital.jpg",
    lastMessage: "Bisa kita schedule meeting untuk discuss project requirements lebih detail?",
    timestamp: "30 menit lalu",
    unread: 0,
    online: true,
    project: "Mobile Banking App",
  },
  {
    id: 3,
    name: "PT. Inovasi Maju",
    avatar: "/company-logo-inovasi.jpg",
    lastMessage: "Project sudah selesai. Mohon review dan approval untuk payment.",
    timestamp: "2 jam lalu",
    unread: 2,
    online: false,
    project: "Data Analytics Dashboard",
  },
  {
    id: 4,
    name: "Startup ABC",
    avatar: "/company-logo-startup.jpg",
    lastMessage: "Selamat! Proposal Anda diterima. Mari kita mulai project ini.",
    timestamp: "1 hari lalu",
    unread: 0,
    online: false,
    project: "Corporate Website",
  },
]

export default function WorkerMessages() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingCleanupRef = useRef<(() => void) | null>(null)

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

  useEffect(() => {
    if (selectedConversation && user) {
      loadMessages()
      startPolling()
    }

    return () => {
      if (pollingCleanupRef.current) {
        pollingCleanupRef.current()
        pollingCleanupRef.current = null
      }
    }
  }, [selectedConversation, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!selectedConversation) return

    setIsLoading(true)
    try {
      const fetchedMessages = await messageService.getMessages(selectedConversation.id)
      setMessages(fetchedMessages)
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const startPolling = () => {
    if (!selectedConversation || !user) return

    // Clean up previous polling
    if (pollingCleanupRef.current) {
      pollingCleanupRef.current()
    }

    // Start new polling
    pollingCleanupRef.current = messageService.startPolling(selectedConversation.id, (newMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((msg) => msg.id === newMessage.id)) {
          return prev
        }
        return [...prev, newMessage]
      })
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user || isSending) return

    setIsSending(true)
    try {
      const sentMessage = await messageService.sendMessage(
        selectedConversation.id,
        user.id || "worker_1", // Use actual user ID
        newMessage,
      )

      if (sentMessage) {
        setMessages((prev) => [...prev, sentMessage])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.project.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <WorkerSidebar />

      <main className="flex-1 ml-64">
        <div className="flex h-screen">
          {/* Conversations List */}
          <div className="w-80 border-r border-border bg-card">
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-bold mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cari konversasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversation.id === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                          {conversation.unread > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                      <Badge variant="outline" className="text-xs mt-2">
                        {conversation.project}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {selectedConversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium">{selectedConversation.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.online ? "Online" : "Offline"} • {selectedConversation.project}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="text-muted-foreground">Loading messages...</div>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const isOwn = message.senderId === (user?.id || "worker_1")
                    return (
                      <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                          >
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Ketik pesan..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  className="flex-1"
                  disabled={isSending}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isSending}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
