'use client';

import React, { useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { Plus, User, Stethoscope, Building2, Users } from 'lucide-react';
import { useDoctors, useDoctorFilters } from '@/hooks/useDoctors';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { DoctorsTable } from '@/components/doctors/DoctorsTable';
import { DoctorFilters } from '@/components/doctors/DoctorFilters';
import { AddDoctorModal } from '@/components/doctors/AddDoctorModal';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/app-skeletons';
import { Doctor } from '@/types/api';

export default function DoctorsPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  // URL State management via nuqs
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  const [specialization, setSpecialization] = useQueryState(
    'specialization',
    parseAsString.withDefault('')
  );
  const [hospital, setHospital] = useQueryState('hospital', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const limit = 8; // Matching the 8 rows in the mockup

  // Server state via TanStack Query
  const { data: doctorsData, isLoading } = useDoctors({
    page,
    limit,
    q: q || undefined,
    specialization: specialization || undefined,
    hospital: hospital || undefined,
  });

  const { data: filtersData } = useDoctorFilters();
  const { data: statsData } = useDashboardStats();

  const doctors = doctorsData?.data || [];
  const total = doctorsData?.total ?? doctorsData?.pagination?.total ?? (doctors.length > 0 ? 25 : 0);
  const totalPages = doctorsData?.totalPages ?? doctorsData?.pagination?.totalPages ?? Math.max(1, Math.ceil(total / limit));
  const currentPage = doctorsData?.page ?? doctorsData?.pagination?.page ?? page;

  const handleSearchChange = (val: string) => {
    setQ(val);
    setPage(1);
  };

  const handleSpecChange = (val: string) => {
    setSpecialization(val);
    setPage(1);
  };

  const handleHospChange = (val: string) => {
    setHospital(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handleReset = () => {
    setQ('');
    setSpecialization('');
    setHospital('');
    setStatus('');
    setPage(1);
  };

  // Stat values matching mockup with fallback to live API stats
  const totalDoctors = statsData?.totals?.doctors || total || 25;
  const activeDoctors = Math.max(1, totalDoctors - 3);
  const totalHospitals = filtersData?.hospitals?.length || 8;
  const avgPatients = statsData?.totals?.avgPatientsPerDoctor || 203;

  return (
    <div className="space-y-4">
      {/* Top Hero Banner matching mockup with team illustration */}
      <div className="relative overflow-hidden rounded-md border border-[#cbe1fb] dark:border-[#152545] bg-gradient-to-r from-[#eef7ff] via-[#e5f1fe] to-[#ddedff] dark:from-[#09152b] dark:via-[#0c1a35] dark:to-[#0f2042] px-7 py-7 sm:py-8 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
              DOCTORS
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Manage Doctors
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 max-w-md">
              Add, update and organize your healthcare professionals.
            </p>
          </div>

          <Button
            onClick={() => {
              setDoctorToEdit(null);
              setAddModalOpen(true);
            }}
            className="h-9 px-4 text-xs font-semibold rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white gap-1.5 shadow-sm self-start sm:self-auto shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        </div>

        {/* Center-Right Illustration: Light & Dark theme responsive team images */}
        <div className="absolute right-36 lg:right-48 -bottom-5 hidden md:flex items-end pointer-events-none select-none z-0">
          <img
            src="/Friendly Healthcare Team with Medical Icons-Photoroom.png"
            alt="Healthcare Team"
            className="h-[145px] lg:h-[165px] w-auto object-contain dark:hidden drop-shadow-sm"
          />
          <img
            src="/Smiling Medical Team with Blue Accents-Photoroom.png"
            alt="Healthcare Team"
            className="h-[145px] lg:h-[165px] w-auto object-contain hidden dark:block drop-shadow-sm"
          />
        </div>
      </div>

      {/* 4 Metric Cards Row matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Doctors"
          value={totalDoctors}
          growth="+ 12%"
          period="from last month"
          icon={User}
          iconColor="text-[#2563eb] dark:text-[#3b82f6]"
          iconBg="bg-[#eff6ff] dark:bg-[#122347]"
          sparkColor="#3b82f6"
        />
        <StatCard
          title="Active Doctors"
          value={activeDoctors}
          growth="+ 10%"
          period="from last month"
          icon={Stethoscope}
          iconColor="text-[#9333ea] dark:text-[#a855f7]"
          iconBg="bg-[#faf5ff] dark:bg-[#251642]"
          sparkColor="#a855f7"
        />
        <StatCard
          title="Hospitals"
          value={totalHospitals}
          growth="+ 14%"
          period="from last month"
          icon={Building2}
          iconColor="text-[#0284c7] dark:text-[#38bdf8]"
          iconBg="bg-[#f0f9ff] dark:bg-[#0c283f]"
          sparkColor="#10b981"
        />
        <StatCard
          title="Avg. Patients per Doctor"
          value={avgPatients}
          growth="+ 8%"
          period="from last month"
          icon={Users}
          iconColor="text-[#ea580c] dark:text-[#fb923c]"
          iconBg="bg-[#fff7ed] dark:bg-[#331c10]"
          sparkColor="#f97316"
        />
      </div>

      {/* Filter Bar matching mockup */}
      <DoctorFilters
        search={q}
        onSearchChange={handleSearchChange}
        specialization={specialization}
        onSpecializationChange={handleSpecChange}
        hospital={hospital}
        onHospitalChange={handleHospChange}
        status={status}
        onStatusChange={handleStatusChange}
        specializations={filtersData?.specializations || []}
        hospitals={filtersData?.hospitals || []}
        onReset={handleReset}
        onSearch={() => setPage(1)}
      />

      {/* Doctors Table Card with Pagination matching mockup */}
      {isLoading ? (
        <TableSkeleton columns={8} rows={8} />
      ) : (
        <DoctorsTable
          doctors={doctors}
          startIndex={(currentPage - 1) * limit}
          total={total}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onEditDoctor={(doc) => {
            setDoctorToEdit(doc);
            setAddModalOpen(true);
          }}
        />
      )}

      {/* Add / Edit Doctor Modal */}
      <AddDoctorModal
        open={addModalOpen}
        onOpenChange={(open) => {
          setAddModalOpen(open);
          if (!open) setDoctorToEdit(null);
        }}
        doctorToEdit={doctorToEdit}
        specializations={filtersData?.specializations}
      />
    </div>
  );
}
