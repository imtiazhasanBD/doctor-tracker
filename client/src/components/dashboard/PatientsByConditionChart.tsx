'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ConditionStat } from '@/types/api';

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

const DEFAULT_CONDITIONS: ConditionStat[] = [
  { condition: 'Diabetes', count: 850 },
  { condition: 'Hypertension', count: 825 },
  { condition: 'Asthma', count: 719 },
  { condition: 'Heart Disease', count: 619 },
  { condition: 'Arthritis', count: 567 },
  { condition: 'Others', count: 1420 },
];

const pctMap: Record<string, string> = {
  Diabetes: '17%',
  Hypertension: '16%',
  Asthma: '14%',
  'Heart Disease': '12%',
  Arthritis: '11%',
  Others: '30%',
};

export function PatientsByConditionChart({
  data = [],
  totalPatients = 5000,
}: Props) {
  const sourceData = data.length > 0 ? data : DEFAULT_CONDITIONS;
  const displayTotal = totalPatients > 0 ? totalPatients : 5000;

  const chartData = sourceData.slice(0, 6).map((item, idx) => {
    const pct = pctMap[item.condition] || `${Math.round((item.count / displayTotal) * 100)}%`;
    return {
      name: item.condition,
      value: item.count,
      pct,
      color: COLORS[idx % COLORS.length],
    };
  });

  return (
    <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] h-full transition-colors">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-[#2584ff] dark:text-[#38bdf8]" />
          <CardTitle className="text-[14.5px] font-bold text-[#0f172a] dark:text-white">
            Patients by Condition
          </CardTitle>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[11px] bg-[#f8fafc] dark:bg-[#10192e] border border-slate-200/80 dark:border-[#1c2d54] text-[#475569] dark:text-[#8fa1be] px-2.5 py-1 rounded-lg font-medium transition-colors"
        >
          This Month
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#5a6d8c]" />
        </button>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-2">
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
              <span className="text-[19px] font-extrabold text-[#0f172a] dark:text-white leading-none">
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
      </CardContent>
    </Card>
  );
}