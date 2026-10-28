'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doctorSchema, DoctorFormData } from '@/schemas';
import { useDoctorMutations } from '@/hooks/useDoctors';
import { Doctor } from '@/types/api';
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
  doctorToEdit?: Doctor | null;
  specializations?: string[];
}

const DEFAULT_SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'Psychiatry',
  'Oncology',
  'Ophthalmology',
];

export function AddDoctorModal({
  open,
  onOpenChange,
  doctorToEdit,
  specializations = DEFAULT_SPECIALIZATIONS,
}: Props) {
  const { createDoctor, updateDoctor } = useDoctorMutations();
  const isEdit = Boolean(doctorToEdit);

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

  useEffect(() => {
    if (open) {
      if (doctorToEdit) {
        reset({
          name: doctorToEdit.name || '',
          specialization: doctorToEdit.specialization || '',
          hospital: doctorToEdit.hospital || '',
          phone: doctorToEdit.phone || '',
          email: doctorToEdit.email || '',
        });
      } else {
        reset({
          name: '',
          specialization: '',
          hospital: '',
          phone: '',
          email: '',
        });
      }
    }
  }, [doctorToEdit, open, reset]);

  const onSubmit = async (data: DoctorFormData) => {
    try {
      if (isEdit && doctorToEdit) {
        await updateDoctor.mutateAsync({ id: doctorToEdit._id, data });
        toast.success(`Dr. ${data.name} updated successfully`);
      } else {
        await createDoctor.mutateAsync(data);
        toast.success('Doctor added successfully');
      }
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} doctor`);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const specList =
    specializations.length > 0 ? specializations : DEFAULT_SPECIALIZATIONS;
  const isPending = createDoctor.isPending || updateDoctor.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full p-6 rounded-md bg-card border border-border shadow-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-bold text-foreground">
            {isEdit ? 'Update Doctor' : 'Add New Doctor'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-foreground">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register('name')}
                placeholder="Enter doctor's name"
                className="mt-1.5 h-9 text-xs rounded-md bg-secondary border-input text-foreground placeholder:text-muted-foreground"
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold text-foreground">
                Specialization <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedSpec}
                onValueChange={(val) => {
                  if (val) setValue('specialization', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="mt-1.5 h-9 text-xs rounded-md bg-secondary border-input text-foreground w-full">
                  <SelectValue placeholder="Select specialization">
                    {selectedSpec || 'Select specialization'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-md bg-popover border-border">
                  {specList.map((spec) => (
                    <SelectItem key={spec} value={spec} className="text-xs">
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialization && (
                <p className="mt-1 text-[11px] text-destructive">{errors.specialization.message}</p>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold text-foreground">
                Hospital
              </Label>
              <Input
                {...register('hospital')}
                placeholder="Enter hospital name"
                className="mt-1.5 h-9 text-xs rounded-md bg-secondary border-input text-foreground placeholder:text-muted-foreground"
              />
              {errors.hospital && (
                <p className="mt-1 text-[11px] text-destructive">{errors.hospital.message}</p>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold text-foreground">
                Phone
              </Label>
              <Input
                {...register('phone')}
                placeholder="Enter phone number"
                className="mt-1.5 h-9 text-xs rounded-md bg-secondary border-input text-foreground placeholder:text-muted-foreground"
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter email address"
              className="mt-1.5 h-9 text-xs rounded-md bg-secondary border-input text-foreground placeholder:text-muted-foreground"
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9 px-4 text-xs font-medium rounded-md border-border bg-card text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 px-5 text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-sm"
            >
              {isPending
                ? isEdit
                  ? 'Updating...'
                  : 'Saving...'
                : isEdit
                  ? 'Update Doctor'
                  : 'Save Doctor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
