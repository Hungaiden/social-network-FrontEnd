"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus, Users } from "lucide-react";
import { CreateGroupChatDialog } from "./create-group-chat-dialog";
import { useToast } from "@/hooks/use-toast";
import conversationService from "@/services/conversationService";
import webSocketService from "@/lib/websocket";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: "text" | "media";
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  type: "direct" | "group";
  lastMessage: string;
  lastMessageTime?: string;
  unread: number;
  members: Array<{ id: string; name: string; avatar: string }>;
}

export default function Chat({ currentUser, preSelectedUserId }) {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [showGroupChatDialog, setShowGroupChatDialog] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [messageInput, setMessageInput] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatType, setNewChatType] = useState<"direct" | "group">("direct");

  // Mock available users - replace with actual API call
  const [availableUsers] = useState([
    { id: "2", name: "Alex Johnson", avatar: "/placeholder.svg?key=s0lk3" },
    { id: "3", name: "Sarah Smith", avatar: "/placeholder.svg?key=kbr9y" },
    { id: "4", name: "John Doe", avatar: "/placeholder.svg?key=jdoe" },
    { id: "5", name: "Emily Brown", avatar: "/placeholder.svg?key=ebrown" },
  ]);

  // Handle preSelectedUserId from Friends page
  useEffect(() => {
    if (preSelectedUserId && conversations.length > 0) {
      // Find conversation with this user (match by conversation members or name)
      // For now, we'll try to find by matching the userId in conversation members
      // If not found, you might need to create a new conversation or implement search
      const existingConversation = conversations.find((conv) =>
        // This is a simplified check - you may need to adjust based on your data structure
        conv.members.some((member) => member.id === preSelectedUserId),
      );

      if (existingConversation) {
        setSelectedConversation(existingConversation.id);
      } else {
        // Optionally show a message that conversation doesn't exist yet
        toast({
          title: "Info",
          description: "Opening chat...",
        });
      }
    }
  }, [preSelectedUserId, conversations, toast]);

  // Fetch private conversations on mount
  useEffect(() => {
    const fetchPrivateConversations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await conversationService.getPrivateConversations();

        if (response.code === 1000 && response.result) {
          const privateConversations: Conversation[] =
            response.result.content.map((conv) => ({
              id: conv.id,
              name: conv.name,
              avatar: "/placeholder.svg",
              type: "direct" as const,
              lastMessage: conv.lastMessageContent || "",
              lastMessageTime: conv.lastMessageTime,
              unread: 0,
              members: [],
            }));

          setConversations(privateConversations);

          // Auto-select first conversation if available
          if (privateConversations.length > 0) {
            setSelectedConversation(privateConversations[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch private conversations:", err);
        setError("Failed to load conversations. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivateConversations();
  }, [toast]);

  // Connect WebSocket
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // Connect WebSocket and handle incoming messages
    webSocketService.connect(token, (receivedMessage) => {
      console.log("Received real-time message:", receivedMessage);

      // Add received message to the conversation
      const newMessage: Message = {
        id: receivedMessage.id,
        senderId: receivedMessage.senderId,
        senderName: receivedMessage.senderName,
        senderAvatar: "/placeholder.svg",
        content: receivedMessage.content,
        timestamp: new Date(receivedMessage.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
      };

      setMessages((prev) => ({
        ...prev,
        [receivedMessage.conversationId]: [
          ...(prev[receivedMessage.conversationId] || []),
          newMessage,
        ],
      }));
    });

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        setIsLoadingMessages(true);
        const response =
          await conversationService.getMessagesByConversation(
            selectedConversation,
          );

        if (response.code === 0 && response.result) {
          // Transform API messages to component format
          const fetchedMessages: Message[] = response.result.content.map(
            (msg) => ({
              id: msg.id,
              senderId: msg.senderId,
              senderName: msg.senderName,
              senderAvatar: "/placeholder.svg",
              content: msg.content,
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              type: "text" as const,
            }),
          );

          setMessages((prev) => ({
            ...prev,
            [selectedConversation]: fetchedMessages,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        // Set empty array on error
        setMessages((prev) => ({
          ...prev,
          [selectedConversation]: [],
        }));
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, toast]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedConversation]]);

  const currentMessages = messages[selectedConversation] || [];
  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation,
  );

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const messageContent = messageInput;
    setMessageInput(""); // Clear input immediately for better UX

    // Create optimistic message for instant UI update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };

    // Add message to UI immediately (optimistic update)
    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [
        ...(prev[selectedConversation] || []),
        optimisticMessage,
      ],
    }));

    try {
      // Send message via WebSocket
      webSocketService.sendMessage(
        selectedConversation,
        currentUser.id,
        messageContent,
      );

      // Note: The actual message will be received via WebSocket subscription
      // and will replace the optimistic message
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove optimistic message on error
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: (prev[selectedConversation] || []).filter(
          (msg) => msg.id !== optimisticMessage.id,
        ),
      }));

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });

      // Restore message input
      setMessageInput(messageContent);
    }
  };

  const handleCreateNewChat = () => {
    if (!newChatName.trim()) return;

    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: newChatName,
      avatar: "/placeholder.svg?key=new-chat",
      type: newChatType,
      lastMessage: "",
      unread: 0,
      members: [],
    };

    setConversations([newConversation, ...conversations]);
    setMessages((prev) => ({ ...prev, [newConversation.id]: [] }));
    setSelectedConversation(newConversation.id);
    setNewChatName("");
    setShowNewChat(false);
  };

  const handleGroupCreated = (group: any) => {
    // Add the new group to conversations list
    const newConversation: Conversation = {
      id: group.id,
      name: group.name,
      avatar: "/placeholder.svg?key=group-new",
      type: "group",
      lastMessage: "",
      unread: 0,
      members: group.memberIds.map((id: string) => {
        const user = availableUsers.find((u) => u.id === id);
        return user || { id, name: "Unknown", avatar: "/placeholder.svg" };
      }),
    };

    setConversations([newConversation, ...conversations]);
    setMessages((prev) => ({ ...prev, [newConversation.id]: [] }));
    setSelectedConversation(newConversation.id);

    toast({
      title: "Group Created",
      description: `${group.name} has been created successfully`,
    });
  };

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex gap-2">
            <h2 className="text-lg font-bold flex-1">Messages</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowGroupChatDialog(true)}
              title="Create Group Chat"
            >
              <Users className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNewChat(!showNewChat)}
            >
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
                onChange={(e) =>
                  setNewChatType(e.target.value as "direct" | "group")
                }
                className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
              >
                <option value="direct">Direct</option>
                <option value="group">Group</option>
              </select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleCreateNewChat}
                  className="flex-1"
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowNewChat(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading conversations...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32 px-4">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex items-center justify-center h-32 px-4">
              <p className="text-muted-foreground text-sm text-center">
                No conversations yet. Start a new chat!
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
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
                    className="w-12 h-12 rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">
                        {conversation.name}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.lastMessageTime && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          conversation.lastMessageTime,
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
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
                  {currentConversation.type === "group"
                    ? `${currentConversation.members.length} members`
                    : "Online"}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {isLoadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : currentMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <>
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.senderId === currentUser.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.senderId !== currentUser.id && (
                      <img
                        src={message.senderAvatar || "/placeholder.svg"}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full shrink-0"
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
                        <p className="text-xs font-semibold mb-1">
                          {message.senderName}
                        </p>
                      )}
                      <p className="text-sm wrap-break-word">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === currentUser.id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                    {message.senderId === currentUser.id && (
                      <img
                        src={message.senderAvatar || "/placeholder.svg"}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full shrink-0"
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
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
          <p className="text-muted-foreground">
            Select a conversation to start messaging
          </p>
        </div>
      )}

      {/* Create Group Chat Dialog */}
      <CreateGroupChatDialog
        open={showGroupChatDialog}
        onOpenChange={setShowGroupChatDialog}
        availableUsers={availableUsers}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
}
