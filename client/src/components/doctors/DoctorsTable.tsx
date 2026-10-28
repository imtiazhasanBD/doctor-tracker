'use client';

import React from 'react';
import Link from 'next/link';
import {
  Edit2,
  Trash2,
  Users,
  Building2,
  Phone,
  FileDown,
  Baby,
  Heart,
  Bone,
  Brain,
  Eye,
  Pill,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { Doctor } from '@/types/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useDoctorMutations } from '@/hooks/useDoctors';
import { toast } from 'sonner';

interface Props {
  doctors: Doctor[];
  startIndex: number;
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onEditDoctor?: (doctor: Doctor) => void;
  filters?: React.ReactNode;
}

// Specialization icon & styling helper matching mockup
const getSpecializationMeta = (spec: string) => {
  const s = spec.toLowerCase();
  if (s.includes('pediatric')) {
    return {
      Icon: Baby,
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-500',
    };
  }
  if (s.includes('cardio')) {
    return {
      Icon: Heart,
      color: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/40 text-red-500',
    };
  }
  if (s.includes('ortho')) {
    return {
      Icon: Bone,
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500',
    };
  }
  if (s.includes('neuro')) {
    return {
      Icon: Brain,
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-500',
    };
  }
  if (s.includes('ophthal') || s.includes('eye')) {
    return {
      Icon: Eye,
      color: 'text-sky-500 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-500',
    };
  }
  if (s.includes('general') || s.includes('medicine')) {
    return {
      Icon: Pill,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-500',
    };
  }
  return {
    Icon: Stethoscope,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-500',
  };
};

export function DoctorsTable({
  doctors,
  startIndex,
  total,
  page = 1,
  totalPages = 1,
  onPageChange,
  onEditDoctor,
  filters,
}: Props) {
  const { deleteDoctor } = useDoctorMutations();
  const totalCount = total !== undefined ? total : doctors.length;

  const [doctorToDelete, setDoctorToDelete] = React.useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    e.preventDefault();
    setDoctorToDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;
    try {
      setIsDeleting(true);
      await deleteDoctor.mutateAsync(doctorToDelete.id);
      toast.success(`Dr. ${doctorToDelete.name} has been deleted`);
      setDoctorToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete doctor');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (doctors.length === 0) {
      toast.info('No doctor records to export');
      return;
    }

    const headers = ['#', 'Name', 'Doctor ID', 'Specialization', 'Hospital', 'Phone', 'Patients', 'Status'];
    const rows = doctors.map((doc, idx) => [
      startIndex + idx + 1,
      `"${doc.name.replace(/"/g, '""')}"`,
      `"DOC-2026-${String(startIndex + idx + 1).padStart(3, '0')}"`,
      `"${doc.specialization.replace(/"/g, '""')}"`,
      `"${doc.hospital.replace(/"/g, '""')}"`,
      `"${doc.phone}"`,
      doc.patientCount || 0,
      'Active',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `doctors-list-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Doctor list exported successfully');
  };

  return (
    <div className="space-y-4">
      {/* Card Header matching mockup */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#172545]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Doctors list
          </h2>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="h-8 px-3 text-xs font-semibold rounded-md gap-1.5 border-slate-200 dark:border-[#1c2a47] bg-white dark:bg-[#10192e] text-[#64748b] dark:text-[#8fa1be] hover:bg-slate-50 dark:hover:bg-[#152342]"
        >
          <FileDown className="h-3.5 w-3.5" />
          Export
        </Button>
      </div>

      {/* Filters (Search & Dropdowns) */}
      {filters && <div className="pt-0.5">{filters}</div>}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 dark:border-[#172545] hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-3">Name</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-3">Specialization</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-3">Hospital</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-3">Phone</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-3 text-center">Patients</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-3">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-3 text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-xs text-slate-400">
                  No doctors found matching the criteria
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor, index) => {
                const specMeta = getSpecializationMeta(doctor.specialization);
                const SpecIcon = specMeta.Icon;
                const docId = `DOC-2026-${String(startIndex + index + 1).padStart(3, '0')}`;

                return (
                  <TableRow
                    key={doctor._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-[#101b33] border-b border-slate-100/80 dark:border-[#14213d] transition-colors group"
                  >
                    {/* Name + Avatar + Doc ID */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-full border border-slate-100 dark:border-slate-800">
                          <AvatarFallback className="text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300">
                            {doctor.name
                              .replace('Dr. ', '')
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/doctors/${doctor._id}`}
                            className="text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block leading-tight"
                          >
                            {doctor.name}
                          </Link>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                            {docId}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Specialization with Icon */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${specMeta.bg}`}
                        >
                          <SpecIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                          {doctor.specialization}
                        </span>
                      </div>
                    </TableCell>

                    {/* Hospital with Icon */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate max-w-[160px]">{doctor.hospital}</span>
                      </div>
                    </TableCell>

                    {/* Phone with Icon */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{doctor.phone}</span>
                      </div>
                    </TableCell>

                    {/* Patients Count */}
                    <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-200 text-center py-3.5">
                      {doctor.patientCount || 0}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        Active
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onEditDoctor?.(doctor);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                          title="Edit Doctor"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, doctor._id, doctor.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete Doctor"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer matching mockup */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 mt-2 border-t border-slate-100 dark:border-[#172545] gap-3">
        <p>
          Showing{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {totalCount === 0 ? 0 : startIndex + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {Math.min(startIndex + doctors.length, totalCount)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {totalCount}
          </span>{' '}
          doctors
        </p>

        {totalPages > 1 && onPageChange && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1.5 border border-slate-200 dark:border-[#1c2a47] bg-white dark:bg-[#10192e] rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#152342] disabled:opacity-40 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`h-7 w-7 text-xs font-semibold rounded-md border transition-colors ${
                  pageNum === page
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-[#10192e] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1c2a47] hover:bg-slate-50 dark:hover:bg-[#152342]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1.5 border border-slate-200 dark:border-[#1c2a47] bg-white dark:bg-[#10192e] rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#152342] disabled:opacity-40 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Shadcn UI Alert Dialog for Doctor Delete */}
      <AlertDialog
        open={Boolean(doctorToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDoctorToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fde8e8] dark:bg-[#3d1419] text-[#e02424] dark:text-[#f87171] flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Doctor
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Are you sure you want to delete the doctor &quot;{doctorToDelete?.name}&quot;? This action cannot be undone and will permanently remove all records associated with this doctor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-2.5 mt-4">
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-9 px-4 text-xs font-semibold rounded-md border-slate-200 dark:border-[#1c2a47] bg-white dark:bg-[#10192e] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#152342]"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="h-9 px-4 text-xs font-semibold rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-none"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
