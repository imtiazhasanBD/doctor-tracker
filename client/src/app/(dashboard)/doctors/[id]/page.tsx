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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDoctor } from '@/hooks/useDoctors';
import { useDoctorPatients } from '@/hooks/usePatients';
import { PatientsTable } from '@/components/patients/PatientsTable';
import { AddPatientModal } from '@/components/patients/AddPatientModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DoctorDetailSkeleton, TableSkeleton } from '@/components/ui/app-skeletons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Patient } from '@/types/api';

export default function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [modalOpen, setModalOpen] = useState(false);
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
  const pagination = patientsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setModalOpen(true);
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };

  if (docLoading) {
    return <DoctorDetailSkeleton />;
  }

  if (!doctor) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-slate-500">Doctor not found</p>
        <Link
          href="/doctors"
          className="mt-2 inline-flex items-center text-xs text-blue-600 hover:underline"
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Back to Doctors
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

  return (
    <div className="space-y-5">
      {/* Back link */}
      <div>
        <Link
          href="/doctors"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Doctors
        </Link>
      </div>

      {/* Doctor Profile Banner Card matching screenshot 5 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200 rounded-sm gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-base">
            <AvatarFallback className="bg-blue-500 text-white font-semibold">
              {initials || 'DR'}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-800">{doctor.name}</h2>
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-sm bg-emerald-50 text-emerald-600">
                {doctor.specialization}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {doctor.hospital}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {doctor.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {doctor.email}
              </span>
            </div>
          </div>
        </div>

        {/* Total Patients Badge on right */}
        <div className="flex items-center gap-3 pl-4 md:border-l md:border-slate-200 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-blue-50 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 leading-none">
              Total Patients
            </p>
            <p className="text-xl font-bold text-slate-800 mt-1 leading-none">
              {doctor.patientCount || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="bg-transparent border-b border-slate-200 rounded-none w-full justify-start p-0 h-auto gap-6">
          <TabsTrigger
            value="patients"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 text-xs font-semibold px-1 py-2.5 text-slate-500 shadow-none"
          >
            Patients
          </TabsTrigger>
          <TabsTrigger
            value="info"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 text-xs font-semibold px-1 py-2.5 text-slate-500 shadow-none"
          >
            Doctor Information
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Patients */}
        <TabsContent value="patients" className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Patients ({pagination.total})
            </h3>
            <Button
              onClick={handleAddPatient}
              className="h-8 px-3.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-sm gap-1.5 shadow-none"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Patient
            </Button>
          </div>

          {patientsLoading ? (
            <TableSkeleton columns={8} rows={5} />
          ) : (
            <PatientsTable
              patients={patients}
              startIndex={(pagination.page - 1) * pagination.limit}
              showDoctorColumn={false}
              onEditPatient={handleEditPatient}
              doctorIdContext={id}
            />
          )}

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 gap-3">
            <p>
              Showing{' '}
              <span className="font-medium text-slate-700">
                {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-slate-700">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-medium text-slate-700">{pagination.total}</span> patients
            </p>

            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="p-1 border border-slate-200 bg-white rounded-sm text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-7 w-7 text-xs font-medium rounded-sm border ${
                        pageNum === pagination.page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-1 border border-slate-200 bg-white rounded-sm text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Doctor Information */}
        <TabsContent value="info" className="pt-4">
          <div className="p-6 bg-white border border-slate-200 rounded-sm max-w-xl space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Doctor Name</p>
                <p className="font-semibold text-slate-800 mt-0.5">{doctor.name}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Specialization</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {doctor.specialization}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Hospital</p>
                <p className="font-semibold text-slate-800 mt-0.5">{doctor.hospital}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Phone</p>
                <p className="font-semibold text-slate-800 mt-0.5">{doctor.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Email</p>
                <p className="font-semibold text-slate-800 mt-0.5">{doctor.email}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Joined Date</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {new Date(doctor.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Patient modal pre-scoped to this doctor */}
      <AddPatientModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        preselectedDoctorId={id}
        patientToEdit={editingPatient}
      />
    </div>
  );
}
