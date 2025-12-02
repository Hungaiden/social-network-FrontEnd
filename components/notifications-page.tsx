"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, UserPlus } from "lucide-react"

const NOTIFICATIONS = [
  {
    id: 1,
    type: "like",
    author: "Sarah Connor",
    avatar: "/placeholder-user.jpg",
    message: "liked your post",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    author: "Mike Johnson",
    avatar: "/placeholder-user.jpg",
    message: "commented on your post",
    timestamp: "4 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    author: "Emma Wilson",
    avatar: "/placeholder-user.jpg",
    message: "started following you",
    timestamp: "1 day ago",
    read: true,
  },
]

export function NotificationsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline">Mark all as read</Button>
      </div>

      <div className="space-y-3">
        {NOTIFICATIONS.map((notif) => (
          <Card key={notif.id} className={notif.read ? "" : "bg-blue-50 border-blue-200"}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={notif.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{notif.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p>
                    <span className="font-semibold">{notif.author}</span>{" "}
                    <span className="text-muted-foreground">{notif.message}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{notif.timestamp}</p>
                </div>
                <div className="flex items-center gap-2">
                  {notif.type === "like" && <Heart className="h-5 w-5 text-red-500" />}
                  {notif.type === "comment" && <MessageCircle className="h-5 w-5 text-blue-500" />}
                  {notif.type === "follow" && <UserPlus className="h-5 w-5 text-green-500" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
