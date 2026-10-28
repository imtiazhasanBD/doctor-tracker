import React from 'react';
import { BarChart3, PieChart, User, Stethoscope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 7, rows = 6 }: TableSkeletonProps) {
  return (
    <div className="border border-border bg-card rounded-md overflow-hidden">
      {/* Table Header skeleton */}
      <div className="h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-3 ${i === 0 ? 'w-24' : i === 1 ? 'w-32' : 'flex-1'}`}
          />
        ))}
      </div>

      {/* Table Rows skeleton */}
      <div className="divide-y divide-border">
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="border-border bg-card rounded-xl shadow-xs p-3.5 sm:p-5 transition-colors"
        >
          <div className="flex items-start gap-2.5 sm:gap-3.5">
            <Skeleton className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-20 sm:w-24" />
              <Skeleton className="h-6 sm:h-7 w-12 sm:w-16" />
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
  filters,
}: {
  rows?: number;
  showDoctorColumn?: boolean;
  filters?: React.ReactNode;
}) {
  return (
    <Card className="border-border bg-card rounded-md p-5 shadow-sm transition-colors space-y-4">
      {/* Table Header: Patients Count & Action / Export buttons */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          {!showDoctorColumn && (
            <Skeleton className="h-8 w-24 rounded-md" />
          )}
        </div>
      </div>

      {/* Filters (Search & Dropdowns) */}
      {filters && <div className="pt-0.5">{filters}</div>}

      {/* Mobile Card Skeletons (lg:hidden) */}
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: Math.min(rows, 4) }).map((_, r) => (
          <div
            key={r}
            className="p-3.5 rounded-xl border border-border bg-card shadow-xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <Skeleton className="h-10 w-10 rounded-full shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2.5 w-24" />
                  <Skeleton className="h-3 w-36 mt-2" />
                  <Skeleton className="h-3 w-28 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Headers (lg:block) */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="flex items-center gap-4 py-3.5 border-b border-border">
          <Skeleton className="w-36 h-3.5" />
          {showDoctorColumn && <Skeleton className="w-28 h-3.5" />}
          <Skeleton className="w-12 h-3.5" />
          <Skeleton className="w-16 h-3.5" />
          <Skeleton className="w-24 h-3.5" />
          <Skeleton className="w-24 h-3.5" />
          <Skeleton className="w-20 h-3.5" />
          <Skeleton className="w-16 h-3.5 ml-auto" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex items-center gap-4 py-3.5">
              <div className="flex items-center gap-3 w-36">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
              {showDoctorColumn && <Skeleton className="w-28 h-3.5" />}
              <Skeleton className="w-12 h-3.5" />
              <Skeleton className="w-16 h-3.5" />
              <Skeleton className="w-24 h-3.5" />
              <Skeleton className="w-24 h-3.5" />
              <Skeleton className="w-16 h-5 rounded-md" />
              <div className="flex items-center gap-1.5 ml-auto">
                <Skeleton className="w-6 h-6 rounded-md" />
                <Skeleton className="w-6 h-6 rounded-md" />
                <Skeleton className="w-6 h-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer skeleton */}
      <div className="flex items-center justify-between pt-3 px-1 border-t border-border gap-3 text-xs">
        <Skeleton className="h-4 w-36" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-7 h-7 rounded-md" />
          <Skeleton className="w-7 h-7 rounded-md" />
          <Skeleton className="w-7 h-7 rounded-md" />
          <Skeleton className="w-7 h-7 rounded-md" />
          <Skeleton className="w-7 h-7 rounded-md" />
        </div>
      </div>
    </Card>
  );
}

export function DoctorsTableSkeleton({
  rows = 8,
  filters,
}: {
  rows?: number;
  filters?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {/* Card Header: Doctors list & Export CSV button */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      {/* Filters (Search & Dropdowns) */}
      {filters && <div className="pt-0.5">{filters}</div>}

      {/* Mobile Card Skeletons (lg:hidden) */}
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: Math.min(rows, 4) }).map((_, r) => (
          <div
            key={r}
            className="p-3.5 rounded-xl border border-border bg-card shadow-xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <Skeleton className="h-10 w-10 rounded-full shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-3 w-36 mt-2" />
                  <Skeleton className="h-3 w-28 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Headers (lg:block) */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="flex items-center gap-4 py-3.5 border-b border-border">
          <Skeleton className="w-40 h-3.5" />
          <Skeleton className="w-28 h-3.5" />
          <Skeleton className="w-32 h-3.5" />
          <Skeleton className="w-28 h-3.5" />
          <Skeleton className="w-16 h-3.5" />
          <Skeleton className="w-16 h-3.5" />
          <Skeleton className="w-16 h-3.5 ml-auto" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex items-center gap-4 py-3.5">
              <div className="flex items-center gap-3 w-40">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
              <Skeleton className="w-28 h-5 rounded-md" />
              <Skeleton className="w-32 h-3.5" />
              <Skeleton className="w-28 h-3.5" />
              <Skeleton className="w-16 h-3.5" />
              <Skeleton className="w-16 h-5 rounded-md" />
              <div className="flex items-center gap-1.5 ml-auto">
                <Skeleton className="w-6 h-6 rounded-md" />
                <Skeleton className="w-6 h-6 rounded-md" />
                <Skeleton className="w-6 h-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer skeleton */}
      <div className="flex flex-row items-center justify-between pt-4 mt-2 border-t border-border gap-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-7 h-7 rounded-md" />
          <Skeleton className="w-7 h-7 rounded-md" />
          <Skeleton className="w-7 h-7 rounded-md" />
          <Skeleton className="w-7 h-7 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5 pb-6">
      {/* 1. HERO WELCOME BANNER + 4 METRIC CARDS SKELETON */}
      <div className="relative rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary/10 via-accent to-secondary pb-4 border border-border shadow-xs dark:shadow-none overflow-hidden transition-colors">
        {/* Top Right Hospital Illustration from public/ folder */}
        <div className="hidden md:flex absolute top-0 right-0 h-[160px] items-end justify-end pointer-events-none z-0 opacity-95 dark:opacity-95">
          <img
            src="/Modern Hospital Amidst Lush Greenery-Photoroom.png"
            alt="Modern Hospital Amidst Lush Greenery"
            className="h-full w-auto object-contain object-right-bottom select-none pointer-events-none dark:hidden"
          />
          <img
            src="/Starlit Modern Hospital at Night-Photoroom.png"
            alt="Starlit Modern Hospital at Night"
            className="h-full w-auto object-contain object-right-bottom select-none pointer-events-none hidden dark:block"
          />
        </div>

        {/* Top Banner Text - Always permanent, never skeleton */}
        <div className="relative z-10 flex items-center justify-between p-3.5 sm:p-5 pb-3 sm:pb-5">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              WELCOME BACK
            </p>
            <h1 className="text-[19px] sm:text-[24px] font-bold tracking-tight text-foreground mt-0.5">
              Here’s what’s happening today
            </h1>
            <p className="text-xs sm:text-[13px] text-muted-foreground mt-0.5">
              Overview of your doctors and patients data.
            </p>
          </div>
        </div>

        {/* 4 Metric Cards Row (2x2 on mobile) */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-3 sm:px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="border-border bg-card rounded-xl shadow-xs p-3.5 sm:p-5 transition-colors"
            >
              <div className="flex items-start gap-2.5 sm:gap-3.5">
                <Skeleton className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3 w-20 sm:w-24" />
                  <Skeleton className="h-6 sm:h-7 w-12 sm:w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE ROW: 2 CHARTS SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Patients Per Doctor Bar Chart (7 cols) */}
        <Card className="lg:col-span-7 border-border bg-card rounded-xl shadow-xs p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-chart-1" />
              <span className="text-[14.5px] font-bold text-foreground">Patients Per Doctor</span>
            </div>
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>

          <div className="h-[210px] sm:h-[225px] flex items-end justify-between gap-3 sm:gap-4 pt-6 px-2 sm:px-4">
            <Skeleton className="w-7 sm:w-8 h-[80%] rounded-t" />
            <Skeleton className="w-7 sm:w-8 h-[60%] rounded-t" />
            <Skeleton className="w-7 sm:w-8 h-[55%] rounded-t" />
            <Skeleton className="w-7 sm:w-8 h-[50%] rounded-t" />
            <Skeleton className="w-7 sm:w-8 h-[38%] rounded-t" />
            <Skeleton className="w-7 sm:w-8 h-[32%] rounded-t" />
            <Skeleton className="w-7 sm:w-8 h-[28%] rounded-t" />
          </div>
        </Card>

        {/* Patients by Condition Donut Chart (5 cols) */}
        <Card className="lg:col-span-5 border-border bg-card rounded-xl shadow-xs p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-chart-1" />
              <span className="text-[14.5px] font-bold text-foreground">Patients by Condition</span>
            </div>
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 px-2">
            <Skeleton className="h-[160px] w-[160px] sm:h-[175px] sm:w-[175px] rounded-full shrink-0 border-[16px] border-muted bg-transparent my-1 sm:my-0" />
            <div className="flex-1 w-full space-y-3 sm:pl-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2.5 w-2.5 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 3. BOTTOM ROW: RECENT PATIENTS & DOCTOR DIRECTORY TABLES SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Patients Table (7 cols) */}
        <Card className="lg:col-span-7 border-border bg-card rounded-xl p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm sm:text-[14.5px] font-bold text-foreground">Recent Patients</span>
            </div>
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>

          {/* Mobile list skeleton */}
          <div className="space-y-2.5 md:hidden pt-3">
            {Array.from({ length: 4 }).map((_, r) => (
              <div key={r} className="p-3 rounded-xl border border-border bg-card/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-2.5 w-36" />
                  </div>
                </div>
                <Skeleton className="h-5 w-14 rounded-full shrink-0" />
              </div>
            ))}
          </div>

          {/* Desktop table skeleton */}
          <div className="hidden md:block space-y-3 pt-3">
            <div className="flex items-center gap-3 pb-2 border-b border-border">
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-8 ml-auto" />
            </div>
            {Array.from({ length: 5 }).map((_, r) => (
              <div
                key={r}
                className="flex items-center gap-3 py-2 border-b border-border/60"
              >
                <Skeleton className="h-3 w-6" />
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-4 w-4 ml-auto rounded" />
              </div>
            ))}
          </div>
        </Card>

        {/* Doctor Directory Table (5 cols) */}
        <Card className="lg:col-span-5 border-border bg-card rounded-xl p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span className="text-sm sm:text-[14.5px] font-bold text-foreground">Doctor Directory</span>
            </div>
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>

          {/* Mobile list skeleton */}
          <div className="space-y-2.5 md:hidden pt-3">
            {Array.from({ length: 4 }).map((_, r) => (
              <div key={r} className="p-3 rounded-xl border border-border bg-card/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-2.5 w-28" />
                  </div>
                </div>
                <Skeleton className="h-5 w-14 rounded-full shrink-0" />
              </div>
            ))}
          </div>

          {/* Desktop table skeleton */}
          <div className="hidden md:block space-y-3 pt-3">
            <div className="flex items-center gap-3 pb-2 border-b border-border">
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12 text-center" />
              <Skeleton className="h-3 w-14 ml-auto" />
            </div>
            {Array.from({ length: 5 }).map((_, r) => (
              <div
                key={r}
                className="flex items-center gap-3 py-2 border-b border-border/60"
              >
                <Skeleton className="h-3 w-6" />
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-14 ml-auto rounded" />
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
        <Skeleton className="h-4 w-28" />
      </div>

      {/* 1. Top Doctor Profile Banner Card Skeleton */}
      <Card className="border-border bg-card rounded-md p-5 sm:p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Avatar + Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Skeleton className="h-16 w-16 sm:h-18 sm:w-18 rounded-full shrink-0" />
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Skeleton className="h-6 sm:h-7 w-44" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-0.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-36" />
              </div>
            </div>
          </div>

          {/* Right: Add Patient + Edit Profile buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      </Card>

      {/* 2. Middle Row: Doctor Information (left) and Patients Summary (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Doctor Information Card */}
        <Card className="border-border bg-card rounded-md p-5 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-border">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-36" />
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3.5 w-32" />
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-5 w-24 rounded-md" />
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3.5 w-36" />
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3.5 w-28" />
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3.5 w-32" />
              </div>
              <div className="flex items-center justify-between py-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Patients Summary Card */}
        <Card className="border-border bg-card rounded-md p-5 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-border">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="space-y-3 pt-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 sm:p-3">
                  <div className="flex items-center gap-3.5">
                    <Skeleton className="w-10 h-10 rounded-md shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-2.5 w-24" />
                      <Skeleton className="h-5 w-12" />
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
