"use client"

import { Home, MessageCircle, Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MainNavProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function MainNav({ currentPage, onNavigate }: MainNavProps) {
  return (
    <nav className="w-64 border-r border-border bg-card p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">SocialHub</h1>
      </div>

      <div className="space-y-2">
        <Button
          variant={currentPage === "home" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onNavigate("home")}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>

        <Button
          variant={currentPage === "profile" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onNavigate("profile")}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>

        <Button
          variant={currentPage === "chat" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onNavigate("chat")}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Messages
        </Button>

        <Button
          variant={currentPage === "notifications" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onNavigate("notifications")}
        >
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
      </div>

      <div className="absolute bottom-4 left-4">
        <Button variant="destructive" className="w-56 justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  )
}
