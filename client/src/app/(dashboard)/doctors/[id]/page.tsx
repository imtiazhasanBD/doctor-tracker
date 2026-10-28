'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useQueryState, parseAsInteger } from 'nuqs';
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Users,
  Plus,
  Edit2,
  Activity,
  UserCheck,
  User,
  BarChart3,
  Stethoscope,
} from 'lucide-react';
import { useDoctor } from '@/hooks/useDoctors';
import { useDoctorPatients } from '@/hooks/usePatients';
import { PatientsTable } from '@/components/patients/PatientsTable';
import { AddPatientModal } from '@/components/patients/AddPatientModal';
import { AddDoctorModal } from '@/components/doctors/AddDoctorModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DoctorDetailSkeleton, PatientsTableSkeleton } from '@/components/ui/app-skeletons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Patient } from '@/types/api';

export default function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [editDoctorOpen, setEditDoctorOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const limit = 10;

  // TanStack Query for doctor details and doctor's patients
  const { data: doctor, isLoading: docLoading } = useDoctor(id);
  const { data: patientsData, isLoading: patientsLoading } = useDoctorPatients(
    id,
    page,
    limit
  );

  const patients = patientsData?.data || [];
  const total =
    (patientsData as any)?.total ??
    patientsData?.pagination?.total ??
    (doctor?.patientCount || patients.length);
  const totalPages =
    (patientsData as any)?.totalPages ??
    patientsData?.pagination?.totalPages ??
    Math.max(1, Math.ceil(total / limit));
  const currentPage = (patientsData as any)?.page ?? patientsData?.pagination?.page ?? page;

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setPatientModalOpen(true);
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setPatientModalOpen(true);
  };

  if (docLoading) {
    return <DoctorDetailSkeleton />;
  }

  if (!doctor) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-12 h-12 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
          <Stethoscope className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Doctor Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested doctor profile could not be found or has been removed.
        </p>
        <Link
          href="/doctors"
          className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Doctors
        </Link>
      </div>
    );
  }

  const initials = doctor.name
    .replace(/^Dr\.\s*/i, '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Metrics calculation from real database data
  const totalPatients = doctor.patientCount ?? total ?? 0;
  const activePatientsCount =
    doctor.activePatients ??
    patients.filter((p) => p.status === 'active').length;
  const dischargedPatientsCount =
    doctor.dischargedPatients ??
    patients.filter((p) => p.status === 'discharged').length;

  return (
    <div className="space-y-4">
      {/* Back link */}
      <div>
        <Link
          href="/doctors"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Doctors
        </Link>
      </div>

      {/* 1. Top Doctor Profile Banner Card */}
      <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-5 sm:p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Avatar + Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Avatar className="h-16 w-16 sm:h-18 sm:w-18 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
              <AvatarFallback className="bg-[#2563eb] text-white font-bold text-xl">
                {initials || 'DR'}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {doctor.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/50">
                  {doctor.specialization}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 border border-emerald-200/80 dark:border-emerald-900/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {doctor.hospital}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {doctor.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {doctor.email}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Add Patient + Edit Profile buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <Button
              onClick={handleAddPatient}
              className="h-9 px-4 text-xs font-semibold rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white gap-1.5 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Patient
            </Button>

            <Button
              variant="outline"
              onClick={() => setEditDoctorOpen(true)}
              className="h-9 px-3.5 text-xs font-semibold rounded-md border-slate-200/80 dark:border-[#1c2a47] bg-white dark:bg-[#10192e] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#152342] shadow-sm gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Middle Row: Doctor Information (left) and Patients Summary (right) with real data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Doctor Information Card */}
        <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-5 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-[#172545]">
              <User className="h-4 w-4 text-[#2563eb] dark:text-[#3b82f6]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Doctor Information</h3>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <span className="text-slate-400 dark:text-slate-400 font-medium">Full Name</span>
                <span className="font-semibold text-slate-800 dark:text-white">{doctor.name}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <span className="text-slate-400 dark:text-slate-400 font-medium">Specialty</span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] dark:text-[#60a5fa] border border-blue-100/80 dark:border-blue-900/40">
                  {doctor.specialization}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <span className="text-slate-400 dark:text-slate-400 font-medium">Email</span>
                <span className="font-medium text-slate-800 dark:text-white">{doctor.email}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <span className="text-slate-400 dark:text-slate-400 font-medium">Phone</span>
                <span className="font-medium text-slate-800 dark:text-white">{doctor.phone}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#142038]">
                <span className="text-slate-400 dark:text-slate-400 font-medium">Hospital</span>
                <span className="font-medium text-slate-800 dark:text-white">{doctor.hospital}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 dark:text-slate-400 font-medium">Joined Date</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {new Date(doctor.createdAt).toLocaleDateString('en-CA')}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Patients Summary Card */}
        <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-5 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-[#172545]">
              <BarChart3 className="h-4 w-4 text-[#2563eb] dark:text-[#3b82f6]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Patients Summary</h3>
            </div>

            <div className="space-y-3 pt-3">
              {/* Row 1: Total Patients */}
              <div className="flex items-center justify-between p-2.5 sm:p-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-md bg-[#eff6ff] dark:bg-[#122347] text-[#2563eb] dark:text-[#3b82f6] flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">Total Patients</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{totalPatients}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Active Patients */}
              <div className="flex items-center justify-between p-2.5 sm:p-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-md bg-[#ecfdf5] dark:bg-[#0c2a23] text-[#10b981] dark:text-[#34d399] flex items-center justify-center shrink-0">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">Active Patients</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{activePatientsCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Discharged Patients */}
              <div className="flex items-center justify-between p-2.5 sm:p-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-md bg-[#fef2f2] dark:bg-[#381317] text-[#ef4444] dark:text-[#f87171] flex items-center justify-center shrink-0">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">Discharged Patients</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{dischargedPatientsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Bottom Section: Recent Patients Table */}
      <div className="space-y-3">
        {patientsLoading ? (
          <PatientsTableSkeleton rows={limit} showDoctorColumn={false} />
        ) : (
          <PatientsTable
            patients={patients}
            startIndex={(currentPage - 1) * limit}
            total={total}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            showDoctorColumn={false}
            onEditPatient={handleEditPatient}
            doctorIdContext={id}
            title="Recent Patients"
            actionButton={
              <Button
                onClick={handleAddPatient}
                className="h-8 px-3.5 text-xs font-semibold rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white gap-1.5 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Patient
              </Button>
            }
          />
        )}
      </div>

      {/* Add/Edit Patient modal pre-scoped to this doctor */}
      <AddPatientModal
        open={patientModalOpen}
        onOpenChange={setPatientModalOpen}
        preselectedDoctorId={id}
        patientToEdit={editingPatient}
      />

      {/* Edit Doctor modal */}
      <AddDoctorModal
        open={editDoctorOpen}
        onOpenChange={setEditDoctorOpen}
        doctorToEdit={doctor}
      />
    </div>
  );
}
