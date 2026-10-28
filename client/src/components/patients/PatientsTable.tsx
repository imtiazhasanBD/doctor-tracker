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
  MoreVertical,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { usePatientMutations } from '@/hooks/usePatients';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
    <Card className="border-border bg-card rounded-xl p-3.5 sm:p-5 shadow-sm transition-colors space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            {title ? `${title}` : `Patients list`}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-semibold rounded-lg border-border bg-card text-foreground hover:bg-muted gap-1.5 shadow-none cursor-pointer"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export
          </Button>
          {actionButton}
        </div>
      </div>

      {filters && <div className="pt-0.5">{filters}</div>}

      <div className="space-y-3 lg:hidden">
        {patients.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
            No patients found matching the criteria
          </div>
        ) : (
          patients.map((patient, index) => {
            const isActive = patient.status === 'active';
            const patCode = `PAT-2026-${String(startIndex + index + 1).padStart(3, '0')}`;
            const doctorName = getDoctorName(patient);

            return (
              <div
                key={patient._id}
                className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors shadow-xs"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <Avatar className="h-10 w-10 rounded-full shrink-0 border border-border">
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => setViewingPatient(patient)}
                        className="text-xs font-bold text-foreground hover:underline text-left block truncate cursor-pointer"
                      >
                        {patient.name}
                      </button>

                      <p className="text-[11px] text-muted-foreground">
                        {patCode} • {patient.age} yrs • <span className="capitalize">{patient.gender}</span>
                      </p>

                      {showDoctorColumn && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-0.5">
                          <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">{doctorName}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Activity className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="truncate font-medium text-foreground">{patient.condition}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>Visit: {formatDate(patient.visitDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold',
                        isActive
                          ? 'bg-success/10 text-success border border-success/20'
                          : 'bg-muted text-muted-foreground border border-border'
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          isActive ? 'bg-success' : 'bg-muted-foreground'
                        )}
                      />
                      {isActive ? 'Active' : 'Discharged'}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        id={`patient-actions-btn-${index}`}
                        aria-label="Open actions menu"
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 bg-popover border border-border rounded-xl shadow-lg p-1 z-50">
                        <DropdownMenuItem
                          onClick={() => setViewingPatient(patient)}
                          className="flex items-center gap-2.5 cursor-pointer text-xs px-2.5 py-2 rounded-lg"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        {onEditPatient && (
                          <DropdownMenuItem
                            onClick={() => onEditPatient(patient)}
                            className="flex items-center gap-2.5 cursor-pointer text-xs px-2.5 py-2 rounded-lg"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Edit Patient</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={(e) => handleDeleteClick(e, patient._id, patient.name)}
                          className="flex items-center gap-2.5 cursor-pointer text-xs px-2.5 py-2 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          <span>Delete Patient</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Name
              </TableHead>
              {showDoctorColumn && (
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                  Doctor
                </TableHead>
              )}
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Age
              </TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Gender
              </TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Condition
              </TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Visit Date
              </TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Status
              </TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right pr-4 py-3.5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showDoctorColumn ? 9 : 8}
                  className="text-center py-12 text-xs text-muted-foreground"
                >
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => {
                const isActive = patient.status === 'active';

                return (
                  <TableRow
                    key={patient._id}
                    className="hover:bg-muted/50 border-b border-border transition-colors"
                  >
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-full shrink-0">
                          <AvatarFallback className="rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-foreground leading-tight">
                            {patient.name}
                          </p>
                          {patient.phone && (
                            <p className="text-[11px] text-muted-foreground">
                              {patient.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {showDoctorColumn && (
                      <TableCell className="text-xs text-muted-foreground py-3.5">
                        {getDoctorName(patient)}
                      </TableCell>
                    )}

                    <TableCell className="text-xs text-muted-foreground py-3.5">
                      {patient.age}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground capitalize py-3.5">
                      {patient.gender}
                    </TableCell>

                    <TableCell className="text-xs font-medium text-foreground py-3.5">
                      {patient.condition}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground py-3.5 whitespace-nowrap">
                      {formatDate(patient.visitDate)}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                          isActive
                            ? 'bg-success/15 text-success border border-success/30'
                            : 'bg-destructive/15 text-destructive border border-destructive/30'
                        }`}
                      >
                        {isActive ? 'Active' : 'Discharged'}
                      </span>
                    </TableCell>

                    <TableCell className="text-right pr-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingPatient(patient);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-primary/10 transition-colors cursor-pointer"
                          title="View Patient Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {onEditPatient && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditPatient(patient);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-primary/10 transition-colors cursor-pointer"
                            title="Edit Patient"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleDeleteClick(e, patient._id, patient.name)}
                          className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors cursor-pointer"
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

      <div className="flex items-center justify-between gap-3 pt-3 px-1 border-t border-border text-xs">
        <p className="text-muted-foreground whitespace-nowrap text-xs">
          Showing{' '}
          <span className="font-semibold text-foreground">
            {totalCount === 0 ? 0 : `${startIndex + 1}-${Math.min(startIndex + patients.length, totalCount)}`}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-foreground">
            {totalCount.toLocaleString()}
          </span>
        </p>

        {totalPages > 1 && onPageChange && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="h-7 w-7 flex items-center justify-center border border-border bg-card rounded-md text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) => (
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

            {totalPages > 5 && (
              <>
                <span className="px-1 text-muted-foreground select-none">...</span>
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={`h-7 px-2 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                    totalPages === page
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="h-7 w-7 flex items-center justify-center border border-border bg-card rounded-md text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(patientToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPatientToDelete(null);
        }}
      >
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-foreground">
                Delete Patient
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to delete the patient &quot;{patientToDelete?.name}&quot;? This
              action cannot be undone and will permanently remove all medical records for this patient.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-2.5 mt-4">
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-9 px-4 text-xs font-semibold rounded-md border-border bg-card text-foreground hover:bg-muted cursor-pointer"
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

      <Dialog open={Boolean(viewingPatient)} onOpenChange={(open) => !open && setViewingPatient(null)}>
        <DialogContent className="sm:max-w-md w-full p-6 rounded-2xl bg-card border-border">
          <DialogHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarFallback className="rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {viewingPatient ? getInitials(viewingPatient.name) : ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {viewingPatient?.name}
                </DialogTitle>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold mt-0.5 ${
                    viewingPatient?.status === 'active'
                      ? 'bg-success/15 text-success'
                      : 'bg-destructive/15 text-destructive'
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
                <div className="p-2.5 rounded-xl bg-secondary border border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Age / Gender</p>
                  <p className="font-semibold text-foreground mt-0.5 capitalize">
                    {viewingPatient.age} yrs • {viewingPatient.gender}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary border border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Condition</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {viewingPatient.condition}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-secondary border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5 text-primary" />
                    Doctor
                  </span>
                  <span className="font-semibold text-foreground">
                    {getDoctorName(viewingPatient)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Visit Date
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatDate(viewingPatient.visitDate)}
                  </span>
                </div>
                {viewingPatient.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      Phone
                    </span>
                    <span className="font-semibold text-foreground">
                      {viewingPatient.phone}
                    </span>
                  </div>
                )}
                {viewingPatient.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      Email
                    </span>
                    <span className="font-semibold text-foreground truncate max-w-[180px]">
                      {viewingPatient.email}
                    </span>
                  </div>
                )}
              </div>

              {viewingPatient.notes && (
                <div className="p-2.5 rounded-xl bg-secondary border border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Notes</p>
                  <p className="text-muted-foreground leading-relaxed">
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
