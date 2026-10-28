'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace('/login');
    }
  }, [user, isLoading, isError, router]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Suspense fallback={<aside className="w-64 border-r border-border bg-sidebar shrink-0" />}>
        <Sidebar />
      </Suspense>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Suspense fallback={<header className="h-16 w-full border-b border-border bg-card shrink-0" />}>
          <TopBar />
        </Suspense>
        <main id="main-scroll-container" className="flex-1 px-3 sm:px-4 pt-4 pb-8 sm:pb-6 overflow-y-auto bg-background">
          <div className="mx-auto max-w-[1500px]">
            <Suspense fallback={null}>
              {isLoading ? (
                <div className="flex min-h-[55vh] w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs text-muted-foreground font-medium">Checking session...</p>
                  </div>
                </div>
              ) : !user ? (
                <div className="flex min-h-[55vh] w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs text-muted-foreground font-medium">Redirecting to login...</p>
                  </div>
                </div>
              ) : (
                children
              )}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
