'use client';

import { useUser } from '@/lib/user-context';
import Profile from '@/components/dashboard/profile';

export default function ProfilePage() {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <Profile currentUser={currentUser} />;
}
