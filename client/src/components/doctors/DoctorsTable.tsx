'use client';

import React from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Users } from 'lucide-react';
import { Doctor } from '@/types/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useDoctorMutations } from '@/hooks/useDoctors';
import { toast } from 'sonner';

interface Props {
  doctors: Doctor[];
  startIndex: number;
}

export function DoctorsTable({ doctors, startIndex }: Props) {
  const { deleteDoctor } = useDoctorMutations();

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDoctor.mutateAsync(id);
        toast.success('Doctor deleted');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete doctor');
      }
    }
  };

  return (
    <div className="border border-slate-200 bg-white rounded-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/75">
          <TableRow className="border-b border-slate-200 hover:bg-transparent">
            <TableHead className="w-12 text-xs font-semibold text-slate-500">#</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Name</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Specialization</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Hospital</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Phone</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 text-center">Patients</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-400">
                No doctors found
              </TableCell>
            </TableRow>
          ) : (
            doctors.map((doctor, index) => (
              <TableRow
                key={doctor._id}
                className="hover:bg-slate-50/70 border-b border-slate-100 transition-colors cursor-pointer group"
              >
                <TableCell className="text-xs text-slate-400 font-medium">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-800">
                  <Link
                    href={`/doctors/${doctor._id}`}
                    className="hover:text-blue-600 hover:underline flex items-center gap-1.5"
                  >
                    {doctor.name}
                  </Link>
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {doctor.specialization}
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {doctor.hospital}
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {doctor.phone}
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-700 text-center">
                  {doctor.patientCount || 0}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded-sm hover:bg-blue-50 transition-colors"
                      title="View & Edit Patients"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, doctor._id, doctor.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-sm hover:bg-rose-50 transition-colors"
                      title="Delete Doctor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
