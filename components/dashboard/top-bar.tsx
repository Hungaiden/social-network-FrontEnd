"use client";

import { useRouter } from "next/navigation";
import { Search, Sun, UserPlus, MessageCircle, Bell, Plus } from "lucide-react";
import { useUser } from "@/lib/user-context";

export default function TopBar() {
  const router = useRouter();
  const { currentUser } = useUser();
  const initials = currentUser?.displayName?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="h-16 border-b border-border bg-background flex items-center px-6 gap-3 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè, nhóm, bài viết..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Đăng bài */}
      <button
        onClick={() => router.push("/dashboard/timeline")}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition shrink-0"
      >
        <Plus className="w-4 h-4" />
        Đăng bài
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action icons */}
      <div className="flex items-center gap-0.5">
        <button className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-foreground/60 hover:text-foreground transition">
          <Sun className="w-5 h-5" />
        </button>
        <button className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-foreground/60 hover:text-foreground transition">
          <UserPlus className="w-5 h-5" />
        </button>
        <button
          onClick={() => router.push("/dashboard/messages")}
          className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-foreground/60 hover:text-foreground transition"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="relative w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-foreground/60 hover:text-foreground transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            3
          </span>
        </button>
        <button
          onClick={() => router.push("/dashboard/profile")}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm ml-1 hover:opacity-90 transition"
        >
          {initials}
        </button>
      </div>
    </div>
  );
}
