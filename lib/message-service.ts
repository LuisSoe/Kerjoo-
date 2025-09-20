// Message service for handling API calls and real-time updates
export interface Message {
  id: number
  conversationId: number
  senderId: string
  message: string
  timestamp: string
}

export interface Conversation {
  id: number
  participants: string[]
  lastMessage: {
    id: number
    senderId: string
    message: string
    timestamp: string
  }
  project: string
  unreadCount: number
}

class MessageService {
  private baseUrl = "/api/messages"

  // Get all conversations for a user
  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const response = await fetch(`${this.baseUrl}?userId=${userId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch conversations")
      }
      const data = await response.json()
      return data.conversations || []
    } catch (error) {
      console.error("Error fetching conversations:", error)
      return []
    }
  }

  // Get messages for a specific conversation
  async getMessages(conversationId: number): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${conversationId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }
      const data = await response.json()
      return data.messages || []
    } catch (error) {
      console.error("Error fetching messages:", error)
      return []
    }
  }

  // Send a new message
  async sendMessage(conversationId: number, senderId: string, message: string): Promise<Message | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      return data.message
    } catch (error) {
      console.error("Error sending message:", error)
      return null
    }
  }

  // Simulate real-time message polling (in a real app, you'd use WebSockets or Server-Sent Events)
  startPolling(conversationId: number, onNewMessage: (message: Message) => void, interval = 3000) {
    let lastMessageId = 0

    const poll = async () => {
      try {
        const messages = await this.getMessages(conversationId)
        const newMessages = messages.filter((msg) => msg.id > lastMessageId)

        if (newMessages.length > 0) {
          lastMessageId = Math.max(...messages.map((msg) => msg.id))
          newMessages.forEach(onNewMessage)
        }
      } catch (error) {
        console.error("Error polling messages:", error)
      }
    }

    // Initial load
    poll()

    // Set up polling interval
    const intervalId = setInterval(poll, interval)

    // Return cleanup function
    return () => clearInterval(intervalId)
  }
}

export const messageService = new MessageService()
