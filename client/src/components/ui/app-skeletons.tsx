import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 7, rows = 6 }: TableSkeletonProps) {
  return (
    <div className="border border-slate-200 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md overflow-hidden">
      {/* Table Header skeleton */}
      <div className="h-10 bg-slate-50 dark:bg-[#10192e] border-b border-slate-200 dark:border-[#162444] flex items-center px-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-3 ${i === 0 ? 'w-24' : i === 1 ? 'w-32' : 'flex-1'}`}
          />
        ))}
      </div>

      {/* Table Rows skeleton */}
      <div className="divide-y divide-slate-100 dark:divide-[#14203a]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="h-12 flex items-center px-4 gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={c}
                className={`h-3.5 ${
                  c === 0
                    ? 'w-28'
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

export function StatCardsRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="border-slate-100/90 dark:border-[#1c2d54] bg-white dark:bg-[#0e1933] rounded-md shadow-[0_4px_15px_-3px_rgba(15,23,42,0.03)] p-5 transition-colors"
        >
          <div className="flex items-start gap-3.5">
            <Skeleton className="w-11 h-11 rounded-md shrink-0 dark:bg-[#16294a]" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-24 dark:bg-[#16294a]" />
              <Skeleton className="h-7 w-16 dark:bg-[#16294a]" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function PatientsTableSkeleton({
  rows = 8,
  showDoctorColumn = true,
}: {
  rows?: number;
  showDoctorColumn?: boolean;
}) {
  return (
    <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-5 shadow-sm transition-colors">
      {/* Table Header: Patients Count & Action / Export buttons */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#172545]">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="h-5 w-32 dark:bg-[#15233c]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md dark:bg-[#15233c]" />
          {!showDoctorColumn && (
            <Skeleton className="h-8 w-24 rounded-md dark:bg-[#15233c]" />
          )}
        </div>
      </div>

      {/* Main Table Headers */}
      <div className="overflow-x-auto">
        <div className="flex items-center gap-4 py-3.5 border-b border-slate-100 dark:border-[#172545]">
          <Skeleton className="w-36 h-3.5 dark:bg-[#15233c]" />
          {showDoctorColumn && <Skeleton className="w-28 h-3.5 dark:bg-[#15233c]" />}
          <Skeleton className="w-12 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-16 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-24 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-24 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-20 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-16 h-3.5 ml-auto dark:bg-[#15233c]" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100/80 dark:divide-[#172545]/60">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex items-center gap-4 py-3.5">
              <div className="flex items-center gap-3 w-36">
                <Skeleton className="w-8 h-8 rounded-full shrink-0 dark:bg-[#142038]" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-3 w-20 dark:bg-[#142038]" />
                  <Skeleton className="h-2.5 w-16 dark:bg-[#142038]" />
                </div>
              </div>
              {showDoctorColumn && <Skeleton className="w-28 h-3.5 dark:bg-[#142038]" />}
              <Skeleton className="w-12 h-3.5 dark:bg-[#142038]" />
              <Skeleton className="w-16 h-3.5 dark:bg-[#142038]" />
              <Skeleton className="w-24 h-3.5 dark:bg-[#142038]" />
              <Skeleton className="w-24 h-3.5 dark:bg-[#142038]" />
              <Skeleton className="w-16 h-5 rounded-md dark:bg-[#142038]" />
              <div className="flex items-center gap-1.5 ml-auto">
                <Skeleton className="w-6 h-6 rounded-md dark:bg-[#142038]" />
                <Skeleton className="w-6 h-6 rounded-md dark:bg-[#142038]" />
                <Skeleton className="w-6 h-6 rounded-md dark:bg-[#142038]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-[#172545] gap-3">
        <Skeleton className="h-4 w-44 dark:bg-[#15233c]" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
        </div>
      </div>
    </Card>
  );
}

export function DoctorsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-5 shadow-sm transition-colors">
      {/* Card Header: Doctors list & Export CSV button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#172545]">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="h-5 w-28 dark:bg-[#15233c]" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md dark:bg-[#15233c]" />
      </div>

      {/* Main Table Headers */}
      <div className="overflow-x-auto">
        <div className="flex items-center gap-4 py-3.5 border-b border-slate-100 dark:border-[#172545]">
          <Skeleton className="w-40 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-28 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-32 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-28 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-16 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-16 h-3.5 dark:bg-[#15233c]" />
          <Skeleton className="w-16 h-3.5 ml-auto dark:bg-[#15233c]" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100/80 dark:divide-[#172545]/60">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex items-center gap-4 py-3.5">
              <div className="flex items-center gap-3 w-40">
                <Skeleton className="w-8 h-8 rounded-full shrink-0 dark:bg-[#142038]" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-3 w-24 dark:bg-[#142038]" />
                  <Skeleton className="h-2.5 w-16 dark:bg-[#142038]" />
                </div>
              </div>
              <Skeleton className="w-28 h-5 rounded-md dark:bg-[#142038]" />
              <Skeleton className="w-32 h-3.5 dark:bg-[#142038]" />
              <Skeleton className="w-28 h-3.5 dark:bg-[#142038]" />
              <Skeleton className="w-16 h-3.5 dark:bg-[#142038]" />
              <Skeleton className="w-16 h-5 rounded-md dark:bg-[#142038]" />
              <div className="flex items-center gap-1.5 ml-auto">
                <Skeleton className="w-6 h-6 rounded-md dark:bg-[#142038]" />
                <Skeleton className="w-6 h-6 rounded-md dark:bg-[#142038]" />
                <Skeleton className="w-6 h-6 rounded-md dark:bg-[#142038]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-[#172545] gap-3">
        <Skeleton className="h-4 w-44 dark:bg-[#15233c]" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
          <Skeleton className="w-7 h-7 rounded-md dark:bg-[#15233c]" />
        </div>
      </div>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      {/* 1. HERO WELCOME BANNER + 4 METRIC CARDS SKELETON */}
      <div className="relative rounded-md bg-gradient-to-r from-[#f3f9ff] via-[#eef6ff] to-[#e4f1fe] dark:from-[#0b1428] dark:via-[#0d172e] dark:to-[#101b36] pb-4 border border-white/80 dark:border-[#19284a] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] dark:shadow-none overflow-hidden transition-colors">
        {/* Top Banner Text Skeleton */}
        <div className="relative z-10 flex items-center justify-between pb-6 p-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28 dark:bg-[#15233c]" />
            <Skeleton className="h-7 w-64 dark:bg-[#15233c]" />
            <Skeleton className="h-3.5 w-80 dark:bg-[#15233c]" />
          </div>
        </div>

        {/* 4 Metric Cards Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="border-slate-100/90 dark:border-[#1c2d54] bg-white dark:bg-[#0e1933] rounded-md shadow-[0_4px_15px_-3px_rgba(15,23,42,0.03)] p-5 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <Skeleton className="w-11 h-11 rounded-md shrink-0 dark:bg-[#16294a]" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3 w-24 dark:bg-[#16294a]" />
                  <Skeleton className="h-7 w-16 dark:bg-[#16294a]" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE ROW: 2 CHARTS + QUICK ACTIONS SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Patients Per Doctor Bar Chart (5 cols) */}
        <Card className="lg:col-span-5 border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded dark:bg-[#162544]" />
              <Skeleton className="h-4 w-36 dark:bg-[#162544]" />
            </div>
            <Skeleton className="h-6 w-20 rounded-lg dark:bg-[#162544]" />
          </div>

          <div className="h-[225px] flex items-end justify-between gap-3 pt-6 px-4">
            <Skeleton className="w-7 h-[45%] rounded-t dark:bg-[#162544]" />
            <Skeleton className="w-7 h-[85%] rounded-t dark:bg-[#162544]" />
            <Skeleton className="w-7 h-[75%] rounded-t dark:bg-[#162544]" />
            <Skeleton className="w-7 h-[50%] rounded-t dark:bg-[#162544]" />
            <Skeleton className="w-7 h-[55%] rounded-t dark:bg-[#162544]" />
            <Skeleton className="w-7 h-[35%] rounded-t dark:bg-[#162544]" />
            <Skeleton className="w-7 h-[25%] rounded-t dark:bg-[#162544]" />
          </div>
        </Card>

        {/* Patients by Condition Donut Chart (5 cols) */}
        <Card className="lg:col-span-5 border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded dark:bg-[#162544]" />
              <Skeleton className="h-4 w-36 dark:bg-[#162544]" />
            </div>
            <Skeleton className="h-6 w-20 rounded-lg dark:bg-[#162544]" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-[220px] px-2">
            <Skeleton className="h-[175px] w-[175px] rounded-full shrink-0 border-[16px] border-slate-100 dark:border-[#162544] bg-transparent" />
            <div className="flex-1 w-full space-y-3 pl-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2.5 w-2.5 rounded-full dark:bg-[#162544]" />
                    <Skeleton className="h-3 w-20 dark:bg-[#162544]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-8 dark:bg-[#162544]" />
                    <Skeleton className="h-3 w-6 dark:bg-[#162544]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions (2 cols) */}
        <Card className="lg:col-span-2 border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-3">
            <Skeleton className="w-4 h-4 rounded dark:bg-[#162544]" />
            <Skeleton className="h-4 w-24 dark:bg-[#162544]" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-[#f8fafc] dark:bg-[#10192e] border border-slate-100/90 dark:border-[#18284c] py-3.5 px-2 flex flex-col items-center justify-center text-center h-[105px] space-y-2"
              >
                <Skeleton className="w-10 h-10 rounded-full dark:bg-[#162544]" />
                <Skeleton className="h-3 w-14 dark:bg-[#162544]" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3. BOTTOM ROW: RECENT PATIENTS & DOCTOR DIRECTORY TABLES SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Patients Table (7 cols) */}
        <Card className="lg:col-span-7 border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded dark:bg-[#162544]" />
              <Skeleton className="h-4 w-28 dark:bg-[#162544]" />
            </div>
            <Skeleton className="h-7 w-16 rounded-lg dark:bg-[#162544]" />
          </div>

          <div className="space-y-3 pt-1">
            {/* Table header */}
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-[#162444]">
              <Skeleton className="h-3 w-6 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-24 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-20 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-10 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-20 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-20 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-14 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-8 ml-auto dark:bg-[#162544]" />
            </div>
            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, r) => (
              <div
                key={r}
                className="flex items-center gap-3 py-2 border-b border-slate-100/60 dark:border-[#14203a]"
              >
                <Skeleton className="h-3 w-6 dark:bg-[#142038]" />
                <Skeleton className="h-3.5 w-24 dark:bg-[#142038]" />
                <Skeleton className="h-3 w-20 dark:bg-[#142038]" />
                <Skeleton className="h-3 w-10 dark:bg-[#142038]" />
                <Skeleton className="h-3 w-20 dark:bg-[#142038]" />
                <Skeleton className="h-3 w-20 dark:bg-[#142038]" />
                <Skeleton className="h-4 w-14 rounded dark:bg-[#142038]" />
                <Skeleton className="h-4 w-4 ml-auto rounded dark:bg-[#142038]" />
              </div>
            ))}
          </div>
        </Card>

        {/* Doctor Directory Table (5 cols) */}
        <Card className="lg:col-span-5 border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded dark:bg-[#162544]" />
              <Skeleton className="h-4 w-28 dark:bg-[#162544]" />
            </div>
            <Skeleton className="h-7 w-16 rounded-lg dark:bg-[#162544]" />
          </div>

          <div className="space-y-3 pt-1">
            {/* Table header */}
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-[#162444]">
              <Skeleton className="h-3 w-6 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-24 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-24 dark:bg-[#162544]" />
              <Skeleton className="h-3 w-12 text-center dark:bg-[#162544]" />
              <Skeleton className="h-3 w-14 ml-auto dark:bg-[#162544]" />
            </div>
            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, r) => (
              <div
                key={r}
                className="flex items-center gap-3 py-2 border-b border-slate-100/60 dark:border-[#14203a]"
              >
                <Skeleton className="h-3 w-6 dark:bg-[#142038]" />
                <Skeleton className="h-3.5 w-24 dark:bg-[#142038]" />
                <Skeleton className="h-3 w-24 dark:bg-[#142038]" />
                <Skeleton className="h-3 w-12 dark:bg-[#142038]" />
                <Skeleton className="h-4 w-14 ml-auto rounded dark:bg-[#142038]" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function DoctorDetailSkeleton() {
  return (
    <div className="space-y-4">
      {/* Back link */}
      <div>
        <Skeleton className="h-4 w-28 dark:bg-[#162544]" />
      </div>

      {/* 1. Top Doctor Profile Banner Card Skeleton */}
      <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-5 sm:p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Avatar + Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Skeleton className="h-16 w-16 sm:h-18 sm:w-18 rounded-full dark:bg-[#16294a] shrink-0" />
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Skeleton className="h-6 sm:h-7 w-44 dark:bg-[#162544]" />
                <Skeleton className="h-5 w-24 rounded-full dark:bg-[#162544]" />
                <Skeleton className="h-5 w-16 rounded-full dark:bg-[#162544]" />
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-0.5">
                <Skeleton className="h-3.5 w-28 dark:bg-[#142038]" />
                <Skeleton className="h-3.5 w-24 dark:bg-[#142038]" />
                <Skeleton className="h-3.5 w-36 dark:bg-[#142038]" />
              </div>
            </div>
          </div>

          {/* Right: Add Patient + Edit Profile buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <Skeleton className="h-9 w-28 rounded-md dark:bg-[#162544]" />
            <Skeleton className="h-9 w-28 rounded-md dark:bg-[#162544]" />
          </div>
        </div>
      </Card>

      {/* 2. Middle Row: Doctor Information (left) and Patients Summary (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Doctor Information Card */}
        <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-5 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-[#172545]">
              <Skeleton className="h-4 w-4 rounded dark:bg-[#162544]" />
              <Skeleton className="h-4 w-36 dark:bg-[#162544]" />
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <Skeleton className="h-3 w-16 dark:bg-[#142038]" />
                <Skeleton className="h-3.5 w-32 dark:bg-[#142038]" />
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <Skeleton className="h-3 w-14 dark:bg-[#142038]" />
                <Skeleton className="h-5 w-24 rounded-md dark:bg-[#142038]" />
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <Skeleton className="h-3 w-12 dark:bg-[#142038]" />
                <Skeleton className="h-3.5 w-36 dark:bg-[#142038]" />
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <Skeleton className="h-3 w-12 dark:bg-[#142038]" />
                <Skeleton className="h-3.5 w-28 dark:bg-[#142038]" />
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <Skeleton className="h-3 w-16 dark:bg-[#142038]" />
                <Skeleton className="h-3.5 w-32 dark:bg-[#142038]" />
              </div>
              <div className="flex items-center justify-between py-1">
                <Skeleton className="h-3 w-20 dark:bg-[#142038]" />
                <Skeleton className="h-3.5 w-20 dark:bg-[#142038]" />
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Patients Summary Card */}
        <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-5 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-[#172545]">
              <Skeleton className="h-4 w-4 rounded dark:bg-[#162544]" />
              <Skeleton className="h-4 w-32 dark:bg-[#162544]" />
            </div>

            <div className="space-y-3 pt-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 sm:p-3">
                  <div className="flex items-center gap-3.5">
                    <Skeleton className="w-10 h-10 rounded-md dark:bg-[#162544] shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-2.5 w-24 dark:bg-[#142038]" />
                      <Skeleton className="h-5 w-12 dark:bg-[#162544]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Patients Table Skeleton */}
      <PatientsTableSkeleton rows={8} showDoctorColumn={false} />
    </div>
  );
}
