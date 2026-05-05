'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';
import userService from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: any;
  onSuccess: (updatedUser: any) => void;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  currentUser,
  onSuccess,
}: EditProfileDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [hasAvatarChanged, setHasAvatarChanged] = useState(false);

  // Reset form khi dialog mở hoặc currentUser thay đổi
  useEffect(() => {
    if (open) {
      setDisplayName(currentUser?.displayName || '');
      setEmail(currentUser?.email || '');
      setBio(currentUser?.bio || '');
      setAvatar(currentUser?.avatar || '');
      setAvatarPreview(currentUser?.avatar || '');
      setHasAvatarChanged(false);
    }
  }, [open, currentUser]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image
      try {
        const imageUrl = await userService.uploadImage(file);
        setAvatar(imageUrl);
        setHasAvatarChanged(true);
        toast({
          title: 'Success',
          description: 'Ảnh uploaded thành công',
        });
      } catch (error: any) {
        console.error('Failed to upload image:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      toast({
        title: 'Error',
        description: 'Display name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const updateData: any = {
        displayName,
        email,
        bio,
      };

      // Chỉ gửi avatar nếu user upload ảnh mới
      if (hasAvatarChanged) {
        updateData.avatar = avatar;
      }

      const response = await userService.updateProfile(updateData);

      if (response.code === 1000 || response.code === 0) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });

        // Call onSuccess callback với data từ response API
        onSuccess({
          ...currentUser,
          ...response.result,
        });

        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label htmlFor="avatar">Ảnh đại diện</Label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <label htmlFor="avatar-input" className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById('avatar-input')?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Tải lên
                </Button>
              </label>
            </div>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Tên hiển thị</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nhập tên hiển thị"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Tiểu sử</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Nhập tiểu sử của bạn"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
