'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { BarChart3, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TopDoctor } from '@/types/api';

interface Props {
  data?: TopDoctor[];
}

const DEFAULT_DOCTORS: TopDoctor[] = [
  { doctorId: '1', name: 'Dr. Rahman', count: 24 },
  { doctorId: '2', name: 'Dr. Karim', count: 35 },
  { doctorId: '3', name: 'Dr. Islam', count: 32 },
  { doctorId: '4', name: 'Dr. Hasan', count: 20 },
  { doctorId: '5', name: 'Dr. Chowdhury', count: 22 },
  { doctorId: '6', name: 'Dr. Ahmed', count: 15 },
  { doctorId: '7', name: 'Dr. Fazal', count: 11 },
];

export function PatientsPerDoctorChart({ data = [] }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const sourceData = (data.length > 0 ? data : DEFAULT_DOCTORS).slice(0, 7);

  const chartData = sourceData.map((item) => {
    let cleanName = item.name.trim();
    if (!cleanName.startsWith('Dr.')) {
      const parts = cleanName.split(' ');
      cleanName = `Dr. ${parts[parts.length - 1]}`;
    }
    return {
      name: cleanName,
      count: item.count,
    };
  });

  const maxCount = Math.max(...chartData.map((d) => d.count || 0), 10);
  const isMockupScale = maxCount <= 40;
  const yMax = isMockupScale ? 40 : Math.ceil(maxCount / 50) * 50;
  const yDomain = [0, yMax];
  const yTicks = isMockupScale
    ? [0, 10, 20, 30, 40]
    : [
        0,
        Math.round(yMax * 0.25),
        Math.round(yMax * 0.5),
        Math.round(yMax * 0.75),
        yMax,
      ];

  const renderCustomLabel = (props: any) => {
    const { x, y, width, index, value } = props;
    if (index === 2 || (chartData.length <= 2 && index === 0)) {
      // Pill badge
      const pillW = 76;
      const pillH = 22;
      return (
        <g>
          <rect
            x={x + width / 2 - pillW / 2}
            y={Math.max(y - 28, 4)}
            width={pillW}
            height={pillH}
            rx={5}
            fill={isDark ? '#10192e' : '#0f172a'}
            stroke={isDark ? '#1c2d54' : 'none'}
            strokeWidth={1}
          />
          <text
            x={x + width / 2}
            y={Math.max(y - 14, 18)}
            fill="#ffffff"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="bold"
          >
            {value} Patients
          </text>
        </g>
      );
    }
    return null;
  };

  return (
    <Card className="border-slate-100 dark:border-[#172545] bg-white dark:bg-[#0c152a] rounded-xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] h-full transition-colors">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#2584ff] dark:text-[#38bdf8]" />
          <CardTitle className="text-[14.5px] font-bold text-[#0f172a] dark:text-white">
            Patients Per Doctor
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

      <CardContent className="px-3 pb-4 pt-2">
        <div className="h-[225px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 32, right: 10, left: -24, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#162444' : '#f1f5f9'}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 9.5, fill: isDark ? '#6b7f9e' : '#64748b' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10.5, fill: isDark ? '#6b7f9e' : '#94a3b8' }}
                domain={yDomain}
                ticks={yTicks}
              />
              <Tooltip
                cursor={{ fill: isDark ? '#10192e' : '#f8fafc' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0f172a] dark:bg-[#10192e] border border-transparent dark:border-[#1c2d54] text-white text-[11px] px-2.5 py-1 rounded-md shadow-md font-semibold">
                        {payload[0].value} Patients
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="#2584ff"
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
                label={renderCustomLabel}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}