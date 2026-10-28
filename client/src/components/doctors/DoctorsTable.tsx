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
      color: 'text-destructive',
      bg: 'bg-destructive/15 text-destructive',
    };
  }
  if (s.includes('cardio')) {
    return {
      Icon: Heart,
      color: 'text-destructive',
      bg: 'bg-destructive/15 text-destructive',
    };
  }
  if (s.includes('ortho')) {
    return {
      Icon: Bone,
      color: 'text-success',
      bg: 'bg-success/15 text-success',
    };
  }
  if (s.includes('neuro')) {
    return {
      Icon: Brain,
      color: 'text-chart-5',
      bg: 'bg-chart-5/15 text-chart-5',
    };
  }
  if (s.includes('ophthal') || s.includes('eye')) {
    return {
      Icon: Eye,
      color: 'text-info',
      bg: 'bg-info/15 text-info',
    };
  }
  if (s.includes('general') || s.includes('medicine')) {
    return {
      Icon: Pill,
      color: 'text-warning',
      bg: 'bg-warning/15 text-warning',
    };
  }
  return {
    Icon: Stethoscope,
    color: 'text-primary',
    bg: 'bg-primary/15 text-primary',
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
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Doctors list
          </h2>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="h-8 px-3 text-xs font-semibold rounded-md gap-1.5 border border-border bg-card text-foreground hover:bg-muted cursor-pointer"
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
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-muted-foreground py-3">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3">Specialization</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3">Hospital</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3">Phone</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-center">Patients</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3">Status</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-xs text-muted-foreground">
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
                    className="hover:bg-muted/50 border-b border-border transition-colors group"
                  >
                    {/* Name + Avatar + Doc ID */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-full border border-border">
                          <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">
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
                            className="text-xs font-bold text-foreground hover:text-primary transition-colors block leading-tight"
                          >
                            {doctor.name}
                          </Link>
                          <span className="text-[11px] text-muted-foreground leading-tight">
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
                        <span className="text-xs font-medium text-foreground">
                          {doctor.specialization}
                        </span>
                      </div>
                    </TableCell>

                    {/* Hospital with Icon */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[160px] text-foreground">{doctor.hospital}</span>
                      </div>
                    </TableCell>

                    {/* Phone with Icon */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-foreground">{doctor.phone}</span>
                      </div>
                    </TableCell>

                    {/* Patients Count */}
                    <TableCell className="text-xs font-semibold text-foreground text-center py-3.5">
                      {doctor.patientCount || 0}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-success/15 text-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
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
                          className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-primary/10 transition-colors cursor-pointer"
                          title="Edit Doctor"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, doctor._id, doctor.name)}
                          className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors cursor-pointer"
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
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground pt-4 mt-2 border-t border-border gap-3">
        <p>
          Showing{' '}
          <span className="font-semibold text-foreground">
            {totalCount === 0 ? 0 : startIndex + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-foreground">
            {Math.min(startIndex + doctors.length, totalCount)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-foreground">
            {totalCount}
          </span>{' '}
          doctors
        </p>

        {totalPages > 1 && onPageChange && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1.5 border border-border bg-card rounded-md text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`h-7 w-7 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  pageNum === page
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1.5 border border-border bg-card rounded-md text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
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
              <div className="w-10 h-10 rounded-full bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-foreground">
                Delete Doctor
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to delete the doctor &quot;{doctorToDelete?.name}&quot;? This action cannot be undone and will permanently remove all records associated with this doctor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-2.5 mt-4">
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-9 px-4 text-xs font-semibold rounded-md border border-border bg-card text-foreground hover:bg-muted cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="h-9 px-4 text-xs font-semibold rounded-md bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-none cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
