'use client';

import React, { useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePatients, usePatientFilters } from '@/hooks/usePatients';
import { useDoctors } from '@/hooks/useDoctors';
import { PatientsTable } from '@/components/patients/PatientsTable';
import { PatientFilters } from '@/components/patients/PatientFilters';
import { AddPatientModal } from '@/components/patients/AddPatientModal';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/app-skeletons';
import { Patient } from '@/types/api';

export default function PatientsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // URL state via nuqs
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  const [doctorId, setDoctorId] = useQueryState('doctorId', parseAsString.withDefault(''));
  const [condition, setCondition] = useQueryState('condition', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [from, setFrom] = useQueryState('from', parseAsString.withDefault(''));
  const [to, setTo] = useQueryState('to', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const limit = 10;

  // Server state via TanStack Query
  const { data: patientsData, isLoading } = usePatients({
    page,
    limit,
    q: q || undefined,
    doctorId: doctorId || undefined,
    condition: condition || undefined,
    status: status || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  const { data: filtersData } = usePatientFilters();
  const { data: doctorsData } = useDoctors({ limit: 50 });

  const patients = patientsData?.data || [];
  const pagination = patientsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Patients</h1>
        </div>
        <Button
          onClick={handleAdd}
          className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-sm gap-1.5 shadow-none"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Patient
        </Button>
      </div>

      {/* Filter Bar */}
      <PatientFilters
        search={q}
        onSearchChange={(val) => {
          setQ(val);
          setPage(1);
        }}
        doctorId={doctorId}
        onDoctorIdChange={(val) => {
          setDoctorId(val);
          setPage(1);
        }}
        condition={condition}
        onConditionChange={(val) => {
          setCondition(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        fromDate={from}
        onFromDateChange={(val) => {
          setFrom(val);
          setPage(1);
        }}
        toDate={to}
        onToDateChange={(val) => {
          setTo(val);
          setPage(1);
        }}
        doctors={doctorsData?.data || []}
        conditions={filtersData?.conditions || []}
      />

      {/* Table */}
      {isLoading ? (
        <TableSkeleton columns={9} rows={8} />
      ) : (
        <PatientsTable
          patients={patients}
          startIndex={(pagination.page - 1) * pagination.limit}
          showDoctorColumn={true}
          onEditPatient={handleEdit}
        />
      )}

      {/* Pagination Footer matching screenshot 6 */}
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

            {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map(
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

      {/* Add / Edit Patient Modal */}
      <AddPatientModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        patientToEdit={editingPatient}
      />
    </div>
  );
}
