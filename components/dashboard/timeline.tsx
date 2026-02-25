"use client";

import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Flame,
  Share2,
  Bookmark,
  MessageCircle,
  Image,
  Smile,
  Send,
  Pin,
  X,
  MoreHorizontal,
  Loader2,
  RefreshCw,
} from "lucide-react";
import postService from "@/services/postService";
import { useToast } from "@/hooks/use-toast";
import FeedSidebar from "@/components/dashboard/feed-sidebar";

interface Comment {
  id: string;
  author: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  author: string;
  username: string;
  avatar: string;
  title: string;
  content: string;
  timestamp: string;
  upvotes: number;
  hot: number;
  comments: Comment[];
  upvoted: boolean;
  showComments: boolean;
  pinned?: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

const PAGE_SIZE = 10;

export default function Timeline({ currentUser }) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {},
  );

  const mapApiPost = (apiPost: any): Post => ({
    id: apiPost.id,
    author: apiPost.ownerDisplayName ?? apiPost.ownerUsername ?? "Người dùng",
    username: apiPost.ownerUsername ?? "",
    avatar: apiPost.ownerAvatar ?? "",
    title: apiPost.title,
    content: apiPost.content,
    timestamp: formatDate(apiPost.createdAt),
    upvotes: 0,
    hot: 0,
    comments: [],
    upvoted: false,
    showComments: false,
  });

  const fetchPosts = useCallback(async (pageNum: number, append = false) => {
    try {
      append ? setIsLoadingMore(true) : setIsLoading(true);
      setFetchError(null);
      const res = await postService.getHomePosts(pageNum, PAGE_SIZE);
      if (res.code === 1000) {
        const mapped = res.result.content.map(mapApiPost);
        setPosts((prev) => (append ? [...prev, ...mapped] : mapped));
        setTotalPages(res.result.totalPages);
        setTotalElements(res.result.totalElements);
        setPage(res.result.page);
      }
    } catch (err: any) {
      setFetchError(err.message ?? "Không thể tải bài viết");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  const handleLoadMore = () => {
    if (!isLoadingMore && page + 1 < totalPages) {
      fetchPosts(page + 1, true);
    }
  };

  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postContent.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề và nội dung",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsCreatingPost(true);
      const response = await postService.createPost({
        title: postTitle,
        content: postContent,
      });
      if (response.code === 1000 && response.result) {
        const newPost: Post = {
          id: response.result.id,
          author: currentUser?.displayName ?? "Bạn",
          username: currentUser?.username ?? "",
          avatar: currentUser?.avatar ?? "",
          title: postTitle,
          content: response.result.content,
          timestamp: "Vừa xong",
          upvotes: 0,
          hot: 0,
          comments: [],
          upvoted: false,
          showComments: false,
        };
        setPosts((prev) => [newPost, ...prev]);
        setTotalElements((n) => n + 1);
        setPostTitle("");
        setPostContent("");
        toast({ title: "Đã đăng bài!" });
      }
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể đăng bài. Thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPost(false);
    }
  };

  const toggleUpvote = (postId: string) => {
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              upvoted: !p.upvoted,
              upvotes: p.upvoted ? p.upvotes - 1 : p.upvotes + 1,
            }
          : p,
      ),
    );
  };

  const toggleComments = (postId: string) => {
    setPosts(
      posts.map((p) =>
        p.id === postId ? { ...p, showComments: !p.showComments } : p,
      ),
    );
  };

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser?.displayName ?? "Bạn",
      username: currentUser?.username ?? "",
      avatar: currentUser?.avatar ?? "",
      content,
      timestamp: "Vừa xong",
    };
    setPosts(
      posts.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p,
      ),
    );
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  const getInitials = (name: string) => name?.slice(0, 2).toUpperCase() ?? "??";
  const avatarColors = [
    "from-blue-400 to-cyan-500",
    "from-rose-400 to-pink-500",
    "from-violet-400 to-purple-500",
    "from-amber-400 to-orange-500",
  ];
  const getColor = (key: string) =>
    avatarColors[(key?.charCodeAt(0) ?? 0) % avatarColors.length];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
          {/* Create Post */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex gap-3">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(currentUser?.username ?? "")} flex items-center justify-center shrink-0`}
              >
                <span className="text-white text-sm font-semibold">
                  {getInitials(currentUser?.displayName ?? "")}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <input
                  placeholder="Tiêu đề bài viết..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl bg-muted outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                />
                <Textarea
                  placeholder="Bạn đang nghĩ gì?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={3}
                  className="resize-none text-sm rounded-xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary/30 placeholder:text-muted-foreground"
                />
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2 text-muted-foreground">
                    <button className="hover:text-foreground transition p-1 rounded-lg hover:bg-muted">
                      <Image className="w-4 h-4" />
                    </button>
                    <button className="hover:text-foreground transition p-1 rounded-lg hover:bg-muted">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {(postTitle || postContent) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-xs"
                        onClick={() => {
                          setPostTitle("");
                          setPostContent("");
                        }}
                      >
                        Huỷ
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="rounded-xl text-xs px-4"
                      disabled={
                        !postTitle.trim() ||
                        !postContent.trim() ||
                        isCreatingPost
                      }
                      onClick={handleCreatePost}
                    >
                      {isCreatingPost ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Đang đăng...
                        </>
                      ) : (
                        "Đăng bài"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feed header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">Bảng tin</h2>
              {totalElements > 0 && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {totalElements} bài viết
                </span>
              )}
            </div>
            <button
              onClick={() => fetchPosts(0)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl p-4 animate-pulse"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-muted rounded w-1/4" />
                      <div className="h-2 bg-muted rounded w-1/6" />
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!isLoading && fetchError && (
            <div className="bg-card border border-destructive/30 rounded-2xl p-6 text-center">
              <p className="text-destructive text-sm mb-3">{fetchError}</p>
              <Button size="sm" variant="outline" onClick={() => fetchPosts(0)}>
                Thử lại
              </Button>
            </div>
          )}

          {/* Posts */}
          {!isLoading &&
            !fetchError &&
            posts.map((post) => {
              const isExpanded = expandedPosts[post.id];
              const isLong = post.content.length > 200;
              const displayContent =
                isLong && !isExpanded
                  ? post.content.slice(0, 200) + "..."
                  : post.content;

              return (
                <div
                  key={post.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <div className="p-4">
                    {/* Author row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(post.username || post.id)} flex items-center justify-center shrink-0`}
                        >
                          <span className="text-white text-sm font-semibold">
                            {getInitials(post.author)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm leading-tight">
                            {post.author}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span>{post.timestamp}</span>
                            {post.pinned && (
                              <>
                                <span>·</span>
                                <Pin className="w-3 h-3" />
                                <span>Ghim</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="text-muted-foreground hover:text-foreground transition p-1 rounded-lg hover:bg-muted">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-base mb-1">{post.title}</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {displayContent}
                    </p>
                    {isLong && (
                      <button
                        onClick={() =>
                          setExpandedPosts({
                            ...expandedPosts,
                            [post.id]: !isExpanded,
                          })
                        }
                        className="text-xs text-primary hover:underline mt-1 flex items-center gap-0.5"
                      >
                        {isExpanded ? (
                          <>
                            Thu gọn <ChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            Xem thêm <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    )}

                    {/* Reactions bar */}
                    <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border">
                      <button
                        onClick={() => toggleUpvote(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition ${
                          post.upvoted
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ChevronUp className="w-4 h-4" />
                        {post.upvotes > 0 && post.upvotes}
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition">
                        <Flame className="w-4 h-4 text-orange-500" />
                        {post.hot > 0 && (
                          <span className="text-orange-500">{post.hot}</span>
                        )}
                      </button>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {post.comments.length > 0 && post.comments.length}
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Comments section */}
                  {post.showComments && (
                    <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2.5 text-sm">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-br ${getColor(comment.username)} flex items-center justify-center shrink-0`}
                          >
                            <span className="text-white text-xs font-semibold">
                              {getInitials(comment.author)}
                            </span>
                          </div>
                          <div className="flex-1 bg-card rounded-xl px-3 py-2 border border-border">
                            <p className="font-semibold text-xs mb-0.5">
                              {comment.author}
                            </p>
                            <p className="text-foreground/80">
                              {comment.content}
                            </p>
                            <p className="text-muted-foreground text-[10px] mt-1">
                              {comment.timestamp}
                            </p>
                          </div>
                          {comment.username === currentUser?.username && (
                            <button
                              onClick={() =>
                                setPosts(
                                  posts.map((p) =>
                                    p.id === post.id
                                      ? {
                                          ...p,
                                          comments: p.comments.filter(
                                            (c) => c.id !== comment.id,
                                          ),
                                        }
                                      : p,
                                  ),
                                )
                              }
                              className="text-muted-foreground hover:text-destructive transition self-start mt-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Comment input */}
                      <div className="flex gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-br ${getColor(currentUser?.username ?? "")} flex items-center justify-center shrink-0`}
                        >
                          <span className="text-white text-xs font-semibold">
                            {getInitials(currentUser?.displayName ?? "")}
                          </span>
                        </div>
                        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
                          <input
                            placeholder="Tham gia thảo luận..."
                            value={commentInputs[post.id] ?? ""}
                            onChange={(e) =>
                              setCommentInputs({
                                ...commentInputs,
                                [post.id]: e.target.value,
                              })
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleAddComment(post.id)
                            }
                            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                          />
                          <button className="text-muted-foreground hover:text-foreground transition p-0.5">
                            <Image className="w-4 h-4" />
                          </button>
                          <button className="text-muted-foreground hover:text-foreground transition p-0.5">
                            <Smile className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className="text-primary hover:text-primary/80 transition p-0.5 disabled:opacity-30"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Load more */}
          {!isLoading && !fetchError && page + 1 < totalPages && (
            <div className="flex justify-center pb-4">
              <Button
                variant="outline"
                className="rounded-xl px-6"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  `Xem thêm (trang ${page + 2}/${totalPages})`
                )}
              </Button>
            </div>
          )}

          {/* No posts */}
          {!isLoading && !fetchError && posts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-sm">
                Chưa có bài viết nào. Hãy là người đầu tiên đăng bài!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <FeedSidebar />
    </div>
  );
}
