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
        'border border-border bg-card rounded-md shadow-xs p-5 flex flex-col justify-between transition-colors',
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            'w-11 h-11 rounded-md flex items-center justify-center shrink-0',
            iconBg
          )}
        >
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-muted-foreground truncate">
            {title}
          </p>
          <h3 className="text-[24px] sm:text-[26px] font-bold text-foreground leading-tight mt-0.5">
            {value}
          </h3>
        </div>
      </div>
    </Card>
  );
}
