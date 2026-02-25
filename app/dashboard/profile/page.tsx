"use client";

import { useUser } from "@/lib/user-context";
import Profile from "@/components/dashboard/profile";

export default function ProfilePage() {
  const { currentUser } = useUser();
  return <Profile currentUser={currentUser} />;
}
