'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, List, Kanban, UserCog, X } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: List },
  { href: '/dashboard/leads/kanban', label: 'Kanban', icon: Kanban },
  { href: '/dashboard/users', label: 'Users', icon: UserCog, adminOnly: true },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isAdmin } = usePermission();

  return (
    <aside className="w-64 bg-white border-r flex flex-col h-full overflow-y-auto">
      <div className="p-4 md:p-6 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">CRM App</h1>
        <button
          onClick={onClose}
          className="md:hidden p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <Icon size={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}