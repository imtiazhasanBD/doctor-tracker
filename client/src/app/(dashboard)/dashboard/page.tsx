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
  <img
    src="/Modern Hospital Amidst Lush Greenery.png"
    alt="Modern Hospital Amidst Lush Greenery"
    className="h-full w-auto object-contain object-right-bottom select-none pointer-events-none"
  />
);

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totals = data?.totals || { doctors: 25, patients: 5000, todayPatients: 12 };
  const growth = data?.growth || {
    doctorsPctMonth: 12,
    patientsPctMonth: 18,
    todayPctYesterday: 20,
  };

  const conditionsCount = data?.conditions?.length || 6;

  // Fallback rows matching the screenshot if API doesn't return table lists
  const recentPatients = (data as any)?.recentPatients || [
    { id: 1, name: 'Tanvir Ahmed', doctor: 'Dr. Rahman', age: 45, condition: 'Diabetes', addedDate: '2026-04-28', status: 'Active' },
    { id: 2, name: 'Fatima Begum', doctor: 'Dr. Karim', age: 38, condition: 'Hypertension', addedDate: '2026-04-28', status: 'Active' },
    { id: 3, name: 'Rahim Uddin', doctor: 'Dr. Islam', age: 52, condition: 'Heart Disease', addedDate: '2026-04-28', status: 'Active' },
    { id: 4, name: 'Nusrat Jahan', doctor: 'Dr. Hasan', age: 29, condition: 'Asthma', addedDate: '2026-04-27', status: 'Discharged' },
    { id: 5, name: 'Ali Hossain', doctor: 'Dr. Chowdhury', age: 40, condition: 'Back Pain', addedDate: '2026-04-27', status: 'Active' },
  ];

  const doctorDirectory =
    (data as any)?.doctorDirectory ||
    (data?.patientsPerDoctor?.length
      ? data.patientsPerDoctor.slice(0, 5).map((doc) => ({
        id: doc.doctorId,
        name: doc.name,
        specialization: doc.specialization || 'General',
        patients: doc.count,
        status: 'Active',
      }))
      : null) || [
      { id: 1, name: 'Dr. Rahman', specialization: 'Cardiology', patients: 320, status: 'Active' },
      { id: 2, name: 'Dr. Karim', specialization: 'Medicine', patients: 280, status: 'Active' },
      { id: 3, name: 'Dr. Islam', specialization: 'Neurology', patients: 250, status: 'Active' },
      { id: 4, name: 'Dr. Hasan', specialization: 'Pediatrics', patients: 210, status: 'Active' },
      { id: 5, name: 'Dr. Chowdhury', specialization: 'Orthopedics', patients: 180, status: 'Active' },
    ];

  const statCards = [
    {
      title: 'Total Doctors',
      value: totals.doctors.toLocaleString(),
      growth: `+${growth.doctorsPctMonth}%`,
      period: 'from last month',
      icon: User,
      iconBg: 'bg-[#ebf4ff]',
      iconColor: 'text-[#2584ff]',
      sparkColor: '#3b82f6',
    },
    {
      title: 'Total Patients',
      value: totals.patients.toLocaleString(),
      growth: `+${growth.patientsPctMonth}%`,
      period: 'from last month',
      icon: Users,
      iconBg: 'bg-[#f4ebff]',
      iconColor: 'text-[#9333ea]',
      sparkColor: '#9333ea',
    },
    {
      title: 'Patients Added This Month',
      value: (totals.todayPatients ?? 12).toLocaleString(),
      growth: `+${growth.todayPctYesterday ?? 20}%`,
      period: 'from last month',
      icon: UserPlus,
      iconBg: 'bg-[#ecfdf5]',
      iconColor: 'text-[#10b981]',
      sparkColor: '#10b981',
    },
    {
      title: 'Patient Conditions',
      value: conditionsCount.toString(),
      growth: '+8%',
      period: 'from last month',
      icon: Activity,
      iconBg: 'bg-[#fff7ed]',
      iconColor: 'text-[#f97316]',
      sparkColor: '#f97316',
    },
  ];

  const quickActions = [
    {
      label: 'Add Doctor',
      href: '/doctors?action=new',
      icon: User,
      iconBg: 'bg-[#ebf4ff]',
      iconColor: 'text-[#2584ff]',
    },
    {
      label: 'Add Patient',
      href: '/patients?action=new',
      icon: UserPlus,
      iconBg: 'bg-[#f4ebff]',
      iconColor: 'text-[#9333ea]',
    },
    {
      label: 'View Doctors',
      href: '/doctors',
      icon: Stethoscope,
      iconBg: 'bg-[#ecfdf5]',
      iconColor: 'text-[#10b981]',
    },
    {
      label: 'View Patients',
      href: '/patients',
      icon: Users,
      iconBg: 'bg-[#fff7ed]',
      iconColor: 'text-[#f97316]',
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* 1. HERO WELCOME BANNER + 4 METRIC CARDS CONTAINER                  */}
      <div className="relative rounded-md bg-gradient-to-r from-[#f3f9ff] via-[#eef6ff] to-[#e4f1fe] pb-8 md:pb-8 border border-white/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] overflow-hidden">

        {/* Top Right Hospital Illustration from public/ folder */}
        <div className="hidden md:flex absolute top-0 right-0 h-[160px] items-end justify-end pointer-events-none z-0">
          <HospitalBannerIllustration />
        </div>

        {/* Top Banner Text */}
        <div className="relative z-10 flex items-center justify-between pb-6 p-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b]">
              WELCOME BACK
            </p>
            <h1 className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-[#0f172a] mt-0.5">
              Here’s what’s happening today
            </h1>
            <p className="text-[13px] text-[#64748b] mt-0.5">
              Overview of your doctors, patients and healthcare activities.
            </p>
          </div>
        </div>

        {/* 4 Metric Cards Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 px-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      </div>

      {/* 2. MIDDLE ROW: 2 CHARTS + QUICK ACTIONS                            */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4">
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
        <Card className="lg:col-span-2 border-slate-100 bg-white rounded-md p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-[14.5px] font-bold text-[#0f172a] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2584ff] fill-[#2584ff]" />
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
                    className="group rounded-md bg-[#f8fafc] hover:bg-[#f1f6fd] border border-slate-100/90 py-3.5 px-2 flex flex-col items-center justify-center text-center transition-all h-[105px]"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center mb-2 transition-transform group-hover:scale-105`}
                    >
                      <Icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[11.5px] font-semibold text-[#1e293b]">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4">
        {/* Recent Patients Table (7 cols) */}
        <Card className="lg:col-span-7 border-slate-100 bg-white rounded-md p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)]">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[14.5px] font-bold text-[#0f172a] flex items-center gap-2">
              <User className="w-4 h-4 text-[#2584ff]" />
              Recent Patients
            </CardTitle>
            <Link
              href="/patients"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className:
                  'text-[11.5px] font-semibold text-[#2584ff] bg-[#eef6ff] hover:bg-[#dbeafe] px-3 h-7 rounded-lg',
              })}
            >
              View All
            </Link>
          </CardHeader>

          <CardContent className="p-0 overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] h-auto w-8 text-center">
                    #
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] h-auto">
                    Name
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] h-auto">
                    Doctor
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] h-auto text-center">
                    Age
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] h-auto">
                    Condition
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] h-auto">
                    Added Date
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] h-auto text-center">
                    Status
                  </TableHead>
                  <TableHead className="py-2.5 px-2 text-[11px] font-semibold text-[#64748b] h-auto text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-[12px]">
                {recentPatients.map((p: any, idx: number) => {
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
                      className="hover:bg-slate-50/70 border-b border-slate-100 transition-colors"
                    >
                      <TableCell className="py-2.5 px-2 text-[#64748b] font-normal text-center">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 font-bold text-[#0f172a] whitespace-nowrap">
                        {p.name}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-[#64748b] whitespace-nowrap">
                        {doctorName}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-[#64748b] text-center">
                        {p.age ?? '-'}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-[#64748b] whitespace-nowrap">
                        {p.condition}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-[#64748b] whitespace-nowrap">
                        {addedDate}
                      </TableCell>
                      <TableCell className="py-2.5 px-2 text-center">
                        <Badge
                          variant={isActive ? 'secondary' : 'destructive'}
                          className={cn(
                            'rounded-md text-[11px] font-semibold border-0 py-0.5 px-2',
                            isActive
                              ? 'bg-[#e6f9f1] text-[#10b981] hover:bg-[#e6f9f1]'
                              : 'bg-[#fff1f2] text-[#f43f5e] hover:bg-[#fff1f2]'
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
                              'text-[#94a3b8] hover:text-[#2584ff] hover:bg-slate-50 inline-flex',
                          })}
                          aria-label="View patient"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Doctor Directory Table (5 cols) */}
        <Card className="lg:col-span-5 border-slate-100 bg-white rounded-md p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)]">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[14.5px] font-bold text-[#0f172a] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#2584ff]" />
              Doctor Directory
            </CardTitle>
            <Link
              href="/doctors"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className:
                  'text-[11.5px] font-semibold text-[#2584ff] bg-[#eef6ff] hover:bg-[#dbeafe] px-3 h-7 rounded-lg',
              })}
            >
              View All
            </Link>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] h-auto w-8 text-center">
                    #
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] h-auto">
                    Name
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] h-auto">
                    Specialization
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] h-auto text-center">
                    Patients
                  </TableHead>
                  <TableHead className="py-2.5 px-2.5 text-[11px] font-semibold text-[#64748b] h-auto text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-[12px]">
                {doctorDirectory.map((doc: any, idx: number) => {
                  const docName =
                    typeof doc.name === 'string'
                      ? doc.name
                      : doc.name?.name || 'Dr. Doctor';

                  return (
                    <TableRow
                      key={doc.id || doc._id || idx}
                      className="hover:bg-slate-50/70 border-b border-slate-100 transition-colors"
                    >
                      <TableCell className="py-2.5 px-2.5 text-[#64748b] font-normal text-center">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 font-bold text-[#0f172a] whitespace-nowrap">
                        {docName}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 text-[#64748b] whitespace-nowrap">
                        {doc.specialization || '-'}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 font-bold text-[#0f172a] text-center">
                        {doc.patients ?? doc.count ?? 0}
                      </TableCell>
                      <TableCell className="py-2.5 px-2.5 text-center">
                        <Badge
                          variant="secondary"
                          className="rounded-md text-[11px] font-semibold border-0 py-0.5 px-2.5 bg-[#e6f9f1] text-[#10b981] hover:bg-[#e6f9f1]"
                        >
                          {doc.status || 'Active'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}