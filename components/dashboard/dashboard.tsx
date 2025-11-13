"use client"

import { useState } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import Timeline from "@/components/dashboard/timeline"
import Profile from "@/components/dashboard/profile"
import Chat from "@/components/dashboard/chat"
import Friends from "@/components/dashboard/friends"

type ViewType = "timeline" | "profile" | "friends" | "messages"

export default function Dashboard({ currentUser, onLogout }) {
  const [currentView, setCurrentView] = useState<ViewType>("timeline")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentUser={currentUser} currentView={currentView} onViewChange={setCurrentView} onLogout={onLogout} />
      <div className="flex-1 overflow-hidden">
        {currentView === "timeline" && <Timeline currentUser={currentUser} />}
        {currentView === "profile" && <Profile currentUser={currentUser} />}
        {currentView === "friends" && <Friends currentUser={currentUser} />}
        {currentView === "messages" && <Chat currentUser={currentUser} />}
      </div>
    </div>
  )
}
