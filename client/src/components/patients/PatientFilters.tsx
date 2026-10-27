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
  fromDate: string;
  onFromDateChange: (val: string) => void;
  toDate: string;
  onToDateChange: (val: string) => void;
  doctors: Doctor[];
  conditions: string[];
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
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  doctors,
  conditions,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 w-full">
      {/* Search by name */}
      <div className="relative min-w-[180px] flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search patients..."
          className="pl-8 h-8 text-xs bg-white rounded-sm border-slate-200"
        />
      </div>

      {/* Doctor select */}
      <div className="w-36">
        <Select
          value={doctorId || 'all'}
          onValueChange={(val) => {
            if (val !== null) onDoctorIdChange(val === 'all' ? '' : val);
          }}
        >
          <SelectTrigger className="h-8 text-xs bg-white rounded-sm border-slate-200 w-full">
            <SelectValue placeholder="All Doctors" />
          </SelectTrigger>
          <SelectContent className="rounded-sm">
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

      {/* Condition select */}
      <div className="w-36">
        <Select
          value={condition || 'all'}
          onValueChange={(val) => {
            if (val !== null) onConditionChange(val === 'all' ? '' : val);
          }}
        >
          <SelectTrigger className="h-8 text-xs bg-white rounded-sm border-slate-200 w-full">
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent className="rounded-sm">
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

      {/* Status select */}
      <div className="w-32">
        <Select
          value={status || 'all'}
          onValueChange={(val) => {
            if (val !== null) onStatusChange(val === 'all' ? '' : val);
          }}
        >
          <SelectTrigger className="h-8 text-xs bg-white rounded-sm border-slate-200 w-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-sm">
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

      {/* Date Range inputs */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 rounded-sm h-8">
        <span className="text-[11px] text-slate-400">From:</span>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="text-xs bg-transparent border-0 outline-none text-slate-600"
        />
        <span className="text-[11px] text-slate-400">To:</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="text-xs bg-transparent border-0 outline-none text-slate-600"
        />
      </div>
    </div>
  );
}
