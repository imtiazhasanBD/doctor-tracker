'use client';

import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function TopBar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-100 dark:border-[#131f38] bg-white dark:bg-[#0b1325] px-8 shrink-0 transition-colors">
      {/* Search Input */}
      <div className="relative w-full max-w-[420px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] dark:text-[#5a6d8c]" />
        <input
          type="text"
          placeholder="Search doctors, patients..."
          className="w-full h-10 pl-10 pr-4 text-[12.5px] bg-[#f8fafc] dark:bg-[#10192e] border border-slate-200/80 dark:border-[#1c2a47] rounded-xl text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-[#5a6d8c] focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:border-[#38bdf8] transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 text-[#64748b] dark:text-[#8596b3] hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#121e38] rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell className="h-[19px] w-[19px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ef4444] ring-2 ring-white dark:ring-[#0b1325]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer select-none pl-1">
          <div className="h-8 w-8 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {user?.email ? user.email.slice(0, 1).toUpperCase() : 'A'}
          </div>
          <span className="font-bold text-[13px] text-[#0f172a] dark:text-white">
            {user?.email ? user.email.split('@')[0] : 'Admin'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#94a3b8] dark:text-[#5a6d8c]" />
        </div>
      </div>
    </header>
  );
}
