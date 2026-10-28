'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  ChevronUp,
  X,
  Stethoscope,
  Activity,
  Users,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
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
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Local draft state for bottom sheet
  const [draftDoc, setDraftDoc] = useState(doctorId);
  const [draftCondition, setDraftCondition] = useState(condition);
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftDate, setDraftDate] = useState(date);

  const handleOpenDrawer = () => {
    setDraftDoc(doctorId);
    setDraftCondition(condition);
    setDraftStatus(status);
    setDraftDate(date);
    setDrawerOpen(true);
  };

  const handleApplyDrawer = () => {
    onDoctorIdChange(draftDoc);
    onConditionChange(draftCondition);
    onStatusChange(draftStatus);
    onDateChange(draftDate);
    setDrawerOpen(false);
  };

  const handleResetDrawer = () => {
    setDraftDoc('');
    setDraftCondition('');
    setDraftStatus('');
    setDraftDate('');
    onReset?.();
    setDrawerOpen(false);
  };

  const selectedDoctorName = doctorId
    ? doctors.find((d) => d._id === doctorId)?.name || 'Doctor'
    : '';

  const activeFilters = [
    doctorId
      ? { type: 'doctor', label: selectedDoctorName, clear: () => onDoctorIdChange('') }
      : null,
    condition
      ? { type: 'condition', label: condition, clear: () => onConditionChange('') }
      : null,
    status
      ? {
          type: 'status',
          label: status === 'active' ? 'Active' : 'Discharged',
          clear: () => onStatusChange(''),
        }
      : null,
    date
      ? { type: 'date', label: date, clear: () => onDateChange('') }
      : null,
  ].filter(Boolean) as { type: string; label: string; clear: () => void }[];

  const activeCount = activeFilters.length;

  return (
    <>
      {/* ===================== MOBILE VIEW (< lg) ===================== */}
      <div className="flex flex-col gap-2.5 w-full lg:hidden">
        {/* Full-width Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search patients..."
            className="pl-9.5 h-10 text-xs bg-secondary border border-input text-foreground rounded-xl placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Filter Trigger Button */}
        <button
          type="button"
          id="mobile-patient-filter-btn"
          onClick={handleOpenDrawer}
          className={cn(
            'w-full flex items-center justify-between px-3.5 h-10 rounded-xl border text-xs font-semibold transition-colors cursor-pointer select-none',
            activeCount > 0
              ? 'border-primary/40 bg-primary/5 text-primary'
              : 'border-border bg-card text-foreground hover:bg-muted/50'
          )}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className={cn('h-4 w-4', activeCount > 0 ? 'text-primary' : 'text-muted-foreground')} />
            <span>Filters {activeCount > 0 ? `(${activeCount})` : ''}</span>
          </div>
          {activeCount > 0 ? (
            <ChevronUp className="h-4 w-4 text-primary" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Active Filter Chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {activeFilters.map((chip) => (
              <span
                key={chip.type}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.clear}
                  className="p-0.5 hover:bg-primary/20 rounded-full cursor-pointer transition-colors"
                  aria-label={`Remove ${chip.label} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ===================== MOBILE FILTER DRAWER (BOTTOM SHEET) ===================== */}
      {mounted &&
        createPortal(
          <>
            {drawerOpen && (
              <div
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
                aria-hidden="true"
              />
            )}

            <div
              className={cn(
                'fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-card border-t border-border p-5 pb-8 shadow-2xl transition-transform duration-300 ease-out lg:hidden max-h-[85vh] overflow-y-auto',
                drawerOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
              )}
            >
              {/* Pull Handle */}
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Filters</h3>
                <button
                  type="button"
                  id="mobile-patient-filter-close-btn"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                  aria-label="Close filters drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Filters Form */}
              <div className="space-y-4 py-4">
                {/* Doctor Filter */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <span>Doctor</span>
                  </div>
                  <Select
                    value={draftDoc || 'all'}
                    onValueChange={(val) => {
                      if (val !== null) setDraftDoc(val === 'all' ? '' : val);
                    }}
                  >
                    <SelectTrigger className="w-full h-11 text-xs bg-secondary border border-input text-foreground rounded-xl px-3">
                      <SelectValue placeholder="All Doctors">
                        <span className="truncate block">
                          {draftDoc
                            ? doctors.find((d) => d._id === draftDoc)?.name || 'All Doctors'
                            : 'All Doctors'}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border rounded-xl z-[70] max-h-60">
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
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>Condition</span>
                  </div>
                  <Select
                    value={draftCondition || 'all'}
                    onValueChange={(val) => {
                      if (val !== null) setDraftCondition(val === 'all' ? '' : val);
                    }}
                  >
                    <SelectTrigger className="w-full h-11 text-xs bg-secondary border border-input text-foreground rounded-xl px-3">
                      <SelectValue placeholder="All Conditions">
                        <span className="truncate block">
                          {draftCondition || 'All Conditions'}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border rounded-xl z-[70] max-h-60">
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
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Status</span>
                  </div>
                  <Select
                    value={draftStatus || 'all'}
                    onValueChange={(val) => {
                      if (val !== null) setDraftStatus(val === 'all' ? '' : val);
                    }}
                  >
                    <SelectTrigger className="w-full h-11 text-xs bg-secondary border border-input text-foreground rounded-xl px-3">
                      <SelectValue placeholder="All Status">
                        <span className="truncate block">
                          {draftStatus
                            ? draftStatus === 'active'
                              ? 'Active'
                              : 'Discharged'
                            : 'All Status'}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border rounded-xl z-[70]">
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

                {/* Visit Date Filter */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Visit Date</span>
                  </div>
                  <input
                    type="date"
                    value={draftDate}
                    onChange={(e) => setDraftDate(e.target.value)}
                    className="w-full h-11 px-3 text-xs bg-secondary border border-input text-foreground rounded-xl outline-none focus:ring-1 focus:ring-ring transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  id="mobile-patient-filter-reset-btn"
                  variant="outline"
                  onClick={handleResetDrawer}
                  className="flex-1 h-11 text-xs font-semibold rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  id="mobile-patient-filter-apply-btn"
                  onClick={handleApplyDrawer}
                  className="flex-1 h-11 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </>,
          document.body
        )}

      {/* ===================== DESKTOP VIEW (lg+) ===================== */}
      <div className="hidden lg:flex flex-col xl:flex-row items-end justify-between gap-3 w-full">
        {/* Left: Search Input Field */}
        <div className="w-full xl:max-w-xs 2xl:max-w-sm flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search patients by name, doctor, or condition..."
              className="pl-9 h-9 text-xs bg-secondary border-input text-foreground rounded-md placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Right: Filters, Single Date Picker & Reset button */}
        <div className="flex flex-wrap items-end gap-1.5 w-full xl:w-auto justify-end">
          {/* Doctor Filter */}
          <div className="w-32 sm:w-36 min-w-0">
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Doctor
            </label>
            <Select
              value={doctorId || 'all'}
              onValueChange={(val) => {
                if (val !== null) onDoctorIdChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-secondary border-input text-foreground rounded-md px-2.5 min-w-0">
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
              <SelectContent className="bg-popover border-border rounded-md max-h-60">
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
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Condition
            </label>
            <Select
              value={condition || 'all'}
              onValueChange={(val) => {
                if (val !== null) onConditionChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-secondary border-input text-foreground rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Conditions" className="truncate min-w-0">
                  <span className="truncate block" title={condition || 'All Conditions'}>
                    {condition || 'All Conditions'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover border-border rounded-md max-h-60">
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
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Status
            </label>
            <Select
              value={status || 'all'}
              onValueChange={(val) => {
                if (val !== null) onStatusChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-secondary border-input text-foreground rounded-md px-2.5 min-w-0">
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
              <SelectContent className="bg-popover border-border rounded-md">
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
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Visit Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full h-9 px-2.5 text-xs bg-secondary border border-input text-foreground rounded-md outline-none focus:ring-1 focus:ring-ring transition-colors [color-scheme:light] dark:[color-scheme:dark]"
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
              className="h-9 px-3 text-xs font-semibold rounded-md border-border bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
