'use client';

import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function TopBar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-8 shrink-0 transition-colors">
      {/* Search Input */}
      <div className="relative w-full max-w-[420px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search doctors, patients..."
          className="w-full h-10 pl-10 pr-4 text-[12.5px] bg-secondary border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
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
          <span className="font-bold text-[13px] text-foreground">
            {user?.name || (user?.email ? user.email.split('@')[0] : 'Admin')}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
