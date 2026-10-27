'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  specialization: string;
  onSpecializationChange: (val: string) => void;
  hospital: string;
  onHospitalChange: (val: string) => void;
  specializations: string[];
  hospitals: string[];
}

export function DoctorFilters({
  search,
  onSearchChange,
  specialization,
  onSpecializationChange,
  hospital,
  onHospitalChange,
  specializations,
  hospitals,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Search Input */}
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name..."
          className="pl-8 h-8 text-xs bg-white rounded-sm border-slate-200"
        />
      </div>

      {/* Specialization Filter */}
      <div className="w-full sm:w-44">
        <Select
          value={specialization || 'all'}
          onValueChange={(val) => {
            if (val !== null) onSpecializationChange(val === 'all' ? '' : val);
          }}
        >
          <SelectTrigger className="h-8 text-xs bg-white rounded-sm border-slate-200 w-full">
            <SelectValue placeholder="All Specialization" />
          </SelectTrigger>
          <SelectContent className="rounded-sm">
            <SelectItem value="all" className="text-xs">
              All Specialization
            </SelectItem>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec} className="text-xs">
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hospital Filter */}
      <div className="w-full sm:w-44">
        <Select
          value={hospital || 'all'}
          onValueChange={(val) => {
            if (val !== null) onHospitalChange(val === 'all' ? '' : val);
          }}
        >
          <SelectTrigger className="h-8 text-xs bg-white rounded-sm border-slate-200 w-full">
            <SelectValue placeholder="All Hospital" />
          </SelectTrigger>
          <SelectContent className="rounded-sm">
            <SelectItem value="all" className="text-xs">
              All Hospital
            </SelectItem>
            {hospitals.map((hosp) => (
              <SelectItem key={hosp} value={hosp} className="text-xs">
                {hosp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
