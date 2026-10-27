'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Mini Sparkline SVG for Stat Cards
export const MiniSparkline = ({ color }: { color: string }) => {
  const gradId = `spark-${color.replace('#', '')}`;
  return (
    <svg width="76" height="34" viewBox="0 0 76 34" fill="none" className="shrink-0 select-none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d="M2 25C14 27 24 21 36 21C48 21 56 12 74 7V34H2V25Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M2 25C14 27 24 21 36 21C48 21 56 12 74 7"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export interface StatCardProps {
  title: string;
  value: string | number;
  growth: string | number;
  period?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  sparkColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  growth,
  period = 'from last month',
  icon: Icon,
  iconColor,
  iconBg,
  sparkColor = '#3b82f6',
  className,
}: StatCardProps) {
  const growthStr =
    typeof growth === 'number'
      ? growth >= 0
        ? `+${growth}%`
        : `${growth}%`
      : growth.startsWith('+') || growth.startsWith('-')
        ? growth
        : `+${growth}`;

  return (
    <Card
      className={cn(
        'border-slate-100/90 bg-white rounded-md shadow-[0_4px_15px_-3px_rgba(15,23,42,0.03)] p-5 flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            'w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0',
            iconBg
          )}
        >
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-[#64748b] truncate">
            {title}
          </p>
          <h3 className="text-[24px] sm:text-[26px] font-extrabold text-[#0f172a] leading-tight mt-0.5">
            {value}
          </h3>
        </div>
      </div>

      <div className="flex items-end justify-between mt-3.5 pt-1">
        <div>
          <span className="inline-flex items-center text-[11.5px] font-bold text-[#10b981]">
            ↑ {growthStr}
          </span>
          <p className="text-[11px] text-[#94a3b8] leading-tight">
            {period}
          </p>
        </div>
        <MiniSparkline color={sparkColor} />
      </div>
    </Card>
  );
}
