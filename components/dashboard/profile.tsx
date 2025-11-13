"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Profile({ currentUser }) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar || "/placeholder.svg"}
                  alt={currentUser.displayName}
                  className="w-24 h-24 rounded-full"
                />
                <div>
                  <CardTitle>{currentUser.displayName}</CardTitle>
                  <p className="text-muted-foreground">@{currentUser.username}</p>
                  <p className="text-sm text-muted-foreground mt-2">{currentUser.email}</p>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{currentUser.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Display Name</p>
              <p className="font-medium">{currentUser.displayName}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
