'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'border border-border bg-card rounded-xl shadow-xs p-3.5 sm:p-5 flex flex-col justify-between transition-colors',
        className
      )}
    >
      <div className="flex items-start gap-2.5 sm:gap-3.5">
        <div
          className={cn(
            'w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0',
            iconBg
          )}
        >
          <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-[12px] font-medium text-muted-foreground truncate leading-tight">
            {title}
          </p>
          <h3 className="text-[19px] sm:text-[26px] font-bold text-foreground leading-tight mt-1 truncate">
            {value}
          </h3>
        </div>
      </div>
    </Card>
  );
}
