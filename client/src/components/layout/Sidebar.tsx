'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserRound,
  LogOut,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { logout, isLoggingOut } = useAuth();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Doctors',
      href: '/doctors',
      icon: Stethoscope,
    },
    {
      title: 'Patients',
      href: '/patients',
      icon: Users,
    },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 z-30 shrink-0 select-none',
        sidebarOpen ? 'w-56' : 'w-16'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-blue-600 text-white shadow-sm">
            <Stethoscope className="h-5 w-5" />
          </div>
          {sidebarOpen && (
            <span className="font-semibold text-slate-800 text-base tracking-tight truncate">
              Doctor Tracker
            </span>
          )}
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1.5 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
              title={!sidebarOpen ? item.title : undefined}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-blue-600' : 'text-slate-500')} />
              {sidebarOpen && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle & Logout */}
      <div className="p-3 border-t space-y-1">
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className={cn(
            'flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-sm hover:bg-red-50 hover:text-red-600 transition-colors'
          )}
          title="Logout"
        >
          <LogOut className="h-4 w-4 shrink-0 text-slate-500" />
          {sidebarOpen && <span>Logout</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className="hidden md:flex w-full items-center justify-center py-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-sm transition-colors"
          title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
