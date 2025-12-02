"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const SAMPLE_POSTS = [
  {
    id: 1,
    author: "Sarah Connor",
    avatar: "/placeholder-user.jpg",
    content: "Just launched my new project! Excited to share it with everyone 🚀",
    timestamp: "2 hours ago",
    likes: 342,
    comments: 28,
    liked: false,
  },
  {
    id: 2,
    author: "John Developer",
    avatar: "/placeholder-user.jpg",
    content: "Web development tips: Always write semantic HTML first",
    timestamp: "4 hours ago",
    likes: 156,
    comments: 12,
    liked: false,
  },
]

export function HomePage() {
  const [posts, setPosts] = useState(SAMPLE_POSTS)
  const [newPost, setNewPost] = useState("")

  const toggleLike = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post,
      ),
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>YOU</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Input placeholder="What's on your mind?" />
              <Button className="w-full">Post</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{post.content}</p>
              <div className="flex gap-4 text-muted-foreground">
                <button className="flex items-center gap-2 hover:text-foreground transition">
                  <Heart
                    className={`h-4 w-4 ${post.liked ? "fill-red-500 text-red-500" : ""}`}
                    onClick={() => toggleLike(post.id)}
                  />
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 hover:text-foreground transition">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-2 hover:text-foreground transition">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
