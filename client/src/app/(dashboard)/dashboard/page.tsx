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

  const quickActions = [
    {
      label: 'Add Doctor',
      href: '/doctors?action=new',
      icon: User,
      iconBg: 'bg-[#ebf4ff] dark:bg-[#132c54]',
      iconColor: 'text-[#2584ff] dark:text-[#38bdf8]',
    },
    {
      label: 'Add Patient',
      href: '/patients?action=new',
      icon: UserPlus,
      iconBg: 'bg-[#f4ebff] dark:bg-[#261c4a]',
      iconColor: 'text-[#9333ea] dark:text-[#c084fc]',
    },
    {
      label: 'View Doctors',
      href: '/doctors',
      icon: Stethoscope,
      iconBg: 'bg-[#ecfdf5] dark:bg-[#12332e]',
      iconColor: 'text-[#10b981] dark:text-[#34d399]',
    },
    {
      label: 'View Patients',
      href: '/patients',
      icon: Users,
      iconBg: 'bg-[#fff7ed] dark:bg-[#3a2518]',
      iconColor: 'text-[#f97316] dark:text-[#fb923c]',
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* 1. HERO WELCOME BANNER + 4 METRIC CARDS CONTAINER                  */}
      <div className="relative rounded-md bg-gradient-to-r from-[#f3f9ff] via-[#eef6ff] to-[#e4f1fe] dark:from-[#0b1428] dark:via-[#0d172e] dark:to-[#101b36] pb-4 border border-white/80 dark:border-[#19284a] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] dark:shadow-none overflow-hidden transition-colors">

        {/* Top Right Hospital Illustration from public/ folder */}
        <div className="hidden md:flex absolute top-0 right-0 h-[160px] items-end justify-end pointer-events-none z-0 opacity-95 dark:opacity-95">
          <HospitalBannerIllustration />
        </div>

        {/* Top Banner Text */}
        <div className="relative z-10 flex items-center justify-between pb-6 p-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b] dark:text-[#5e7191]">
              WELCOME BACK
            </p>
            <h1 className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-[#0f172a] dark:text-white mt-0.5">
              Here’s what’s happening today
            </h1>
            <p className="text-[13px] text-[#64748b] dark:text-[#7e91b0] mt-0.5">
              Overview of your doctors and patients data.
            </p>
          </div>
        </div>

        {/* 4 Metric Cards Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4">
          <StatCard
            title="Total Doctors"
            value={(totals.doctors ?? 0).toLocaleString()}
            icon={User}
            iconBg="bg-[#ebf4ff] dark:bg-[#132c54]"
            iconColor="text-[#2584ff] dark:text-[#38bdf8]"
          />
          <StatCard
            title="Total Patients"
            value={(totals.patients ?? 0).toLocaleString()}
            icon={Users}
            iconBg="bg-[#f4ebff] dark:bg-[#261c4a]"
            iconColor="text-[#9333ea] dark:text-[#c084fc]"
          />
          <StatCard
            title="Patients Added This Month"
            value={(totals.thisMonthPatients ?? 0).toLocaleString()}
            icon={UserPlus}
            iconBg="bg-[#ecfdf5] dark:bg-[#12332e]"
            iconColor="text-[#10b981] dark:text-[#34d399]"
          />
          <StatCard
            title="Patient Conditions"
            value={conditionsCount.toString()}
            icon={Activity}
            iconBg="bg-[#fff7ed] dark:bg-[#3a2518]"
            iconColor="text-[#f97316] dark:text-[#fb923c]"
          />
        </div>
      </div>

      {/* 2. MIDDLE ROW: 2 CHARTS + QUICK ACTIONS                            */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bar Chart (5 cols) */}
        <div className="lg:col-span-5">
          <PatientsPerDoctorChart data={data?.patientsPerDoctor} />
        </div>

        {/* Donut Chart (5 cols) */}
        <div className="lg:col-span-5">
          <PatientsByConditionChart
            data={data?.conditions}
            totalPatients={totals.patients}
          />
        </div>

        {/* Quick Actions Card (2 cols) */}
        <Card className="lg:col-span-2 border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] flex flex-col justify-between transition-colors ">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-[14.5px] font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2584ff] dark:text-[#38bdf8] fill-[#2584ff] dark:fill-[#38bdf8]" />
              Quick Actions
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group rounded-xl bg-[#f8fafc] dark:bg-[#10192e] hover:bg-[#f1f6fd] dark:hover:bg-[#152342] border border-slate-100/90 dark:border-[#18284c] py-3.5 px-2 flex flex-col items-center justify-center text-center transition-all h-[105px]"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center mb-2 transition-transform group-hover:scale-105`}
                    >
                      <Icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[11.5px] font-semibold text-[#1e293b] dark:text-[#cbd5e1]">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-[#5a6d8c] group-hover:translate-x-0.5 transition-transform">
                        &gt;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. BOTTOM ROW: RECENT PATIENTS & DOCTOR DIRECTORY TABLES           */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Patients Table (7 cols) */}
        <Card className="lg:col-span-7 border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] transition-colors">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[14.5px] font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#2584ff] dark:text-[#38bdf8]" />
              Recent Patients
            </CardTitle>
            <Link
              href="/patients"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className:
                  'text-[11.5px] font-semibold text-[#2584ff] dark:text-[#38bdf8] bg-[#eef6ff] dark:bg-[#13254c] hover:bg-[#dbeafe] dark:hover:bg-[#1a3266] px-3 h-7 rounded-lg',
              })}
            >
              View All
            </Link>
          </CardHeader>

          <CardContent className="p-0 overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 dark:border-[#162444] hover:bg-transparent">
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto w-8 text-center">
                    #
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto">
                    Name
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto">
                    Doctor
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto text-center">
                    Age
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto">
                    Condition
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto">
                    Added Date
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto text-center">
                    Status
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-[#14203a] text-[12px]">
                {recentPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-slate-500 dark:text-[#7e91b0]">
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
                      className="hover:bg-slate-50/70 dark:hover:bg-[#10192e] border-b border-slate-100 dark:border-[#14203a] transition-colors"
                    >
                      <TableCell className="py-2.5 px-2 text-[#64748b] dark:text-[#5e7191] font-normal text-center">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 font-bold text-[#0f172a] dark:text-white whitespace-nowrap">
                        {p.name}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-[#64748b] dark:text-[#8fa1be] whitespace-nowrap">
                        {doctorName}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-[#64748b] dark:text-[#8fa1be] text-center">
                        {p.age ?? '-'}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-[#64748b] dark:text-[#8fa1be] whitespace-nowrap">
                        {p.condition}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-[#64748b] dark:text-[#8fa1be] whitespace-nowrap">
                        {addedDate}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-center">
                        <Badge
                          variant={isActive ? 'secondary' : 'destructive'}
                          className={cn(
                            'rounded-md text-[11px] font-semibold border-0 py-0.5 px-2',
                            isActive
                              ? 'bg-[#e6f9f1] dark:bg-[#0e352b] text-[#10b981] dark:text-[#34d399] hover:bg-[#e6f9f1] dark:hover:bg-[#0e352b]'
                              : 'bg-[#fff1f2] dark:bg-[#3d1a1c] text-[#f43f5e] dark:text-[#f87171] hover:bg-[#fff1f2] dark:hover:bg-[#3d1a1c]'
                          )}
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
                              'text-[#94a3b8] dark:text-[#5e7191] hover:text-[#2584ff] dark:hover:text-[#38bdf8] hover:bg-slate-50 dark:hover:bg-[#121e38] inline-flex',
                          })}
                          aria-label="View patient"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                }))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Doctor Directory Table (5 cols) */}
        <Card className="lg:col-span-5 border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] transition-colors">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[14.5px] font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#2584ff] dark:text-[#38bdf8]" />
              Doctor Directory
            </CardTitle>
            <Link
              href="/doctors"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className:
                  'text-[11.5px] font-semibold text-[#2584ff] dark:text-[#38bdf8] bg-[#eef6ff] dark:bg-[#13254c] hover:bg-[#dbeafe] dark:hover:bg-[#1a3266] px-3 h-7 rounded-lg',
              })}
            >
              View All
            </Link>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 dark:border-[#162444] hover:bg-transparent">
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto w-8 text-center">
                    #
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto">
                    Name
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto">
                    Specialization
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto text-center">
                    Patients
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] dark:text-[#5e7191] h-auto text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-[#14203a] text-[12px]">
                {doctorDirectory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-slate-500 dark:text-[#7e91b0]">
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
                      className="hover:bg-slate-50/70 dark:hover:bg-[#10192e] border-b border-slate-100 dark:border-[#14203a] transition-colors"
                    >
                      <TableCell className="py-2.5 px-2.5 text-[#64748b] dark:text-[#5e7191] font-normal text-center">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 font-bold text-[#0f172a] dark:text-white whitespace-nowrap">
                        {docName}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 text-[#64748b] dark:text-[#8fa1be] whitespace-nowrap">
                        {doc.specialization || '-'}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 font-bold text-[#0f172a] dark:text-white text-center">
                        {doc.patients ?? doc.count ?? 0}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 text-center">
                        <Badge
                          variant="secondary"
                          className="rounded-md text-[11px] font-semibold border-0 py-0.5 px-2.5 bg-[#e6f9f1] dark:bg-[#0e352b] text-[#10b981] dark:text-[#34d399] hover:bg-[#e6f9f1] dark:hover:bg-[#0e352b]"
                        >
                          {doc.status || 'Active'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                }))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}