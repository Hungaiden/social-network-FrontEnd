"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  type: "text" | "media"
}

interface Conversation {
  id: string
  name: string
  avatar: string
  type: "direct" | "group"
  lastMessage: string
  unread: number
  members: Array<{ id: string; name: string; avatar: string }>
}

export default function Chat({ currentUser }) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?key=s0lk3",
      type: "direct",
      lastMessage: "That sounds great!",
      unread: 2,
      members: [{ id: "2", name: "Alex Johnson", avatar: "/placeholder.svg?key=s0lk3" }],
    },
    {
      id: "2",
      name: "Design Team",
      avatar: "/placeholder.svg?key=group1",
      type: "group",
      lastMessage: "Check out the new designs",
      unread: 0,
      members: [
        { id: "2", name: "Alex Johnson", avatar: "/placeholder.svg?key=s0lk3" },
        { id: "3", name: "Sarah Smith", avatar: "/placeholder.svg?key=kbr9y" },
      ],
    },
  ])

  const [selectedConversation, setSelectedConversation] = useState<string>("1")
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "1",
        senderId: "2",
        senderName: "Alex Johnson",
        senderAvatar: "/placeholder.svg?key=s0lk3",
        content: "Hey! How are you doing?",
        timestamp: "10:30 AM",
        type: "text",
      },
      {
        id: "2",
        senderId: currentUser.id,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.avatar,
        content: "I'm doing great! Just finished the project.",
        timestamp: "10:32 AM",
        type: "text",
      },
      {
        id: "3",
        senderId: "2",
        senderName: "Alex Johnson",
        senderAvatar: "/placeholder.svg?key=s0lk3",
        content: "That sounds great!",
        timestamp: "10:33 AM",
        type: "text",
      },
    ],
    "2": [
      {
        id: "1",
        senderId: "2",
        senderName: "Alex Johnson",
        senderAvatar: "/placeholder.svg?key=s0lk3",
        content: "Check out the new designs",
        timestamp: "9:15 AM",
        type: "text",
      },
    ],
  })

  const [messageInput, setMessageInput] = useState("")
  const [showNewChat, setShowNewChat] = useState(false)
  const [newChatName, setNewChatName] = useState("")
  const [newChatType, setNewChatType] = useState<"direct" | "group">("direct")

  const currentMessages = messages[selectedConversation] || []
  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    }

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }))

    setMessageInput("")
  }

  const handleCreateNewChat = () => {
    if (!newChatName.trim()) return

    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: newChatName,
      avatar: "/placeholder.svg?key=new-chat",
      type: newChatType,
      lastMessage: "",
      unread: 0,
      members: [],
    }

    setConversations([newConversation, ...conversations])
    setMessages((prev) => ({ ...prev, [newConversation.id]: [] }))
    setSelectedConversation(newConversation.id)
    setNewChatName("")
    setShowNewChat(false)
  }

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex gap-2">
            <h2 className="text-lg font-bold flex-1">Messages</h2>
            <Button size="sm" variant="ghost" onClick={() => setShowNewChat(!showNewChat)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* New Chat Form */}
          {showNewChat && (
            <div className="mt-3 p-3 border border-border rounded-lg space-y-2 bg-background">
              <Input
                placeholder="Name"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                className="text-sm"
              />
              <select
                value={newChatType}
                onChange={(e) => setNewChatType(e.target.value as "direct" | "group")}
                className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
              >
                <option value="direct">Direct</option>
                <option value="group">Group</option>
              </select>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateNewChat} className="flex-1">
                  Create
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewChat(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 border-b border-border text-left transition ${
                selectedConversation === conversation.id
                  ? "bg-primary/10 border-l-4 border-l-primary"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={conversation.avatar || "/placeholder.svg"}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{conversation.name}</p>
                    {conversation.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.type === "group" ? `${conversation.members.length} members` : "Direct message"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {currentConversation && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentConversation.avatar || "/placeholder.svg"}
                alt={currentConversation.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{currentConversation.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentConversation.type === "group" ? `${currentConversation.members.length} members` : "Online"}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {currentMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                >
                  {message.senderId !== currentUser.id && (
                    <img
                      src={message.senderAvatar || "/placeholder.svg"}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.senderId === currentUser.id
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    {message.senderId !== currentUser.id && (
                      <p className="text-xs font-semibold mb-1">{message.senderName}</p>
                    )}
                    <p className="text-sm break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === currentUser.id ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                  {message.senderId === currentUser.id && (
                    <img
                      src={message.senderAvatar || "/placeholder.svg"}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {!currentConversation && (
        <div className="flex-1 flex items-center justify-center bg-card">
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  )
}
