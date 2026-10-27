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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TopDoctor } from '@/types/api';

interface Props {
  data?: TopDoctor[];
}

export function PatientsPerDoctorChart({ data = [] }: Props) {
  const chartData = data.map((item) => ({
    name: item.name.replace(/^Dr\.\s*/i, 'Dr. '),
    count: item.count,
  }));

  return (
    <Card className="border-slate-200 bg-white rounded-sm shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold text-slate-800">
          Patients Per Doctor
        </CardTitle>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm font-medium">
          This Month
        </span>
      </CardHeader>
      <CardContent className="px-3 pb-5">
        <div className="h-[250px] w-full">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              No patient data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  domain={[0, 'dataMax + 5']}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-sm shadow-sm">
                          <p className="font-medium">{payload[0].payload.name}</p>
                          <p className="text-blue-300 font-semibold mt-0.5">
                            {payload[0].value} patients
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
