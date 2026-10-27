'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Patient, Doctor } from '@/types/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { usePatientMutations } from '@/hooks/usePatients';
import { toast } from 'sonner';

interface Props {
  patients: Patient[];
  startIndex: number;
  showDoctorColumn?: boolean;
  onEditPatient?: (patient: Patient) => void;
  doctorIdContext?: string;
}

export function PatientsTable({
  patients,
  startIndex,
  showDoctorColumn = true,
  onEditPatient,
  doctorIdContext,
}: Props) {
  const { deletePatient } = usePatientMutations();

  const handleDelete = async (patient: Patient) => {
    if (confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
      try {
        const docId =
          typeof patient.doctorId === 'string'
            ? patient.doctorId
            : (patient.doctorId as Doctor)?._id;

        await deletePatient.mutateAsync({
          id: patient._id,
          doctorId: doctorIdContext || docId,
        });
        toast.success('Patient deleted');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete patient');
      }
    }
  };

  const getDoctorName = (doc: string | Doctor) => {
    if (!doc) return '-';
    if (typeof doc === 'string') return doc;
    return doc.name || '-';
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="border border-slate-200 bg-white rounded-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/75">
          <TableRow className="border-b border-slate-200 hover:bg-transparent">
            <TableHead className="w-12 text-xs font-semibold text-slate-500">#</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Name</TableHead>
            {showDoctorColumn && (
              <TableHead className="text-xs font-semibold text-slate-500">Doctor</TableHead>
            )}
            <TableHead className="text-xs font-semibold text-slate-500">Age</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Gender</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Condition</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Visit Date</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 text-right pr-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showDoctorColumn ? 9 : 8}
                className="text-center py-8 text-xs text-slate-400"
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
                  className="hover:bg-slate-50/70 border-b border-slate-100 transition-colors"
                >
                  <TableCell className="text-xs text-slate-400 font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-800">
                    {patient.name}
                  </TableCell>
                  {showDoctorColumn && (
                    <TableCell className="text-xs text-slate-600">
                      {getDoctorName(patient.doctorId)}
                    </TableCell>
                  )}
                  <TableCell className="text-xs text-slate-600">{patient.age}</TableCell>
                  <TableCell className="text-xs text-slate-600 capitalize">
                    {patient.gender}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium">
                    {patient.condition}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDate(patient.visitDate)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-sm ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {isActive ? 'Active' : 'Discharged'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      {onEditPatient && (
                        <button
                          onClick={() => onEditPatient(patient)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded-sm hover:bg-blue-50 transition-colors"
                          title="Edit Patient"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(patient)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-sm hover:bg-rose-50 transition-colors"
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
  );
}
