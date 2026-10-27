'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, PatientFormData, CONDITIONS, GENDERS, PATIENT_STATUSES } from '@/schemas';
import { usePatientMutations } from '@/hooks/usePatients';
import { useDoctors } from '@/hooks/useDoctors';
import { Patient, Doctor } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedDoctorId?: string;
  patientToEdit?: Patient | null;
}

export function AddPatientModal({
  open,
  onOpenChange,
  preselectedDoctorId,
  patientToEdit,
}: Props) {
  const { createPatient, updatePatient } = usePatientMutations();
  const { data: doctorsData } = useDoctors({ limit: 50 });
  const doctorsList: Doctor[] = doctorsData?.data || [];

  const isEdit = Boolean(patientToEdit);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      doctorId: preselectedDoctorId || '',
      age: 30,
      gender: 'male',
      phone: '',
      email: '',
      condition: 'Diabetes',
      status: 'active',
      visitDate: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const selectedDoctorId = watch('doctorId');
  const selectedGender = watch('gender');
  const selectedCondition = watch('condition');
  const selectedStatus = watch('status');

  const selectedDoctor =
    doctorsList.find((doc) => doc._id === selectedDoctorId) ||
    (patientToEdit &&
    typeof patientToEdit.doctorId === 'object' &&
    (patientToEdit.doctorId as any)?._id === selectedDoctorId
      ? (patientToEdit.doctorId as Doctor)
      : (patientToEdit as any)?.doctor && (patientToEdit as any)?.doctor?._id === selectedDoctorId
      ? ((patientToEdit as any).doctor as Doctor)
      : null);

  useEffect(() => {
    if (patientToEdit) {
      const docId =
        typeof patientToEdit.doctorId === 'string'
          ? patientToEdit.doctorId
          : (patientToEdit.doctorId as any)?._id || (patientToEdit as any)?.doctor?._id || '';

      const formattedVisitDate = patientToEdit.visitDate
        ? new Date(patientToEdit.visitDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      reset({
        name: patientToEdit.name,
        doctorId: docId,
        age: patientToEdit.age,
        gender: patientToEdit.gender,
        phone: patientToEdit.phone || '',
        email: patientToEdit.email || '',
        condition: patientToEdit.condition,
        status: patientToEdit.status,
        visitDate: formattedVisitDate,
        notes: patientToEdit.notes || '',
      });
    } else if (open) {
      reset({
        name: '',
        doctorId: preselectedDoctorId || (doctorsList.length > 0 ? doctorsList[0]._id : ''),
        age: 30,
        gender: 'male',
        phone: '',
        email: '',
        condition: 'Diabetes',
        status: 'active',
        visitDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [patientToEdit, open, preselectedDoctorId, reset, doctorsList]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      const payload = {
        name: data.name.trim(),
        doctorId: data.doctorId,
        age: Number(data.age),
        gender: data.gender,
        phone: data.phone.trim(),
        email: data.email?.trim() || undefined,
        condition: data.condition,
        status: data.status,
        visitDate: data.visitDate,
        notes: data.notes?.trim() || undefined,
      };

      if (isEdit && patientToEdit) {
        await updatePatient.mutateAsync({
          id: patientToEdit._id,
          data: payload,
        });
        toast.success('Patient updated successfully');
      } else {
        const { doctorId, ...rest } = payload;
        await createPatient.mutateAsync({
          doctorId,
          data: rest,
        });
        toast.success('Patient added successfully');
      }
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save patient');
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl w-full p-6 rounded-md bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-slate-100 dark:border-[#172545]">
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            {isEdit ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Patient Name */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Patient Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('name')}
                placeholder="Enter patient name"
                className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Doctor Select */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Doctor <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedDoctorId}
                onValueChange={(val) => {
                  if (val) setValue('doctorId', val, { shouldValidate: true });
                }}
                disabled={Boolean(preselectedDoctorId)}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white w-full">
                  <SelectValue placeholder="Select Doctor">
                    <span className="truncate block">
                      {selectedDoctor
                        ? `${selectedDoctor.name}${selectedDoctor.specialization ? ` (${selectedDoctor.specialization})` : ''}`
                        : 'Select Doctor'}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-md bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545] max-h-56">
                  {doctorsList.map((doc) => (
                    <SelectItem key={doc._id} value={doc._id} className="text-xs">
                      {doc.name} ({doc.specialization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorId && (
                <p className="mt-1 text-[11px] text-red-500">{errors.doctorId.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('age', { valueAsNumber: true })}
                type="number"
                placeholder="Enter age"
                className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {errors.age && (
                <p className="mt-1 text-[11px] text-red-500">{errors.age.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gender */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedGender}
                onValueChange={(val: any) => {
                  if (val) setValue('gender', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white w-full">
                  <SelectValue placeholder="Select gender">
                    <span className="capitalize block">
                      {selectedGender || 'Select gender'}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-md bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545]">
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g} className="text-xs capitalize">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="mt-1 text-[11px] text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('phone')}
                placeholder="Enter phone number"
                className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Email</Label>
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter email address"
                className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Condition */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Condition <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedCondition}
                onValueChange={(val) => {
                  if (val) setValue('condition', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white w-full">
                  <SelectValue placeholder="Select condition">
                    <span className="block">
                      {selectedCondition || 'Select condition'}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-md bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545] max-h-56">
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c} className="text-xs">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.condition && (
                <p className="mt-1 text-[11px] text-red-500">{errors.condition.message}</p>
              )}
            </div>

            {/* Visit Date */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Visit Date <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('visitDate')}
                type="date"
                className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white"
              />
              {errors.visitDate && (
                <p className="mt-1 text-[11px] text-red-500">{errors.visitDate.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(val: any) => {
                  if (val) setValue('status', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white w-full">
                  <SelectValue placeholder="Select status">
                    <span className="capitalize block">
                      {selectedStatus || 'Select status'}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-md bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545]">
                  {PATIENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Notes</Label>
            <Input
              {...register('notes')}
              placeholder="Enter notes (optional)"
              className="mt-1.5 h-9 text-xs rounded-md bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#172545]">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9 px-4 text-xs font-semibold rounded-md border-slate-200 dark:border-[#1c2a47] bg-white dark:bg-[#10192e] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#152342]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPatient.isPending || updatePatient.isPending}
              className="h-9 px-5 text-xs font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md shadow-sm"
            >
              {createPatient.isPending || updatePatient.isPending
                ? 'Saving...'
                : isEdit
                ? 'Update Patient'
                : 'Save Patient'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
