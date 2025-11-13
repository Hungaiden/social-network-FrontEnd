"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Users, Home, User, LogOut, Bell, Search } from "lucide-react"
import { useState } from "react"

export default function Sidebar({ currentUser, currentView, onViewChange, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications] = useState([
    {
      id: "1",
      type: "friend_request",
      message: "Emma Wilson sent you a friend request",
      time: "10 min ago",
      read: false,
    },
    { id: "2", type: "comment", message: "Alex Johnson commented on your post", time: "1 hour ago", read: false },
    { id: "3", type: "reaction", message: "Sarah Smith loved your post", time: "2 hours ago", read: true },
    { id: "4", type: "message", message: "You have a new message from Mike Chen", time: "3 hours ago", read: true },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const searchResults = [
    { id: "1", type: "user", name: "Emma Wilson", username: "emmaw", avatar: "/placeholder.svg?key=emma01" },
    { id: "2", type: "user", name: "David Brown", username: "davidb", avatar: "/placeholder.svg?key=david01" },
  ].filter(
    (result) =>
      searchQuery &&
      (result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.username.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const navItems = [
    { id: "timeline", label: "Home", icon: Home },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "friends", label: "Friends", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center font-bold text-sidebar-accent-foreground">
            {currentUser?.displayName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sidebar-foreground">{currentUser?.displayName}</p>
            <p className="text-xs text-sidebar-foreground/70">@{currentUser?.username}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-sidebar-border space-y-2">
        <div className="relative">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/20 text-sidebar-foreground hover:bg-sidebar-accent/30 transition"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search...</span>
          </button>

          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 p-3">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              {searchResults.length > 0 && (
                <div className="mt-2 space-y-2 max-h-48 overflow-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      className="w-full flex items-center gap-2 p-2 hover:bg-muted rounded transition text-left"
                    >
                      <img
                        src={result.avatar || "/placeholder.svg"}
                        alt={result.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{result.name}</p>
                        <p className="text-xs text-muted-foreground">@{result.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">No results found</p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/20 text-sidebar-foreground hover:bg-sidebar-accent/30 transition relative"
        >
          <Bell className="w-4 h-4" />
          <span className="text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="bg-card border border-border rounded-lg shadow-lg p-3 space-y-2 max-h-64 overflow-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-muted-foreground">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-2 rounded text-xs ${notif.read ? "bg-muted/30" : "bg-primary/10 border border-primary/20"}`}
                >
                  <p className="font-medium text-foreground">{notif.message}</p>
                  <p className="text-muted-foreground text-xs mt-1">{notif.time}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === id
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/20"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/20 bg-transparent"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
