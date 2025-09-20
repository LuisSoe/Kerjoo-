import { type NextRequest, NextResponse } from "next/server"

// Mock messages data (in a real app, this would come from a database)
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

// GET /api/messages/[conversationId] - Get messages for a specific conversation
export async function GET(request: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const conversationId = Number.parseInt(params.conversationId)

    if (isNaN(conversationId)) {
      return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 })
    }

    const messages = mockMessages.filter((msg) => msg.conversationId === conversationId)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching conversation messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/messages/[conversationId] - Send a message to a specific conversation
export async function POST(request: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const conversationId = Number.parseInt(params.conversationId)
    const body = await request.json()
    const { senderId, message } = body

    if (isNaN(conversationId)) {
      return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 })
    }

    if (!senderId || !message) {
      return NextResponse.json({ error: "Sender ID and message are required" }, { status: 400 })
    }

    // Create new message
    const newMessage = {
      id: mockMessages.length + 1,
      conversationId,
      senderId,
      message,
      timestamp: new Date().toISOString(),
    }

    // Add to mock messages array
    mockMessages.push(newMessage)

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
