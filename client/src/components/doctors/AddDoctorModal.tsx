'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doctorSchema, DoctorFormData } from '@/schemas';
import { useDoctorMutations } from '@/hooks/useDoctors';
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
  specializations?: string[];
}

const DEFAULT_SPECIALIZATIONS = [
  'Cardiologist',
  'Neurologist',
  'Dermatologist',
  'Orthopedic',
  'Pediatrician',
  'General Physician',
  'Psychiatrist',
  'Oncologist',
];

export function AddDoctorModal({
  open,
  onOpenChange,
  specializations = DEFAULT_SPECIALIZATIONS,
}: Props) {
  const { createDoctor } = useDoctorMutations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: '',
      specialization: '',
      hospital: '',
      phone: '',
      email: '',
    },
  });

  const selectedSpec = watch('specialization');

  const onSubmit = async (data: DoctorFormData) => {
    try {
      await createDoctor.mutateAsync(data);
      toast.success('Doctor added successfully');
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add doctor');
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const specList =
    specializations.length > 0 ? specializations : DEFAULT_SPECIALIZATIONS;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full p-6 rounded-sm bg-white border-slate-200">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-bold text-slate-800">
            Add New Doctor
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('name')}
                placeholder="Enter doctor's name"
                className="mt-1.5 h-9 text-xs rounded-sm border-slate-200"
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Specialization */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Specialization <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedSpec}
                onValueChange={(val) => {
                  if (val) setValue('specialization', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-sm border-slate-200 w-full">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  {specList.map((spec) => (
                    <SelectItem key={spec} value={spec} className="text-xs">
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialization && (
                <p className="mt-1 text-[11px] text-red-500">{errors.specialization.message}</p>
              )}
            </div>

            {/* Hospital */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Hospital
              </Label>
              <Input
                {...register('hospital')}
                placeholder="Enter hospital name"
                className="mt-1.5 h-9 text-xs rounded-sm border-slate-200"
              />
              {errors.hospital && (
                <p className="mt-1 text-[11px] text-red-500">{errors.hospital.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Phone
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
          </div>

          {/* Email */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Email <span className="text-red-500">*</span>
            </Label>
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

          {/* Action buttons */}
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
              disabled={createDoctor.isPending}
              className="h-9 px-5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-sm"
            >
              {createDoctor.isPending ? 'Saving...' : 'Save Doctor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
