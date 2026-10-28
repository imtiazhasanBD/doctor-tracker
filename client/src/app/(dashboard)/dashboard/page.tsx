'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Users,
  UserPlus,
  Activity,
  Zap,
  ChevronRight,
  Eye,
  Stethoscope,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { PatientsPerDoctorChart } from '@/components/dashboard/PatientsPerDoctorChart';
import { PatientsByConditionChart } from '@/components/dashboard/PatientsByConditionChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardSkeleton } from '@/components/ui/app-skeletons';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// HOSPITAL BANNER ILLUSTRATION
const HospitalBannerIllustration = () => (
  <>
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
  </>
);

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totals = data?.totals || {
    doctors: 0,
    patients: 0,
    thisMonthPatients: 0,
    todayPatients: 0,
  };
  const conditionsCount = data?.conditions?.length || 0;

  const recentPatients = data?.recentPatients || [];
  const doctorDirectory = data?.doctorDirectory || [];

  return (
    <div className="space-y-5 pb-6">
      {/* 1. HERO WELCOME BANNER + 4 METRIC CARDS CONTAINER                  */}
      <div className="relative rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary/10 via-accent to-secondary pb-4 border border-border shadow-xs dark:shadow-none overflow-hidden transition-colors">

        {/* Top Right Hospital Illustration from public/ folder */}
        <div className="hidden md:flex absolute top-0 right-0 h-[160px] items-end justify-end pointer-events-none z-0 opacity-95 dark:opacity-95">
          <HospitalBannerIllustration />
        </div>

        {/* Top Banner Text */}
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

        {/* 4 Metric Cards Row (2x2 on mobile matching Doctors/Patients) */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-3 sm:px-4">
          <StatCard
            title="Total Doctors"
            value={(totals.doctors ?? 0).toLocaleString()}
            icon={User}
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <StatCard
            title="Total Patients"
            value={(totals.patients ?? 0).toLocaleString()}
            icon={Users}
            iconBg="bg-chart-5/10"
            iconColor="text-chart-5"
          />
          <StatCard
            title="Patients Added This Month"
            value={(totals.thisMonthPatients ?? 0).toLocaleString()}
            icon={UserPlus}
            iconBg="bg-success/10"
            iconColor="text-success"
          />
          <StatCard
            title="Patient Conditions"
            value={conditionsCount.toString()}
            icon={Activity}
            iconBg="bg-warning/10"
            iconColor="text-warning"
          />
        </div>
      </div>

      {/* 2. MIDDLE ROW: 2 CHARTS                          */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <PatientsPerDoctorChart data={data?.patientsPerDoctor} />
        </div>

        {/* Donut Chart (5 cols) */}
        <div className="lg:col-span-5">
          <PatientsByConditionChart
            data={data?.conditions}
            totalPatients={totals.patients}
          />
        </div>
      </div>

      {/* 3. BOTTOM ROW: RECENT PATIENTS & DOCTOR DIRECTORY TABLES           */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Patients Table (7 cols) */}
        <Card className="lg:col-span-7 border-border bg-card rounded-xl p-4 sm:p-6 shadow-xs transition-colors">
          <CardHeader className="p-0 pb-3 sm:pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm sm:text-[14.5px] font-bold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Recent Patients
            </CardTitle>
            <Link
              href="/patients"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className:
                  'text-[11.5px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 h-7 rounded-lg',
              })}
            >
              View All
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            {/* Mobile Cards List (md:hidden) */}
            <div className="space-y-2.5 md:hidden">
              {recentPatients.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                  No recent patients recorded yet.
                </div>
              ) : (
                recentPatients.map((p: any, idx: number) => {
                  const doctorName =
                    typeof p.doctor === 'object' && p.doctor !== null
                      ? p.doctor.name || 'Unassigned'
                      : typeof p.doctor === 'string'
                        ? p.doctor
                        : 'Unassigned';

                  const addedDate =
                    p.addedDate ||
                    (p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '-');
                  const rawStatus = (p.status || 'Active').toString();
                  const statusLabel =
                    rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
                  const isActive = statusLabel.toLowerCase() === 'active';
                  const initials = (p.name || 'P')
                    .split(' ')
                    .filter(Boolean)
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <div
                      key={p._id || p.id || idx}
                      className="p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-foreground truncate">
                              {p.name}
                            </p>
                            {p.age && (
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                • {p.age}y
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                            <span className="text-primary font-medium">{doctorName}</span>
                            <span>•</span>
                            <span className="truncate">{p.condition}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                            isActive
                              ? 'bg-success/10 text-success border border-success/20'
                              : 'bg-muted text-muted-foreground border border-border'
                          )}
                        >
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              isActive ? 'bg-success' : 'bg-muted-foreground'
                            )}
                          />
                          {statusLabel}
                        </span>

                        <Link
                          href="/patients"
                          className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          aria-label="View patient in patients page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-muted-foreground h-auto w-8 text-center">
                      #
                    </TableHead>
                    <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-muted-foreground h-auto">
                      Name
                    </TableHead>
                    <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-muted-foreground h-auto">
                      Doctor
                    </TableHead>
                    <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-muted-foreground h-auto text-center">
                      Age
                    </TableHead>
                    <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-muted-foreground h-auto">
                      Condition
                    </TableHead>
                    <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-muted-foreground h-auto">
                      Added Date
                    </TableHead>
                    <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-muted-foreground h-auto text-center">
                      Status
                    </TableHead>
                    <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-muted-foreground h-auto text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border text-[12px]">
                  {recentPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                        No recent patients recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentPatients.map((p: any, idx: number) => {
                      const doctorName =
                        typeof p.doctor === 'object' && p.doctor !== null
                          ? p.doctor.name || 'Unassigned'
                          : typeof p.doctor === 'string'
                            ? p.doctor
                            : 'Unassigned';

                      const addedDate =
                        p.addedDate ||
                        (p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '-');
                      const rawStatus = (p.status || 'Active').toString();
                      const statusLabel =
                        rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
                      const isActive = statusLabel.toLowerCase() === 'active';

                      return (
                        <TableRow
                          key={p._id || p.id || idx}
                          className="hover:bg-muted/50 border-b border-border transition-colors"
                        >
                          <TableCell className="py-2.5 px-2 text-muted-foreground font-normal text-center">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="py-2.5 px-2.5 font-bold text-foreground whitespace-nowrap">
                            {p.name}
                          </TableCell>
                          <TableCell className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">
                            {doctorName}
                          </TableCell>
                          <TableCell className="py-2.5 px-2 text-muted-foreground text-center">
                            {p.age ?? '-'}
                          </TableCell>
                          <TableCell className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">
                            {p.condition}
                          </TableCell>
                          <TableCell className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">
                            {addedDate}
                          </TableCell>
                          <TableCell className="py-2.5 px-2 text-center">
                            <Badge
                              variant={isActive ? 'success' : 'destructive'}
                              className="rounded-md text-[11px] font-semibold py-0.5 px-2"
                            >
                              {statusLabel}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2.5 px-2 text-center">
                            <Link
                              href="/patients"
                              className={buttonVariants({
                                variant: 'ghost',
                                size: 'icon-xs',
                                className:
                                  'text-muted-foreground hover:text-primary hover:bg-muted inline-flex',
                              })}
                              aria-label="View patient"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Directory Table (5 cols) */}
        <Card className="lg:col-span-5 border-border bg-card rounded-xl p-4 sm:p-6 shadow-xs transition-colors">
          <CardHeader className="p-0 pb-3 sm:pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm sm:text-[14.5px] font-bold text-foreground flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              Doctor Directory
            </CardTitle>
            <Link
              href="/doctors"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className:
                  'text-[11.5px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 h-7 rounded-lg',
              })}
            >
              View All
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            {/* Mobile Cards List (md:hidden) */}
            <div className="space-y-2.5 md:hidden">
              {doctorDirectory.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                  No doctors available yet.
                </div>
              ) : (
                doctorDirectory.map((doc: any, idx: number) => {
                  const docName =
                    typeof doc.name === 'string'
                      ? doc.name
                      : doc.name?.name || 'Dr. Doctor';
                  const initials = docName
                    .replace('Dr. ', '')
                    .split(' ')
                    .filter(Boolean)
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <div
                      key={doc.id || doc._id || idx}
                      className="p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate">
                            {docName}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {doc.specialization || 'General Medicine'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-semibold text-foreground px-2 py-0.5 rounded-md bg-secondary border border-border">
                          {doc.patients ?? doc.count ?? 0} pts
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success border border-success/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          {doc.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-muted-foreground h-auto w-8 text-center">
                      #
                    </TableHead>
                    <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-muted-foreground h-auto">
                      Name
                    </TableHead>
                    <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-muted-foreground h-auto">
                      Specialization
                    </TableHead>
                    <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-muted-foreground h-auto text-center">
                      Patients
                    </TableHead>
                    <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-muted-foreground h-auto text-center">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border text-[12px]">
                  {doctorDirectory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No doctors available yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    doctorDirectory.map((doc: any, idx: number) => {
                      const docName =
                        typeof doc.name === 'string'
                          ? doc.name
                          : doc.name?.name || 'Dr. Doctor';

                      return (
                        <TableRow
                          key={doc.id || doc._id || idx}
                          className="hover:bg-muted/50 border-b border-border transition-colors"
                        >
                          <TableCell className="py-2.5 px-2.5 text-muted-foreground font-normal text-center">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="py-2.5 px-2.5 font-bold text-foreground whitespace-nowrap">
                            {docName}
                          </TableCell>
                          <TableCell className="py-2.5 px-2.5 text-muted-foreground whitespace-nowrap">
                            {doc.specialization || '-'}
                          </TableCell>
                          <TableCell className="py-2.5 px-2.5 font-bold text-foreground text-center">
                            {doc.patients ?? doc.count ?? 0}
                          </TableCell>
                          <TableCell className="py-2.5 px-2.5 text-center">
                            <Badge
                              variant="success"
                              className="rounded-md text-[11px] font-semibold py-0.5 px-2.5"
                            >
                              {doc.status || 'Active'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}