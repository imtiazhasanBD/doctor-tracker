'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, PatientFormData, CONDITIONS, GENDERS, PATIENT_STATUSES } from '@/schemas';
import { usePatientMutations } from '@/hooks/usePatients';
import { useDoctors } from '@/hooks/useDoctors';
import { Patient } from '@/types/api';
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
  const doctorsList = doctorsData?.data || [];

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

  useEffect(() => {
    if (patientToEdit) {
      const docId =
        typeof patientToEdit.doctorId === 'string'
          ? patientToEdit.doctorId
          : patientToEdit.doctorId?._id || '';

      reset({
        name: patientToEdit.name,
        doctorId: docId,
        age: patientToEdit.age,
        gender: patientToEdit.gender,
        phone: patientToEdit.phone,
        email: patientToEdit.email || '',
        condition: patientToEdit.condition,
        status: patientToEdit.status,
        visitDate: patientToEdit.visitDate
          ? new Date(patientToEdit.visitDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        notes: patientToEdit.notes || '',
      });
    } else if (open) {
      reset({
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
      });
    }
  }, [patientToEdit, open, preselectedDoctorId, reset]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (isEdit && patientToEdit) {
        await updatePatient.mutateAsync({
          id: patientToEdit._id,
          data,
        });
        toast.success('Patient updated successfully');
      } else {
        const { doctorId, ...rest } = data;
        await createPatient.mutateAsync({
          doctorId,
          data: rest,
        });
        toast.success('Patient added successfully');
      }
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save patient');
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl w-full p-6 rounded-sm bg-white border-slate-200 max-h-[90vh] overflow-y-auto"> 
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-bold text-slate-800">
            {isEdit ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Patient Name */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Patient Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('name')}
                placeholder="Enter patient name"
                className="mt-1.5 h-9 text-xs rounded-sm border-slate-200"
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Doctor Select */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Doctor <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedDoctorId}
                onValueChange={(val) => {
                  if (val) setValue('doctorId', val, { shouldValidate: true });
                }}
                disabled={Boolean(preselectedDoctorId)}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-sm border-slate-200 w-full">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
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
              <Label className="text-xs font-semibold text-slate-700">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('age', { valueAsNumber: true })}
                type="number"
                placeholder="Enter age"
                className="mt-1.5 h-9 text-xs rounded-sm border-slate-200"
              />
              {errors.age && (
                <p className="mt-1 text-[11px] text-red-500">{errors.age.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gender */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedGender}
                onValueChange={(val: any) => {
                  if (val) setValue('gender', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-sm border-slate-200 w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
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
              <Label className="text-xs font-semibold text-slate-700">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('phone')}
                placeholder="Enter phone number"
                className="mt-1.5 h-9 text-xs rounded-sm border-slate-200"
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">Email</Label>
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter email address"
                className="mt-1.5 h-9 text-xs rounded-sm border-slate-200"
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Condition */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Condition <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedCondition}
                onValueChange={(val) => {
                  if (val) setValue('condition', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-sm border-slate-200 w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
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
              <Label className="text-xs font-semibold text-slate-700">
                Visit Date <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('visitDate')}
                type="date"
                className="mt-1.5 h-9 text-xs rounded-sm border-slate-200"
              />
              {errors.visitDate && (
                <p className="mt-1 text-[11px] text-red-500">{errors.visitDate.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(val: any) => {
                  if (val) setValue('status', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-sm border-slate-200 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
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
            <Label className="text-xs font-semibold text-slate-700">Notes</Label>
            <Input
              {...register('notes')}
              placeholder="Enter notes (optional)"
              className="mt-1.5 h-9 text-xs rounded-sm border-slate-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9 px-4 text-xs font-medium rounded-sm border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPatient.isPending || updatePatient.isPending}
              className="h-9 px-5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-sm"
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
