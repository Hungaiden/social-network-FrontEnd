'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, MessageCircle, Users, User, LogOut, Search } from 'lucide-react';
import { logout } from '@/services/authService';
import { useUser } from '@/lib/user-context';

const navItems = [
  {
    id: 'timeline',
    label: 'Trang chủ',
    icon: Home,
    href: '/dashboard/timeline',
  },
  {
    id: 'messages',
    label: 'Tin nhắn',
    icon: MessageCircle,
    href: '/dashboard/messages',
  },
  { id: 'friends', label: 'Bạn bè', icon: Users, href: '/dashboard/friends' },
  { id: 'profile', label: 'Hồ sơ', icon: User, href: '/dashboard/profile' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useUser();

  const initials = currentUser?.displayName?.[0]?.toUpperCase() ?? '?';

  return (
    <aside className="w-64 bg-sidebar h-full flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shrink-0">
            <span className="text-black font-extrabold text-base leading-none">S</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">Fakebook</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 text-white/50 hover:bg-white/15 transition text-sm">
          <Search className="w-4 h-4 shrink-0" />
          <span>Tìm kiếm...</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon, href }) => {
          const active = pathname.startsWith(href);
          return (
            <button
              key={id}
              onClick={() => router.push(href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                active ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="px-4 py-4 border-t border-white/10 mt-2">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-sm">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{currentUser?.displayName}</p>
            <p className="text-white/50 text-xs truncate">Thành viên</p>
          </div>
          <button
            onClick={logout}
            title="Đăng xuất"
            className="text-white/40 hover:text-white transition p-1.5 rounded-lg hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
