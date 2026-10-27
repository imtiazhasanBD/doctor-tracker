'use client';

import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  growth: number;
  periodLabel: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function StatCard({
  title,
  value,
  growth,
  periodLabel,
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  const isPositive = growth >= 0;

  return (
    <Card className="border-slate-200 bg-white rounded-sm shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold tracking-tight text-slate-800">{value}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span
                className={cn(
                  'flex items-center text-xs font-semibold',
                  isPositive ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                <TrendingUp className="mr-0.5 h-3 w-3" />
                {isPositive ? `+${growth}%` : `${growth}%`}
              </span>
              <span className="text-[11px] text-slate-400">{periodLabel}</span>
            </div>
          </div>

          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-sm',
              iconBg,
              iconColor
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
