"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/lib/user-context";
import Chat from "@/components/dashboard/chat";

function MessagesContent() {
  const { currentUser } = useUser();
  const searchParams = useSearchParams();
  const preSelectedUserId = searchParams.get("userId");

  return (
    <Chat currentUser={currentUser} preSelectedUserId={preSelectedUserId} />
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
