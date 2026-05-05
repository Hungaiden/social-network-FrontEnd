'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Profile from '@/components/dashboard/profile';
import { useToast } from '@/hooks/use-toast';
import friendService from '@/services/friendService';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params?.userId as string;
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await friendService.getUserProfile(userId);

        if (response && response.result) {
          setUserProfile(response.result);
        } else {
          setError('Không thể tải thông tin người dùng');
          toast({
            title: 'Error',
            description: 'Failed to load user profile',
            variant: 'destructive',
          });
        }
      } catch (err: any) {
        console.error('Failed to fetch user profile:', err);
        setError(err.message || 'Failed to load user profile');
        toast({
          title: 'Error',
          description: err.message || 'Failed to load user profile',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, toast]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error || 'Không thể tải thông tin người dùng'}</p>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return <Profile user={userProfile} isViewingOtherProfile={true} />;
}
