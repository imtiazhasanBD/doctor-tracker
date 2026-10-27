import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 7, rows = 6 }: TableSkeletonProps) {
  return (
    <div className="border border-slate-200 bg-white rounded-sm overflow-hidden animate-pulse">
      {/* Table Header skeleton */}
      <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={`h-3 bg-slate-200 rounded-sm ${
              i === 0 ? 'w-8' : i === 1 ? 'w-32' : 'flex-1'
            }`}
          />
        ))}
      </div>

      {/* Table Rows skeleton */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="h-12 flex items-center px-4 gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={c}
                className={`h-3.5 bg-slate-100 rounded-sm ${
                  c === 0
                    ? 'w-6'
                    : c === 1
                    ? 'w-28'
                    : c === columns - 1
                    ? 'w-14 ml-auto'
                    : 'flex-1 max-w-[120px]'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-5 border border-slate-200 bg-white rounded-sm flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="h-3 w-20 bg-slate-100 rounded-sm" />
              <div className="h-7 w-16 bg-slate-200 rounded-sm" />
              <div className="h-2.5 w-24 bg-slate-100 rounded-sm" />
            </div>
            <div className="h-10 w-10 bg-slate-100 rounded-sm shrink-0" />
          </div>
        ))}
      </div>

      {/* 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar chart skeleton */}
        <div className="p-5 border border-slate-200 bg-white rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-slate-200 rounded-sm" />
            <div className="h-4 w-16 bg-slate-100 rounded-sm" />
          </div>
          <div className="h-[250px] flex items-end justify-between gap-3 pt-6 px-4">
            <div className="w-12 h-[40%] bg-slate-100 rounded-sm" />
            <div className="w-12 h-[80%] bg-slate-200 rounded-sm" />
            <div className="w-12 h-[35%] bg-slate-100 rounded-sm" />
            <div className="w-12 h-[60%] bg-slate-200 rounded-sm" />
            <div className="w-12 h-[50%] bg-slate-100 rounded-sm" />
          </div>
        </div>

        {/* Donut chart skeleton */}
        <div className="p-5 border border-slate-200 bg-white rounded-sm space-y-4">
          <div className="h-4 w-36 bg-slate-200 rounded-sm" />
          <div className="h-[250px] flex items-center justify-between gap-6 px-4">
            <div className="h-36 w-36 rounded-full border-[18px] border-slate-100 shrink-0" />
            <div className="flex-1 space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="h-3 w-24 bg-slate-100 rounded-sm" />
                  <div className="h-3 w-8 bg-slate-200 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DoctorDetailSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Back link */}
      <div className="h-3.5 w-24 bg-slate-200 rounded-sm" />

      {/* Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-36 bg-slate-200 rounded-sm" />
              <div className="h-4 w-20 bg-slate-100 rounded-sm" />
            </div>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-3 w-28 bg-slate-100 rounded-sm" />
              <div className="h-3 w-24 bg-slate-100 rounded-sm" />
              <div className="h-3 w-36 bg-slate-100 rounded-sm" />
            </div>
          </div>
        </div>
        <div className="h-10 w-24 bg-slate-100 rounded-sm hidden md:block" />
      </div>

      {/* Table skeleton */}
      <TableSkeleton columns={7} rows={5} />
    </div>
  );
}
