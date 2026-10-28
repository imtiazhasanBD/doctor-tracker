'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConditionStat } from '@/types/api';
import { TIMEFRAME_OPTIONS, usePatientsByCondition } from '@/hooks/useDashboardStats';
import { cn } from '@/lib/utils';

interface Props {
  data?: ConditionStat[];
  totalPatients?: number;
}

const COLORS = [
  '#2584ff', // Diabetes - Blue
  '#8b5cf6', // Hypertension - Purple
  '#10b981', // Asthma - Emerald
  '#f59e0b', // Heart Disease - Amber
  '#f97316', // Arthritis - Orange
  '#94a3b8', // Others - Slate
];

export function PatientsByConditionChart({
  data: initialData = [],
  totalPatients: initialTotal = 0,
}: Props) {
  const [timeframe, setTimeframe] = React.useState<string>('month');
  const { data: queryResult, isFetching } = usePatientsByCondition(timeframe, {
    conditions: initialData,
    total: initialTotal,
  });

  const sourceData = queryResult?.conditions !== undefined ? queryResult.conditions : initialData;
  const calculatedTotal = sourceData.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const displayTotal =
    queryResult?.total !== undefined && queryResult.total > 0
      ? queryResult.total
      : initialTotal > 0
        ? initialTotal
        : calculatedTotal;

  const chartData = sourceData.slice(0, 6).map((item, idx) => {
    const rawPct =
      item.percentage != null
        ? item.percentage
        : displayTotal > 0
          ? Math.round((item.count / displayTotal) * 100)
          : 0;
    return {
      name: item.condition,
      value: item.count,
      pct: `${rawPct}%`,
      color: COLORS[idx % COLORS.length],
    };
  });

  const activeOption = TIMEFRAME_OPTIONS.find((opt) => opt.value === timeframe);

  return (
    <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] h-full transition-colors">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-[#2584ff] dark:text-[#38bdf8]" />
          <CardTitle className="text-[14.5px] font-bold text-[#0f172a] dark:text-white">
            Patients by Condition
          </CardTitle>
        </div>

        <Select value={timeframe} onValueChange={(val) => val && setTimeframe(val)}>
          <SelectTrigger className="h-7 text-[11px] font-medium bg-[#f8fafc] dark:bg-[#10192e] border-slate-200/80 dark:border-[#1c2d54] text-[#475569] dark:text-[#8fa1be] px-2.5 rounded-lg shadow-none gap-1 focus-visible:ring-1 focus-visible:ring-[#2584ff]">
            <span>{activeOption?.label || 'This Month'}</span>
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#0c152a] border-slate-200 dark:border-[#1c2a47] min-w-[120px]">
            {TIMEFRAME_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-xs text-[#0f172a] dark:text-slate-200 cursor-pointer"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className={cn('px-5 pb-4 pt-2 transition-opacity duration-200', isFetching && 'opacity-60')}>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[220px] text-center text-[#64748b] dark:text-[#6b7f9e]">
            <p className="text-[13px] font-medium">No patient condition data for this timeframe</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-[220px]">
            {/* Donut Chart */}
            <div className="relative h-[185px] w-[185px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={82}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0f172a] dark:bg-[#10192e] border border-transparent dark:border-[#1c2d54] text-white text-[11px] px-2.5 py-1 rounded-md shadow-md font-semibold">
                            {payload[0].name}: {payload[0].value?.toLocaleString()}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[19px] font-bold text-[#0f172a] dark:text-white leading-none">
                  {displayTotal.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#64748b] dark:text-[#6b7f9e] font-medium mt-1">
                  Patients
                </span>
              </div>
            </div>

            {/* Condition Legend list with Count + Percentage */}
            <div className="flex-1 w-full space-y-2.5 pl-1">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-[12px]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#475569] dark:text-[#8fa1be] font-medium truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-[#0f172a] dark:text-white">
                      {item.value.toLocaleString()}
                    </span>
                    <span className="text-[#94a3b8] dark:text-[#5a6d8c] text-[11px] w-7 text-right">
                      {item.pct}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}