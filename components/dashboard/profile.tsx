'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Zap, Users, Calendar, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import friendService from '@/services/friendService';
import { useToast } from '@/hooks/use-toast';
import EditProfileDialog from './edit-profile-dialog';

interface ProfileProps {
  currentUser?: any;
  user?: any;
  isViewingOtherProfile?: boolean;
}

export default function Profile({
  currentUser,
  user,
  isViewingOtherProfile = false,
}: ProfileProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { setCurrentUser } = useUser();
  const profileData = isViewingOtherProfile ? user : currentUser;
  const [selectedTab, setSelectedTab] = useState('posts');
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userData, setUserData] = useState(isViewingOtherProfile ? user : currentUser);

  useEffect(() => {
    if (selectedTab === 'friends') {
      fetchFriends();
    }
  }, [selectedTab]);

  useEffect(() => {
    setUserData(isViewingOtherProfile ? user : currentUser);
  }, [user, currentUser, isViewingOtherProfile]);

  const fetchFriends = async () => {
    try {
      setIsLoadingFriends(true);
      const response = await friendService.getMyFriends({ page: 0, size: 100 });

      if (response.code === 0 && response.result) {
        setFriends(response.result.content);
      } else {
        setFriends([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch friends:', err);
      setFriends([]);
      toast({
        title: 'Error',
        description: 'Failed to load friends',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleEditProfileSuccess = (updatedUser: any) => {
    setUserData(updatedUser);
    if (!isViewingOtherProfile) {
      setCurrentUser(updatedUser);
    }
    toast({
      title: 'Thành công',
      description: 'Hồ sơ đã được cập nhật',
    });
  };

  if (!profileData) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Không tìm thấy thông tin người dùng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background overflow-auto flex flex-col">
      {/* Profile Header - Full Width */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {isViewingOtherProfile && (
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
          )}
          <div className="flex items-start justify-between gap-8">
            <div className="flex items-start gap-6 flex-1">
              <div className="relative">
                <img
                  src={userData?.avatar || '/placeholder.svg'}
                  alt={userData?.displayName}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-1">{userData?.displayName}</h1>
                <p className="text-muted-foreground mb-2">@{userData?.username}</p>
                <p className="text-foreground mb-4">{userData?.bio || 'Chưa có biệt danh'}</p>
                {!isViewingOtherProfile && (
                  <p className="text-sm text-muted-foreground mb-4">{userData?.email}</p>
                )}
                <div className="flex gap-3">
                  {!isViewingOtherProfile && (
                    <Button
                      className="bg-black text-white rounded-full px-6 hover:bg-gray-800"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      Chính sửa hồ sơ
                    </Button>
                  )}
                  {isViewingOtherProfile && (
                    <>
                      <Button className="bg-blue-600 text-white rounded-full px-6 hover:bg-blue-700">
                        Thêm bạn
                      </Button>
                      <Button variant="outline" className="rounded-full px-6">
                        Nhắn tin
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="rounded-full px-6">
                    Tùy chỉnh
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex gap-8 text-center">
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-muted-foreground font-semibold">BÀI VIẾT</p>
              </div>
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-muted-foreground font-semibold">BẠN BÈ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Bio Section */}
            <Card className="border border-gray-200 rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tiêu sử</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm text-center py-8">
                  Chưa cập nhật tiêu sử
                </p>
              </CardContent>
            </Card>

            {/* Photos Section */}
            <Card className="border border-gray-200 rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ảnh gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="col-span-9">
            {/* Tabs */}
            <div className="mb-6 bg-white rounded-xl border border-gray-200 p-2 flex gap-1">
              <button
                onClick={() => setSelectedTab('posts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  selectedTab === 'posts'
                    ? 'bg-black text-white'
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <Zap className="w-5 h-5" />
                Bài viết
              </button>
              <button
                onClick={() => setSelectedTab('info')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  selectedTab === 'info'
                    ? 'bg-black text-white'
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Thông tin
              </button>
              <button
                onClick={() => setSelectedTab('friends')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  selectedTab === 'friends'
                    ? 'bg-black text-white'
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                Bạn bè
              </button>
              <button
                onClick={() => setSelectedTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  selectedTab === 'analytics'
                    ? 'bg-black text-white'
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Phân tích
              </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl border border-gray-200 min-h-[400px]">
              {selectedTab === 'posts' && (
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Zap className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold">Chưa có bài viết nào</p>
                    <p className="text-muted-foreground text-sm">
                      Chia sẻ khoảnh khắc đầu tiên của bạn!
                    </p>
                  </div>
                </div>
              )}

              {selectedTab === 'info' && (
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-2">Email</p>
                    <p className="text-foreground">{userData?.email || 'N/A'}</p>
                  </div>
                  <div className="border-t" />
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-2">Username</p>
                    <p className="text-foreground">{userData?.username}</p>
                  </div>
                  <div className="border-t" />
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-2">Tên hiển thị</p>
                    <p className="text-foreground">{userData?.displayName}</p>
                  </div>
                  {userData?.bio && (
                    <>
                      <div className="border-t" />
                      <div>
                        <p className="text-sm text-muted-foreground font-semibold mb-2">Bio</p>
                        <p className="text-foreground">{userData?.bio}</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {selectedTab === 'friends' && (
                <div className="p-6">
                  {isLoadingFriends ? (
                    <div className="flex items-center justify-center py-16">
                      <p className="text-muted-foreground">Đang tải danh sách bạn bè...</p>
                    </div>
                  ) : friends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-semibold">Chưa có bạn bè</p>
                      <p className="text-muted-foreground text-sm">
                        Bắt đầu kết nối với mọi người!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {friends.map((friend) => (
                        <Link
                          key={friend.userId}
                          href={`/profile/${friend.userId}`}
                          className="group"
                        >
                          <div className="text-center cursor-pointer">
                            <img
                              src={friend.avatar || '/placeholder.svg'}
                              alt={friend.displayName}
                              className="w-20 h-20 rounded-full object-cover mx-auto mb-2 group-hover:opacity-80 transition"
                            />
                            <p className="font-semibold text-sm line-clamp-2">
                              {friend.displayName}
                            </p>
                            {friend.username && (
                              <p className="text-xs text-muted-foreground">@{friend.username}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'analytics' && (
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold">Chưa có dữ liệu</p>
                    <p className="text-muted-foreground text-sm">
                      Dữ liệu phân tích sẽ hiển thị ở đây
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {!isViewingOtherProfile && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          currentUser={userData}
          onSuccess={handleEditProfileSuccess}
        />
      )}
    </div>
  );
}
