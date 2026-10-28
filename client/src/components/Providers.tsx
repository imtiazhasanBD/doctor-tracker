'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <TooltipProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
