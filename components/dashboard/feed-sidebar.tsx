"use client";

import { RefreshCw, Heart, Users } from "lucide-react";

const onlineFriends = [
  {
    id: "1",
    name: "SHIKU",
    username: "shiku",
    initials: "SH",
    color: "from-teal-400 to-cyan-500",
  },
];

const vibeOptions = ["Hành động", "Tình cảm", "Hài", "Kinh dị"];

export default function FeedSidebar() {
  return (
    <aside className="w-72 shrink-0 border-l border-border overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Vibe Check */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Vibe Check
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />2
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Thể loại phim yêu thích?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {vibeOptions.map((opt) => (
              <button
                key={opt}
                className="px-3 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted hover:border-primary/40 transition text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Online friends */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              Bạn bè online
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {onlineFriends.length}
              </span>
              <button className="text-muted-foreground hover:text-foreground transition">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {onlineFriends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${friend.color} flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold">
                      {friend.initials}
                    </span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {friend.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{friend.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground space-y-1 px-1">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-foreground transition">
              Giới thiệu
            </a>
            <a href="#" className="hover:text-foreground transition">
              Hỗ trợ
            </a>
            <a href="#" className="hover:text-foreground transition">
              Điều khoản
            </a>
            <a href="#" className="hover:text-foreground transition">
              Quyền riêng tư
            </a>
          </div>
          <p>© 2025 SHIKU SOCIAL</p>
        </div>
      </div>
    </aside>
  );
}
