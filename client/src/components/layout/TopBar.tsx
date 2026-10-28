'use client';

import React from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/ui.store';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DocTrackLogo } from '@/components/layout/Sidebar';

export function TopBar() {
  const { user } = useAuth();
  const { toggleMobile } = useUIStore();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:px-8 shrink-0 transition-colors gap-3">
      {/* Left: Mobile hamburger + DocTrack logo on mobile; Desktop search bar on lg+ */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          id="mobile-menu-btn"
          onClick={toggleMobile}
          className="p-2 -ml-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors shrink-0 cursor-pointer lg:hidden"
          title="Open Menu"
          aria-label="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand in TopBar on mobile matching mockup */}
        <div className="flex items-center gap-2 lg:hidden select-none">
          <DocTrackLogo className="h-7 w-7" />
          <span className="font-bold text-[17px] text-foreground tracking-tight leading-none">
            Doc<span className="text-primary">Track</span>
          </span>
        </div>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden lg:flex relative w-full max-w-[420px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search doctors, patients..."
          className="w-full h-10 pl-10 pr-4 text-[12.5px] bg-secondary border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-[19px] w-[19px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer select-none pl-1">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-xs">
            {user?.name ? user.name.slice(0, 1).toUpperCase() : (user?.email ? user.email.slice(0, 1).toUpperCase() : 'A')}
          </div>
          <span className="hidden sm:inline-block font-bold text-[13px] text-foreground">
            {user?.name || (user?.email ? user.email.split('@')[0] : 'Admin')}
          </span>
          <ChevronDown className="hidden sm:inline-block h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
