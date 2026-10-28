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
  'var(--chart-1)', // Diabetes - Blue
  'var(--chart-5)', // Hypertension - Purple
  'var(--chart-2)', // Asthma - Emerald
  'var(--chart-3)', // Heart Disease - Amber
  'var(--chart-4)', // Arthritis - Rose/Orange
  'var(--muted-foreground)', // Others - Muted
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
    <Card className="border-border bg-card rounded-xl shadow-xs h-full transition-colors">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-chart-1" />
          <CardTitle className="text-[14.5px] font-bold text-foreground">
            Patients by Condition
          </CardTitle>
        </div>

        <Select value={timeframe} onValueChange={(val) => val && setTimeframe(val)}>
          <SelectTrigger className="h-7 text-[11px] font-medium bg-secondary border-border text-foreground px-2.5 rounded-lg shadow-none gap-1 focus-visible:ring-1 focus-visible:ring-ring">
            <span>{activeOption?.label || 'This Month'}</span>
          </SelectTrigger>
          <SelectContent className="bg-popover border-border min-w-[120px]">
            {TIMEFRAME_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-xs text-foreground cursor-pointer"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className={cn('px-5 pb-4 pt-2 transition-opacity duration-200', isFetching && 'opacity-60')}>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[220px] text-center text-muted-foreground">
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
                          <div className="bg-popover border border-border text-popover-foreground text-[11px] px-2.5 py-1 rounded-md shadow-md font-semibold">
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
                <span className="text-[19px] font-bold text-foreground leading-none">
                  {displayTotal.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium mt-1">
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
                    <span className="text-foreground font-medium truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-foreground">
                      {item.value.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-[11px] w-7 text-right">
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