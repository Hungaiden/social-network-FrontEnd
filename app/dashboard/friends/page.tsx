"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";
import Friends from "@/components/dashboard/friends";

export default function FriendsPage() {
  const { currentUser } = useUser();
  const router = useRouter();

  const handleMessageFriend = (friendUserId: string) => {
    router.push(`/dashboard/messages?userId=${friendUserId}`);
  };

  return (
    <Friends currentUser={currentUser} onMessageFriend={handleMessageFriend} />
  );
}
