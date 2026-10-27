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

  const renderCustomLabel = (props: any) => {
    const { x, y, width, index, value } = props;
    if (index === 2) {
      // Dr. Islam pill badge
      const pillW = 68;
      const pillH = 22;
      return (
        <g>
          <rect
            x={x + width / 2 - pillW / 2}
            y={y - 28}
            width={pillW}
            height={pillH}
            rx={5}
            fill="#0f172a"
          />
          <text
            x={x + width / 2}
            y={y - 14}
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
    <Card className="border-slate-100 bg-white rounded-md shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] h-full">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#2584ff]" />
          <CardTitle className="text-[14.5px] font-bold text-[#0f172a]">
            Patients Per Doctor
          </CardTitle>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[11px] bg-[#f8fafc] border border-slate-200/80 text-[#475569] px-2.5 py-1 rounded-lg font-medium"
        >
          This Month
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 9.5, fill: '#64748b' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10.5, fill: '#94a3b8' }}
                domain={[0, 40]}
                ticks={[0, 10, 20, 30, 40]}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0f172a] text-white text-[11px] px-2.5 py-1 rounded-md shadow-md font-semibold">
                        {payload[0].value} Patients
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
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