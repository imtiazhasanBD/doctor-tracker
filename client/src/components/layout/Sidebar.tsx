'use client';

import React, { useEffect, useState } from 'react';
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
  X,
} from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// DocTrack Logo SVG matching screenshot
export const DocTrackLogo = ({ className = 'h-9 w-9' }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0', className)}
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
  const { sidebarOpen, toggleSidebar, mobileOpen, setMobileOpen } = useUIStore();
  const { user, logout, isLoggingOut } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, setMobileOpen]);

  const showFull = isMobile ? true : sidebarOpen;
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
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* Main Sidebar Aside */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-sidebar-border bg-sidebar select-none transition-transform lg:transition-all duration-300 ease-in-out h-screen overflow-hidden',
          // Mobile drawer dimensions & translation
          'w-[260px] max-w-[85vw] shadow-2xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop static flow & width
          'lg:static lg:translate-x-0 lg:shadow-none lg:z-30 shrink-0',
          sidebarOpen ? 'lg:w-[235px]' : 'lg:w-[72px]'
        )}
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Brand Header */}
          <div
            className={cn(
              'flex pt-5 pb-3 transition-all shrink-0',
              showFull
                ? 'items-center justify-between px-4'
                : 'flex-col items-center gap-2 px-2'
            )}
          >
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2.5 overflow-hidden',
                !showFull && 'justify-center'
              )}
              title="DocTrack"
            >
              <DocTrackLogo />
              {showFull && (
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

            {/* Desktop Toggle Icon Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors shrink-0 cursor-pointer"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              id="mobile-menu-close"
              onClick={() => setMobileOpen(false)}
              className="flex lg:hidden p-1.5 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors shrink-0 cursor-pointer"
              title="Close navigation"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav
            className={cn(
              'space-y-1.5 pt-3 flex-1 min-h-0 overflow-y-auto',
              showFull ? 'px-3.5' : 'px-2.5'
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
                  onClick={() => setMobileOpen(false)}
                  title={!showFull ? item.title : undefined}
                  className={cn(
                    'flex items-center text-[13px] font-semibold rounded-xl transition-all',
                    showFull ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-2.5',
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
                  {showFull && <span className="truncate">{item.title}</span>}
                </Link>
              );
            })}

            {/* OTHER SECTION */}
            {showFull ? (
              <div className="pt-4 pb-1 px-3.5">
                <span className="text-[10px] font-bold text-muted-foreground/80 tracking-wider uppercase">
                  OTHER
                </span>
              </div>
            ) : (
              <div className="my-3 h-px w-7 bg-sidebar-border mx-auto" />
            )}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                logout();
              }}
              disabled={isLoggingOut}
              title={!showFull ? 'Logout' : undefined}
              className={cn(
                'flex w-full items-center text-[13px] font-medium text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all cursor-pointer',
                showFull ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-2.5'
              )}
            >
              <LogOut className="h-4 w-4 text-muted-foreground shrink-0" />
              {showFull && <span>Logout</span>}
            </button>
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div
          className={cn(
            'border-t border-sidebar-border transition-all shrink-0 bg-sidebar',
            showFull ? 'p-3 pb-8 lg:pb-3' : 'p-2'
          )}
        >
          <div
            className={cn(
              'flex items-center rounded-xl transition-colors select-none hover:bg-sidebar-accent/50 cursor-pointer',
              showFull ? 'gap-3 px-2 py-1.5' : 'justify-center p-1.5'
            )}
            title={!showFull ? `${displayName} (${displayEmail})` : undefined}
          >
            <div className="h-9 w-9 rounded-full bg-secondary border border-sidebar-border/80 text-foreground font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {initial}
            </div>
            {showFull && (
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
    </>
  );
}
