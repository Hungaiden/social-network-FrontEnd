"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Check, X } from "lucide-react"

interface Friend {
  id: string
  name: string
  username: string
  avatar: string
  status: "online" | "offline"
}

interface FriendRequest {
  id: string
  senderId: string
  senderName: string
  senderUsername: string
  senderAvatar: string
  message: string
  timestamp: string
}

export default function Friends({ currentUser }) {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "2",
      name: "Alex Johnson",
      username: "alexjohn",
      avatar: "/placeholder.svg?key=s0lk3",
      status: "online",
    },
    {
      id: "3",
      name: "Sarah Smith",
      username: "sarahsmith",
      avatar: "/placeholder.svg?key=kbr9y",
      status: "offline",
    },
    {
      id: "4",
      name: "Mike Chen",
      username: "mikechen",
      avatar: "/placeholder.svg?key=mike01",
      status: "online",
    },
  ])

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: "1",
      senderId: "5",
      senderName: "Emma Wilson",
      senderUsername: "emmaw",
      senderAvatar: "/placeholder.svg?key=emma01",
      message: "Hi! I love your posts!",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      senderId: "6",
      senderName: "David Brown",
      senderUsername: "davidb",
      senderAvatar: "/placeholder.svg?key=david01",
      message: "We have mutual friends, let's connect!",
      timestamp: "5 hours ago",
    },
  ])

  const [suggestedUsers] = useState<Friend[]>([
    {
      id: "7",
      name: "Jessica Lee",
      username: "jessicaL",
      avatar: "/placeholder.svg?key=jess01",
      status: "online",
    },
    {
      id: "8",
      name: "Chris Martin",
      username: "chrism",
      avatar: "/placeholder.svg?key=chris01",
      status: "offline",
    },
    {
      id: "9",
      name: "Laura Garcia",
      username: "laurag",
      avatar: "/placeholder.svg?key=laura01",
      status: "online",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const handleAcceptRequest = (requestId: string) => {
    const request = friendRequests.find((r) => r.id === requestId)
    if (request) {
      const newFriend: Friend = {
        id: request.senderId,
        name: request.senderName,
        username: request.senderUsername,
        avatar: request.senderAvatar,
        status: "online",
      }
      setFriends([...friends, newFriend])
      setFriendRequests(friendRequests.filter((r) => r.id !== requestId))
    }
  }

  const handleDeclineRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter((r) => r.id !== requestId))
  }

  const handleAddFriend = (userId: string) => {
    const user = suggestedUsers.find((u) => u.id === userId)
    if (user) {
      setFriends([...friends, user])
    }
  }

  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter((f) => f.id !== friendId))
  }

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Friends</h1>
          <p className="text-muted-foreground">Manage your connections and friend requests</p>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
            <TabsTrigger value="requests">Requests ({friendRequests.length})</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            <div className="mb-4">
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredFriends.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No friends found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.map((friend) => (
                  <Card key={friend.id} className="hover:shadow-md transition">
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="relative inline-block mb-3">
                          <img
                            src={friend.avatar || "/placeholder.svg"}
                            alt={friend.name}
                            className="w-16 h-16 rounded-full"
                          />
                          <div
                            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                              friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <p className="font-semibold">{friend.name}</p>
                        <p className="text-sm text-muted-foreground">@{friend.username}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                          Message
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveFriend(friend.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {friendRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No pending friend requests</p>
                </CardContent>
              </Card>
            ) : (
              friendRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <img
                        src={request.senderAvatar || "/placeholder.svg"}
                        alt={request.senderName}
                        className="w-14 h-14 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{request.senderName}</p>
                            <p className="text-sm text-muted-foreground">@{request.senderUsername}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{request.timestamp}</p>
                        </div>
                        {request.message && <p className="text-sm mt-2 text-foreground/80">"{request.message}"</p>}
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeclineRequest(request.id)}>
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="relative inline-block mb-3">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                            user.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                    <Button className="w-full" onClick={() => handleAddFriend(user.id)}>
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add Friend
                    </Button>
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
