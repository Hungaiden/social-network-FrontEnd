"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, X } from "lucide-react"

interface Comment {
  id: string
  author: string
  username: string
  avatar: string
  content: string
  timestamp: string
}

interface Post {
  id: string
  author: string
  username: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  reactions: { [key: string]: number }
  comments: Comment[]
  liked: boolean
  showComments: boolean
}

export default function Timeline({ currentUser }) {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Alex Johnson",
      username: "alexjohn",
      avatar: "/placeholder.svg?key=s0lk3",
      content: "Just launched my new project! Check it out and let me know what you think.",
      timestamp: "2 hours ago",
      likes: 24,
      reactions: { like: 15, love: 5, wow: 4 },
      comments: [
        {
          id: "c1",
          author: "Sarah Smith",
          username: "sarahsmith",
          avatar: "/placeholder.svg?key=kbr9y",
          content: "This looks amazing!",
          timestamp: "1 hour ago",
        },
      ],
      liked: false,
      showComments: false,
    },
    {
      id: "2",
      author: "Sarah Smith",
      username: "sarahsmith",
      avatar: "/placeholder.svg?key=kbr9y",
      content: "Beautiful sunset at the beach today",
      timestamp: "4 hours ago",
      likes: 156,
      reactions: { like: 120, love: 30, wow: 6 },
      comments: [],
      liked: false,
      showComments: false,
    },
  ])

  const [postContent, setPostContent] = useState("")
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({})

  const handleCreatePost = () => {
    if (!postContent.trim()) return

    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser.displayName,
      username: currentUser.username,
      avatar: currentUser.avatar,
      content: postContent,
      timestamp: "now",
      likes: 0,
      reactions: {},
      comments: [],
      liked: false,
      showComments: false,
    }

    setPosts([newPost, ...posts])
    setPostContent("")
  }

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleReaction = (postId: string, reactionType: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions }
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1
          return { ...post, reactions: newReactions }
        }
        return post
      }),
    )
  }

  const toggleComments = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, showComments: !post.showComments } : post)))
  }

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId]?.trim()
    if (!content) return

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: Date.now().toString(),
            author: currentUser.displayName,
            username: currentUser.username,
            avatar: currentUser.avatar,
            content,
            timestamp: "now",
          }
          return { ...post, comments: [...post.comments, newComment] }
        }
        return post
      }),
    )
    setCommentInputs({ ...commentInputs, [postId]: "" })
  }

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, comments: post.comments.filter((c) => c.id !== commentId) } : post,
      ),
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto">
        {/* Create Post */}
        <Card className="mb-4 mt-4">
          <CardHeader className="pb-3">
            <div className="flex gap-4">
              <img
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.displayName}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <Input
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="mb-3"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleCreatePost} disabled={!postContent.trim()}>
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Posts */}
        <div className="space-y-4 pb-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <img
                    src={post.avatar || "/placeholder.svg"}
                    alt={post.author}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{post.author}</p>
                        <p className="text-xs text-muted-foreground">
                          @{post.username} • {post.timestamp}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-foreground/90">{post.content}</p>

                    {/* Reactions Display */}
                    {Object.keys(post.reactions).length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {Object.entries(post.reactions).map(([type, count]) => (
                          <div
                            key={type}
                            className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary"
                          >
                            {type} {count}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reactions */}
                    <div className="mt-4 pt-3 border-t border-border flex gap-1 flex-wrap text-muted-foreground text-sm">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded hover:bg-primary/10 transition ${
                          post.liked ? "text-primary" : ""
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} />
                        {post.likes}
                      </button>

                      <div className="flex gap-0.5">
                        {["love", "wow", "haha"].map((type) => (
                          <button
                            key={type}
                            onClick={() => handleReaction(post.id, type)}
                            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-accent/20 transition text-xs"
                          >
                            {type === "love" && "❤️"}
                            {type === "wow" && "😮"}
                            {type === "haha" && "😂"}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded hover:bg-primary/10 transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {post.comments.length}
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded hover:bg-primary/10 transition">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {post.showComments && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        {/* Comments List */}
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2 text-sm">
                            <img
                              src={comment.avatar || "/placeholder.svg"}
                              alt={comment.author}
                              className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 bg-muted rounded-lg p-2">
                              <p className="font-semibold text-xs">{comment.author}</p>
                              <p className="text-foreground/90">{comment.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">{comment.timestamp}</p>
                            </div>
                            {comment.username === currentUser.username && (
                              <button
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Comment Input */}
                        <div className="flex gap-2">
                          <img
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.displayName}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1 flex gap-2">
                            <Input
                              placeholder="Write a comment..."
                              value={commentInputs[post.id] || ""}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                              className="text-sm"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                            >
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
