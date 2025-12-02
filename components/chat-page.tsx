"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

const CONVERSATIONS = [
  { id: 1, name: "Sarah Connor", avatar: "/placeholder-user.jpg", online: true, lastMessage: "See you tomorrow!" },
  { id: 2, name: "Mike Johnson", avatar: "/placeholder-user.jpg", online: false, lastMessage: "Thanks for the help" },
]

const MESSAGES = [
  { id: 1, author: "Sarah Connor", content: "Hey! How are you?", isOwn: false, timestamp: "10:30 AM" },
  { id: 2, author: "You", content: "Hi! Doing great, thanks!", isOwn: true, timestamp: "10:31 AM" },
  { id: 3, author: "Sarah Connor", content: "Want to grab coffee later?", isOwn: false, timestamp: "10:32 AM" },
]

export function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [messageInput, setMessageInput] = useState("")

  return (
    <div className="flex h-full gap-4 p-6">
      <div className="w-64 space-y-2">
        <h2 className="font-semibold mb-4">Messages</h2>
        {CONVERSATIONS.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedConversation(conv.id)}
            className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${
              selectedConversation === conv.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                <AvatarFallback>{conv.name[0]}</AvatarFallback>
              </Avatar>
              {conv.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{conv.name}</p>
              <p className="text-xs opacity-75 truncate">{conv.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Sarah Connor</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs rounded-lg p-3 ${msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs opacity-75 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
