'use client';

import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Eye,
  FileDown,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  User,
  Calendar,
  Phone,
  Mail,
  Stethoscope,
  Activity,
  FileText,
} from 'lucide-react';
import { Patient, Doctor } from '@/types/api';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePatientMutations } from '@/hooks/usePatients';
import { toast } from 'sonner';

interface Props {
  patients: Patient[];
  startIndex: number;
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showDoctorColumn?: boolean;
  onEditPatient?: (patient: Patient) => void;
  doctorIdContext?: string;
  doctors?: Doctor[];
  actionButton?: React.ReactNode;
  title?: string;
  filters?: React.ReactNode;
}

export function PatientsTable({
  patients,
  startIndex,
  total,
  page = 1,
  totalPages = 1,
  onPageChange,
  showDoctorColumn = true,
  onEditPatient,
  doctorIdContext,
  doctors = [],
  actionButton,
  title,
  filters,
}: Props) {
  const { deletePatient } = usePatientMutations();
  const [patientToDelete, setPatientToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  const totalCount = total ?? patients.length;

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    e.preventDefault();
    setPatientToDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);
    try {
      await deletePatient.mutateAsync({
        id: patientToDelete.id,
        doctorId: doctorIdContext,
      });
      toast.success(`Patient "${patientToDelete.name}" deleted successfully`);
      setPatientToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete patient');
    } finally {
      setIsDeleting(false);
    }
  };

  const getDoctorName = (patient: Patient) => {
    if ((patient as any)?.doctor?.name) return (patient as any).doctor.name;
    const doc = patient?.doctorId;
    if (doc && typeof doc === 'object' && doc.name) return doc.name;
    if (typeof doc === 'string') {
      const found = doctors.find((d) => d._id === doc);
      if (found) return found.name;
      return doc;
    }
    return '-';
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleExportCSV = () => {
    if (!patients || patients.length === 0) {
      toast.error('No patient data to export');
      return;
    }
    const headers = ['#', 'Name', 'Doctor', 'Age', 'Gender', 'Condition', 'Visit Date', 'Status'];
    const rows = patients.map((p, idx) => [
      startIndex + idx + 1,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${getDoctorName(p).replace(/"/g, '""')}"`,
      p.age,
      p.gender,
      `"${p.condition.replace(/"/g, '""')}"`,
      formatDate(p.visitDate),
      p.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Patient list exported successfully');
  };

  return (
    <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-5 shadow-sm transition-colors space-y-4">
      {/* Table Header: Patients Count & Action / Export buttons */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#172545]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#eff6ff] dark:bg-[#122347] text-[#2563eb] dark:text-[#3b82f6] flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {title ? `${title}` : `Patients list`}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-semibold rounded-md border-slate-200 dark:border-[#1c2a47] bg-white dark:bg-[#10192e] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#152342] gap-1.5 shadow-none"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export
          </Button>
          {actionButton}
        </div>
      </div>

      {/* Filters (Search & Dropdowns) */}
      {filters && <div className="pt-0.5">{filters}</div>}

      {/* Main Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="border-b border-slate-100 dark:border-[#172545] hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3.5">
                Name
              </TableHead>
              {showDoctorColumn && (
                <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3.5">
                  Doctor
                </TableHead>
              )}
              <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3.5">
                Age
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3.5">
                Gender
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3.5">
                Condition
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3.5">
                Visit Date
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3.5">
                Status
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right pr-4 py-3.5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showDoctorColumn ? 9 : 8}
                  className="text-center py-12 text-xs text-slate-400 dark:text-slate-500"
                >
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient, index) => {
                const isActive = patient.status === 'active';

                return (
                  <TableRow
                    key={patient._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-[#111c38]/50 border-b border-slate-100/80 dark:border-[#172545]/60 transition-colors"
                  >

                    {/* Name with Avatar */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-full shrink-0">
                          <AvatarFallback className="rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] dark:text-[#3b82f6] text-xs font-semibold">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                            {patient.name}
                          </p>
                          {patient.phone && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                              {patient.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Doctor */}
                    {showDoctorColumn && (
                      <TableCell className="text-xs text-slate-600 dark:text-slate-300 py-3.5">
                        {getDoctorName(patient)}
                      </TableCell>
                    )}

                    {/* Age */}
                    <TableCell className="text-xs text-slate-600 dark:text-slate-300 py-3.5">
                      {patient.age}
                    </TableCell>

                    {/* Gender */}
                    <TableCell className="text-xs text-slate-600 dark:text-slate-300 capitalize py-3.5">
                      {patient.gender}
                    </TableCell>

                    {/* Condition */}
                    <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-200 py-3.5">
                      {patient.condition}
                    </TableCell>

                    {/* Visit Date */}
                    <TableCell className="text-xs text-slate-500 dark:text-slate-400 py-3.5 whitespace-nowrap">
                      {formatDate(patient.visitDate)}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40'
                        }`}
                      >
                        {isActive ? 'Active' : 'Discharged'}
                      </span>
                    </TableCell>

                    {/* Actions: View, Edit, Delete */}
                    <TableCell className="text-right pr-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingPatient(patient);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                          title="View Patient Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Button */}
                        {onEditPatient && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditPatient(patient);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                            title="Edit Patient"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteClick(e, patient._id, patient.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete Patient"
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
            {Math.min(startIndex + patients.length, totalCount)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {totalCount.toLocaleString()}
          </span>{' '}
          patients
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

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) => (
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

            {totalPages > 5 && (
              <>
                <span className="px-1 text-slate-400 select-none">...</span>
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={`h-7 px-2 text-xs font-semibold rounded-md border transition-colors ${
                    totalPages === page
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-[#10192e] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1c2a47] hover:bg-slate-50 dark:hover:bg-[#152342]'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

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

      {/* Shadcn UI Alert Dialog for Patient Delete */}
      <AlertDialog
        open={Boolean(patientToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPatientToDelete(null);
        }}
      >
        <AlertDialogContent className="rounded-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fde8e8] dark:bg-[#3d1419] text-[#e02424] dark:text-[#f87171] flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Patient
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Are you sure you want to delete the patient &quot;{patientToDelete?.name}&quot;? This
              action cannot be undone and will permanently remove all medical records for this patient.
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

      {/* Patient Details View Dialog */}
      <Dialog open={Boolean(viewingPatient)} onOpenChange={(open) => !open && setViewingPatient(null)}>
        <DialogContent className="sm:max-w-md w-full p-6 rounded-md bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545]">
          <DialogHeader className="pb-3 border-b border-slate-100 dark:border-[#172545]">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-md">
                <AvatarFallback className="rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] dark:text-[#3b82f6] text-sm font-bold">
                  {viewingPatient ? getInitials(viewingPatient.name) : ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                  {viewingPatient?.name}
                </DialogTitle>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold mt-0.5 ${
                    viewingPatient?.status === 'active'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {viewingPatient?.status === 'active' ? 'Active' : 'Discharged'}
                </span>
              </div>
            </div>
          </DialogHeader>

          {viewingPatient && (
            <div className="space-y-3 pt-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-md bg-[#f8fafc] dark:bg-[#10192e] border border-slate-100 dark:border-[#172545]">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Age / Gender</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mt-0.5 capitalize">
                    {viewingPatient.age} yrs • {viewingPatient.gender}
                  </p>
                </div>
                <div className="p-2.5 rounded-md bg-[#f8fafc] dark:bg-[#10192e] border border-slate-100 dark:border-[#172545]">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Condition</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                    {viewingPatient.condition}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-md bg-[#f8fafc] dark:bg-[#10192e] border border-slate-100 dark:border-[#172545] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                    Doctor
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {getDoctorName(viewingPatient)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    Visit Date
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {formatDate(viewingPatient.visitDate)}
                  </span>
                </div>
                {viewingPatient.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-blue-500" />
                      Phone
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {viewingPatient.phone}
                    </span>
                  </div>
                )}
                {viewingPatient.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-blue-500" />
                      Email
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                      {viewingPatient.email}
                    </span>
                  </div>
                )}
              </div>

              {viewingPatient.notes && (
                <div className="p-2.5 rounded-md bg-[#f8fafc] dark:bg-[#10192e] border border-slate-100 dark:border-[#172545]">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Notes</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {viewingPatient.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
