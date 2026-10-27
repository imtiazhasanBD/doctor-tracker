'use client';

import React from 'react';
import { Stethoscope, Users, CalendarDays } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { StatCard } from '@/components/dashboard/StatCard';
import { PatientsPerDoctorChart } from '@/components/dashboard/PatientsPerDoctorChart';
import { PatientsByConditionChart } from '@/components/dashboard/PatientsByConditionChart';
import { DashboardSkeleton } from '@/components/ui/app-skeletons';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totals = data?.totals || { doctors: 0, patients: 0, todayPatients: 0 };
  const growth = data?.growth || {
    doctorsPctMonth: 0,
    patientsPctMonth: 0,
    todayPctYesterday: 0,
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Doctors"
          value={totals.doctors}
          growth={growth.doctorsPctMonth}
          periodLabel="from last month"
          icon={Stethoscope}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Total Patients"
          value={totals.patients}
          growth={growth.patientsPctMonth}
          periodLabel="from last month"
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Today's Patients"
          value={totals.todayPatients ?? 0}
          growth={growth.todayPctYesterday ?? 0}
          periodLabel="from yesterday"
          icon={CalendarDays}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PatientsPerDoctorChart data={data?.patientsPerDoctor} />
        <PatientsByConditionChart
          data={data?.conditions}
          totalPatients={totals.patients}
        />
      </div>
    </div>
  );
}
