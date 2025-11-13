"use client"

import { useState } from "react"
import Login from "@/components/auth/login"
import Dashboard from "@/components/dashboard/dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={(user) => {
          setCurrentUser(user)
          setIsLoggedIn(true)
        }}
      />
    )
  }

  return <Dashboard currentUser={currentUser} onLogout={() => setIsLoggedIn(false)} />
}
