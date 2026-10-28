'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  status?: string;
  onStatusChange?: (val: string) => void;
  specializations: string[];
  hospitals: string[];
  onReset?: () => void;
  onSearch?: () => void;
}

export function DoctorFilters({
  search,
  onSearchChange,
  specialization,
  onSpecializationChange,
  hospital,
  onHospitalChange,
  status = '',
  onStatusChange,
  specializations,
  hospitals,
  onReset,
  onSearch,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row items-end justify-between gap-3 w-full">
        {/* Left: Search Input Field */}
        <div className="w-full lg:max-w-xs xl:max-w-sm flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] dark:text-[#5a6d8c]" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch?.();
              }}
              placeholder="Search doctors by name, specialization..."
              className="pl-9 h-9 text-xs bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-[#0f172a] dark:text-white rounded-md placeholder:text-[#94a3b8] dark:placeholder:text-[#5a6d8c] focus-visible:ring-1 focus-visible:ring-[#2584ff]"
            />
          </div>
        </div>

        {/* Right: 3 Filters + Reset Button without gap */}
        <div className="flex items-end gap-1 w-full lg:w-auto justify-end">
          {/* Specialization Filter */}
          <div className="w-36 min-w-0">
            <label className="text-[11px] font-semibold text-[#64748b] dark:text-[#8fa1be] block mb-1">
              Specialization
            </label>
            <Select
              value={specialization || 'all'}
              onValueChange={(val) => {
                if (val !== null) onSpecializationChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-[#0f172a] dark:text-white rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Specializations" className="truncate min-w-0">
                  <span className="truncate block" title={specialization || 'All Specializations'}>
                    {specialization || 'All Specializations'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545] rounded-md">
                <SelectItem value="all" className="text-xs">
                  All Specializations
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
          <div className="w-32 min-w-0">
            <label className="text-[11px] font-semibold text-[#64748b] dark:text-[#8fa1be] block mb-1">
              Hospital
            </label>
            <Select
              value={hospital || 'all'}
              onValueChange={(val) => {
                if (val !== null) onHospitalChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-[#0f172a] dark:text-white rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Hospitals" className="truncate min-w-0">
                  <span className="truncate block" title={hospital || 'All Hospitals'}>
                    {hospital || 'All Hospitals'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545] rounded-md">
                <SelectItem value="all" className="text-xs">
                  All Hospitals
                </SelectItem>
                {hospitals.map((hosp) => (
                  <SelectItem key={hosp} value={hosp} className="text-xs">
                    {hosp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-28 min-w-0">
            <label className="text-[11px] font-semibold text-[#64748b] dark:text-[#8fa1be] block mb-1">
              Status
            </label>
            <Select
              value={status || 'all'}
              onValueChange={(val) => {
                if (val !== null) onStatusChange?.(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-[#0f172a] dark:text-white rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Status" className="truncate min-w-0">
                  <span className="truncate block" title={status ? (status === 'active' ? 'Active' : 'Inactive') : 'All Status'}>
                    {status ? (status === 'active' ? 'Active' : 'Inactive') : 'All Status'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545] rounded-md">
                <SelectItem value="all" className="text-xs">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="text-xs">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="text-xs">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          {onReset && (
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="h-9 px-3 text-xs font-semibold rounded-md border-slate-200 dark:border-[#1c2a47] bg-white dark:bg-[#10192e] text-[#64748b] dark:text-[#8fa1be] hover:bg-slate-50 dark:hover:bg-[#152342] shrink-0"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
  );
}
