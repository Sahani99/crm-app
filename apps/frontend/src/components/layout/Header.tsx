'use client';

import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const logout = useLogout();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu size={24} />
      </button>
      <div />
      <div className="flex items-center gap-2 md:gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <Badge variant="outline" className="text-xs">
            {user?.role?.replace('_', ' ')}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="text-xs md:text-sm">
          Logout
        </Button>
      </div>
    </header>
  );
}