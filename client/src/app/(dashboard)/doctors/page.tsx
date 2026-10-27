'use client';

import React, { useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDoctors, useDoctorFilters } from '@/hooks/useDoctors';
import { DoctorsTable } from '@/components/doctors/DoctorsTable';
import { DoctorFilters } from '@/components/doctors/DoctorFilters';
import { AddDoctorModal } from '@/components/doctors/AddDoctorModal';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/app-skeletons';

export default function DoctorsPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);

  // URL State management via nuqs
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  const [specialization, setSpecialization] = useQueryState(
    'specialization',
    parseAsString.withDefault('')
  );
  const [hospital, setHospital] = useQueryState('hospital', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const limit = 10;

  // Server state via TanStack Query
  const { data: doctorsData, isLoading } = useDoctors({
    page,
    limit,
    q: q || undefined,
    specialization: specialization || undefined,
    hospital: hospital || undefined,
  });

  const { data: filtersData } = useDoctorFilters();

  const doctors = doctorsData?.data || [];
  const pagination = doctorsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

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

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Doctors</h1>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-sm gap-1.5 shadow-none"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Doctor
        </Button>
      </div>

      {/* Filter Bar */}
      <DoctorFilters
        search={q}
        onSearchChange={handleSearchChange}
        specialization={specialization}
        onSpecializationChange={handleSpecChange}
        hospital={hospital}
        onHospitalChange={handleHospChange}
        specializations={filtersData?.specializations || []}
        hospitals={filtersData?.hospitals || []}
      />

      {/* Table */}
      {isLoading ? (
        <TableSkeleton columns={7} rows={7} />
      ) : (
        <DoctorsTable
          doctors={doctors}
          startIndex={(pagination.page - 1) * pagination.limit}
        />
      )}

      {/* Pagination Footer matching screenshot 3 */}
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
          of <span className="font-medium text-slate-700">{pagination.total}</span> doctors
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

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
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
            ))}

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

      {/* Add Doctor Modal */}
      <AddDoctorModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        specializations={filtersData?.specializations}
      />
    </div>
  );
}
