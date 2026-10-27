'use client';

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/ui.store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function TopBar() {
  const { user } = useAuth();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden h-8 w-8 text-slate-500"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search doctors, patients..."
            className="pl-9 h-9 text-sm bg-slate-50 border-slate-200 focus-visible:bg-white rounded-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-sm transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <Avatar className="h-8 w-8 rounded-sm bg-blue-600 text-white font-medium text-xs flex items-center justify-center">
            <AvatarFallback className="bg-blue-600 text-white rounded-sm font-semibold">
              {user?.email ? user.email.slice(0, 1).toUpperCase() : 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-xs">
            <p className="font-semibold text-slate-700 leading-tight">
              {user?.email?.split('@')[0] || 'Admin'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
