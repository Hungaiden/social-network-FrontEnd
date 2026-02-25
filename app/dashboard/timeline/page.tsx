"use client";

import { useUser } from "@/lib/user-context";
import Timeline from "@/components/dashboard/timeline";

export default function TimelinePage() {
  const { currentUser } = useUser();
  return <Timeline currentUser={currentUser} />;
}
