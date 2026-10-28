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
import { BarChart3 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TopDoctor } from '@/types/api';
import { TIMEFRAME_OPTIONS, usePatientsPerDoctor } from '@/hooks/useDashboardStats';
import { cn } from '@/lib/utils';

interface Props {
  data?: TopDoctor[];
}

export function PatientsPerDoctorChart({ data: initialData = [] }: Props) {
  const [timeframe, setTimeframe] = React.useState<string>('month');
  const { data: serverData, isFetching } = usePatientsPerDoctor(timeframe, initialData);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const sourceData = (serverData !== undefined ? serverData : initialData).slice(0, 7);

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

  const activeOption = TIMEFRAME_OPTIONS.find((opt) => opt.value === timeframe);

  return (
    <Card className="border-border bg-card rounded-xl shadow-xs h-full transition-colors">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-chart-1" />
          <CardTitle className="text-[14.5px] font-bold text-foreground">
            Patients Per Doctor
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

      <CardContent className={cn('px-3 pb-4 pt-2 transition-opacity duration-200', isFetching && 'opacity-60')}>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[225px] text-center text-muted-foreground">
            <p className="text-[13px] font-medium">No doctor patient data for this timeframe</p>
          </div>
        ) : (
          <div className="h-[225px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 16, right: 10, left: -24, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: 9.5, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10.5, fill: 'var(--muted-foreground)' }}
                  domain={yDomain}
                  ticks={yTicks}
                />
                <Tooltip
                  cursor={{ fill: 'var(--accent)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border text-popover-foreground text-[11px] px-2.5 py-1 rounded-md shadow-md font-semibold">
                          {payload[0].value} Patients
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}