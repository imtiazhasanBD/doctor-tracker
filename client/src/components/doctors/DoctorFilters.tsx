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
  Building2,
  Users,
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

  // Local draft state for bottom sheet so user can pick and then tap "Apply Filters"
  const [draftSpec, setDraftSpec] = useState(specialization);
  const [draftHosp, setDraftHosp] = useState(hospital);
  const [draftStatus, setDraftStatus] = useState(status);

  // Sync draft state when drawer opens
  const handleOpenDrawer = () => {
    setDraftSpec(specialization);
    setDraftHosp(hospital);
    setDraftStatus(status);
    setDrawerOpen(true);
  };

  const handleApplyDrawer = () => {
    onSpecializationChange(draftSpec);
    onHospitalChange(draftHosp);
    onStatusChange?.(draftStatus);
    onSearch?.();
    setDrawerOpen(false);
  };

  const handleResetDrawer = () => {
    setDraftSpec('');
    setDraftHosp('');
    setDraftStatus('');
    onReset?.();
    setDrawerOpen(false);
  };

  const activeFilters = [
    specialization ? { type: 'specialization', label: specialization, clear: () => onSpecializationChange('') } : null,
    hospital ? { type: 'hospital', label: hospital, clear: () => onHospitalChange('') } : null,
    status ? { type: 'status', label: status === 'active' ? 'Active' : 'Inactive', clear: () => onStatusChange?.('') } : null,
  ].filter(Boolean) as { type: string; label: string; clear: () => void }[];

  const activeCount = activeFilters.length;

  return (
    <>
      {/* ===================== MOBILE VIEW (< lg) ===================== */}
      <div className="flex flex-col gap-2.5 w-full lg:hidden">
        {/* Search bar matching mockup (Panel 1) */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch?.();
            }}
            placeholder="Search doctors..."
            className="pl-9.5 h-10 text-xs bg-secondary border border-input text-foreground rounded-xl placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Filter Trigger Button (Panel 1 & Panel 3) */}
        <button
          type="button"
          id="mobile-filter-btn"
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

        {/* Active Filter Chips (Panel 3: Mobile - After Filter Applied) */}
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

      {/* ===================== MOBILE FILTER DRAWER (BOTTOM SHEET) (Panel 2) ===================== */}
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
                  id="mobile-filter-close-btn"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                  aria-label="Close filters drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Filters Form */}
              <div className="space-y-4 py-4">
                {/* Specialization Filter */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <span>Specialization</span>
                  </div>
                  <Select
                    value={draftSpec || 'all'}
                    onValueChange={(val) => {
                      if (val !== null) setDraftSpec(val === 'all' ? '' : val);
                    }}
                  >
                    <SelectTrigger className="w-full h-11 text-xs bg-secondary border border-input text-foreground rounded-xl px-3">
                      <SelectValue placeholder="All Specializations">
                        <span className="truncate block">
                          {draftSpec || 'All Specializations'}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border rounded-xl z-[70]">
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
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>Hospital</span>
                  </div>
                  <Select
                    value={draftHosp || 'all'}
                    onValueChange={(val) => {
                      if (val !== null) setDraftHosp(val === 'all' ? '' : val);
                    }}
                  >
                    <SelectTrigger className="w-full h-11 text-xs bg-secondary border border-input text-foreground rounded-xl px-3">
                      <SelectValue placeholder="All Hospitals">
                        <span className="truncate block">
                          {draftHosp || 'All Hospitals'}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border rounded-xl z-[70]">
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
                          {draftStatus ? (draftStatus === 'active' ? 'Active' : 'Inactive') : 'All Status'}
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
                      <SelectItem value="inactive" className="text-xs">
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  id="mobile-filter-reset-btn"
                  variant="outline"
                  onClick={handleResetDrawer}
                  className="flex-1 h-11 text-xs font-semibold rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  id="mobile-filter-apply-btn"
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
      <div className="hidden lg:flex items-end justify-between gap-3 w-full">
        {/* Left: Search Input Field */}
        <div className="w-full lg:max-w-xs xl:max-w-sm flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch?.();
              }}
              placeholder="Search doctors by name, specialization..."
              className="pl-9 h-9 text-xs bg-secondary border border-input text-foreground rounded-md placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Right: 3 Filters + Reset Button without gap */}
        <div className="flex items-end gap-1 w-full lg:w-auto justify-end">
          {/* Specialization Filter */}
          <div className="w-36 min-w-0">
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Specialization
            </label>
            <Select
              value={specialization || 'all'}
              onValueChange={(val) => {
                if (val !== null) onSpecializationChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-secondary border border-input text-foreground rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Specializations" className="truncate min-w-0">
                  <span className="truncate block" title={specialization || 'All Specializations'}>
                    {specialization || 'All Specializations'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border rounded-md">
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
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Hospital
            </label>
            <Select
              value={hospital || 'all'}
              onValueChange={(val) => {
                if (val !== null) onHospitalChange(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-secondary border border-input text-foreground rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Hospitals" className="truncate min-w-0">
                  <span className="truncate block" title={hospital || 'All Hospitals'}>
                    {hospital || 'All Hospitals'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border rounded-md">
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
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Status
            </label>
            <Select
              value={status || 'all'}
              onValueChange={(val) => {
                if (val !== null) onStatusChange?.(val === 'all' ? '' : val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs bg-secondary border border-input text-foreground rounded-md px-2.5 min-w-0">
                <SelectValue placeholder="All Status" className="truncate min-w-0">
                  <span className="truncate block" title={status ? (status === 'active' ? 'Active' : 'Inactive') : 'All Status'}>
                    {status ? (status === 'active' ? 'Active' : 'Inactive') : 'All Status'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border rounded-md">
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
              className="h-9 px-3 text-xs font-semibold rounded-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 cursor-pointer"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
