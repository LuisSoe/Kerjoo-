import { type NextRequest, NextResponse } from "next/server"

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    participants: ["worker_1", "company_1"],
    lastMessage: {
      id: 5,
      senderId: "company_1",
      message: "Terima kasih untuk proposal yang sudah dikirim. Kami akan review dan memberikan feedback.",
      timestamp: new Date().toISOString(),
    },
    project: "E-commerce Platform",
    unreadCount: 1,
  },
  {
    id: 2,
    participants: ["worker_1", "company_2"],
    lastMessage: {
      id: 3,
      senderId: "company_2",
      message: "Bisa kita schedule meeting untuk discuss project requirements lebih detail?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    project: "Mobile Banking App",
    unreadCount: 0,
  },
]

const mockMessages = [
  {
    id: 1,
    conversationId: 1,
    senderId: "company_1",
    message: "Halo Ahmad, kami tertarik dengan portfolio Anda untuk project e-commerce platform.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    conversationId: 1,
    senderId: "worker_1",
    message:
      "Terima kasih atas minatnya! Saya sangat tertarik dengan project ini. Bisa tolong berikan detail requirements?",
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    conversationId: 1,
    senderId: "company_1",
    message: "Tentu! Kami butuh platform e-commerce dengan fitur multi-vendor, payment gateway, dan admin dashboard.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    conversationId: 1,
    senderId: "worker_1",
    message: "Saya sudah berpengalaman dengan project serupa. Estimasi timeline 6-8 minggu untuk development complete.",
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    conversationId: 1,
    senderId: "company_1",
    message: "Terima kasih untuk proposal yang sudah dikirim. Kami akan review dan memberikan feedback.",
    timestamp: new Date().toISOString(),
  },
]

// GET /api/messages - Get all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const conversationId = searchParams.get("conversationId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // If conversationId is provided, return messages for that conversation
    if (conversationId) {
      const messages = mockMessages.filter((msg) => msg.conversationId === Number.parseInt(conversationId))
      return NextResponse.json({ messages })
    }

    // Otherwise, return all conversations for the user
    const userConversations = mockConversations.filter((conv) => conv.participants.includes(userId))

    return NextResponse.json({ conversations: userConversations })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, senderId, message } = body

    if (!conversationId || !senderId || !message) {
      return NextResponse.json({ error: "Conversation ID, sender ID, and message are required" }, { status: 400 })
    }

    // Create new message
    const newMessage = {
      id: mockMessages.length + 1,
      conversationId: Number.parseInt(conversationId),
      senderId,
      message,
      timestamp: new Date().toISOString(),
    }

    // Add to mock messages array
    mockMessages.push(newMessage)

    // Update last message in conversation
    const conversationIndex = mockConversations.findIndex((conv) => conv.id === Number.parseInt(conversationId))
    if (conversationIndex !== -1) {
      mockConversations[conversationIndex].lastMessage = {
        id: newMessage.id,
        senderId: newMessage.senderId,
        message: newMessage.message,
        timestamp: newMessage.timestamp,
      }
    }

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
