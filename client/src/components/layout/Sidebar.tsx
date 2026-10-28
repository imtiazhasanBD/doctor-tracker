'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  Stethoscope,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// DocTrack Logo SVG matching screenshot
const DocTrackLogo = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <defs>
      <linearGradient id="heartGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00c6ff" />
        <stop offset="100%" stopColor="#0072ff" />
      </linearGradient>
    </defs>
    <path
      d="M20 35C20 35 6 25.5 6 15C6 9.5 10 5.5 15.5 5.5C18 5.5 20 7 20 7C20 7 22 5.5 24.5 5.5C30 5.5 34 9.5 34 15C34 25.5 20 35 20 35Z"
      fill="url(#heartGrad)"
    />
    {/* ECG Heartbeat line inside */}
    <path
      d="M10 17H15L17.5 11.5L21.5 22.5L24 15L26 17H30"
      stroke="#ffffff"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout, isLoggingOut } = useAuth();

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User');
  const displayEmail = user?.email || '';
  const initial = (displayName.trim().charAt(0) || 'U').toUpperCase();

  const mainNav = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutGrid,
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
        'relative flex flex-col justify-between border-r border-sidebar-border bg-sidebar transition-all duration-300 z-30 shrink-0 select-none h-screen overflow-hidden',
        sidebarOpen ? 'w-[235px]' : 'w-[72px]'
      )}
    >
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Brand Header */}
        <div
          className={cn(
            'flex pt-5 pb-3 transition-all shrink-0',
            sidebarOpen
              ? 'items-center justify-between px-4'
              : 'flex-col items-center gap-2 px-2'
          )}
        >
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-2.5 overflow-hidden',
              !sidebarOpen && 'justify-center'
            )}
            title="DocTrack"
          >
            <DocTrackLogo />
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[18px] text-sidebar-foreground tracking-tight leading-tight truncate">
                  Doc<span className="text-sidebar-primary">Track</span>
                </span>
                <span className="text-[9.5px] text-muted-foreground font-medium tracking-tight truncate">
                  Doctor Management System
                </span>
              </div>
            )}
          </Link>

          {/* Toggle Icon Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors shrink-0 cursor-pointer"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <nav
          className={cn(
            'space-y-1.5 pt-3 flex-1 min-h-0 overflow-y-auto',
            sidebarOpen ? 'px-3.5' : 'px-2.5'
          )}
        >
          {mainNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.title : undefined}
                className={cn(
                  'flex items-center text-[13px] font-semibold rounded-xl transition-all',
                  sidebarOpen ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-2.5',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-xs'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-sidebar-primary' : 'text-muted-foreground'
                  )}
                />
                {sidebarOpen && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}

          {/* OTHER SECTION */}
          {sidebarOpen ? (
            <div className="pt-4 pb-1 px-3.5">
              <span className="text-[10px] font-bold text-muted-foreground/80 tracking-wider uppercase">
                OTHER
              </span>
            </div>
          ) : (
            <div className="my-3 h-px w-7 bg-sidebar-border mx-auto" />
          )}

          <Link
            href="/dashboard"
            title={!sidebarOpen ? 'Settings' : undefined}
            className={cn(
              'flex items-center text-[13px] font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-xl transition-all',
              sidebarOpen ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-2.5'
            )}
          >
            <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </Link>

          <button
            type="button"
            onClick={() => logout()}
            disabled={isLoggingOut}
            title={!sidebarOpen ? 'Logout' : undefined}
            className={cn(
              'flex w-full items-center text-[13px] font-medium text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all cursor-pointer',
              sidebarOpen ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-2.5'
            )}
          >
            <LogOut className="h-4 w-4 text-muted-foreground shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Bottom User Profile Section */}
      <div
        className={cn(
          'border-t border-sidebar-border transition-all shrink-0 bg-sidebar',
          sidebarOpen ? 'p-3' : 'p-2'
        )}
      >
        <div
          className={cn(
            'flex items-center rounded-xl transition-colors select-none hover:bg-sidebar-accent/50 cursor-pointer',
            sidebarOpen ? 'gap-3 px-2 py-1.5' : 'justify-center p-1.5'
          )}
          title={!sidebarOpen ? `${displayName} (${displayEmail})` : undefined}
        >
          <div className="h-9 w-9 rounded-full bg-secondary border border-sidebar-border/80 text-foreground font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {initial}
          </div>
          {sidebarOpen && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[13px] text-sidebar-foreground leading-tight truncate">
                {displayName}
              </span>
              <span className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                {displayEmail}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
