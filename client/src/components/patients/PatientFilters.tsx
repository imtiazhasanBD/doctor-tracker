'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Doctor } from '@/types/api';

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  doctorId: string;
  onDoctorIdChange: (val: string) => void;
  condition: string;
  onConditionChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  date: string;
  onDateChange: (val: string) => void;
  doctors: Doctor[];
  conditions: string[];
  onReset?: () => void;
}

export function PatientFilters({
  search,
  onSearchChange,
  doctorId,
  onDoctorIdChange,
  condition,
  onConditionChange,
  status,
  onStatusChange,
  date,
  onDateChange,
  doctors,
  conditions,
  onReset,
}: Props) {
  return (
    <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-md p-4 shadow-sm transition-colors">
      <div className="flex flex-col xl:flex-row items-end justify-between gap-3 w-full">
        {/* Left: Search Input Field */}
        <div className="w-full xl:max-w-xs 2xl:max-w-sm flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] dark:text-[#5a6d8c]" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search patients by name, doctor, or condition..."
              className="pl-9 h-9 text-xs bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-[#0f172a] dark:text-white rounded-md placeholder:text-[#94a3b8] dark:placeholder:text-[#5a6d8c] focus-visible:ring-1 focus-visible:ring-[#2584ff]"
            />
          </div>
        </div>

        {/* Right: Filters, Single Date Picker & Reset button */}
        <div className="flex flex-wrap items-end gap-1.5 w-full xl:w-auto justify-end">
          {/* Doctor Filter */}
          <div className="w-32 sm:w-36 min-w-0">
            <label className="text-[11px] font-semibold text-[#64748b] dark:text-[#8fa1be] block mb-1">
              Doctor
            </label>
            <Select
              value={doctorId || 'all'}
              onValueChange={(val) => {
                if (val !== null) onDoctorIdChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-[#0f172a] dark:text-white rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Doctors" className="truncate min-w-0">
                  <span
                    className="truncate block"
                    title={
                      doctorId
                        ? doctors.find((d) => d._id === doctorId)?.name || 'All Doctors'
                        : 'All Doctors'
                    }
                  >
                    {doctorId
                      ? doctors.find((d) => d._id === doctorId)?.name || 'All Doctors'
                      : 'All Doctors'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545] rounded-md max-h-60">
                <SelectItem value="all" className="text-xs">
                  All Doctors
                </SelectItem>
                {doctors.map((doc) => (
                  <SelectItem key={doc._id} value={doc._id} className="text-xs">
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition Filter */}
          <div className="w-32 sm:w-36 min-w-0">
            <label className="text-[11px] font-semibold text-[#64748b] dark:text-[#8fa1be] block mb-1">
              Condition
            </label>
            <Select
              value={condition || 'all'}
              onValueChange={(val) => {
                if (val !== null) onConditionChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-[#0f172a] dark:text-white rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Conditions" className="truncate min-w-0">
                  <span className="truncate block" title={condition || 'All Conditions'}>
                    {condition || 'All Conditions'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#172545] rounded-md max-h-60">
                <SelectItem value="all" className="text-xs">
                  All Conditions
                </SelectItem>
                {conditions.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
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
                if (val !== null) onStatusChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2a47] text-[#0f172a] dark:text-white rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Status" className="truncate min-w-0">
                  <span className="truncate block">
                    {status === 'active'
                      ? 'Active'
                      : status === 'discharged'
                      ? 'Discharged'
                      : 'All Status'}
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
                <SelectItem value="discharged" className="text-xs">
                  Discharged
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visit Date Single Filter */}
          <div className="w-36 min-w-0">
            <label className="text-[11px] font-semibold text-[#64748b] dark:text-[#8fa1be] block mb-1">
              Visit Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full h-9 px-2.5 text-xs bg-[#f8fafc] dark:bg-[#10192e] border border-slate-200/80 dark:border-[#1c2a47] text-[#0f172a] dark:text-white rounded-md outline-none focus:ring-1 focus:ring-[#2584ff] transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                title="Filter by Visit Date"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div>
            <label className="text-[11px] font-semibold opacity-0 block mb-1 select-none">
              Reset
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="h-9 px-3 text-xs font-semibold rounded-md border-slate-200/80 dark:border-[#1c2a47] bg-[#f8fafc] dark:bg-[#10192e] text-[#64748b] dark:text-[#8fa1be] hover:bg-slate-100 dark:hover:bg-[#16223d] hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
