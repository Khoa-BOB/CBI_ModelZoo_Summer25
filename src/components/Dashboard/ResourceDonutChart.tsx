'use client';

import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";

interface ResourceDonutChartProps {
  data: { name: string; value: number }[];
  total: number;
}

const COLORS = [
  "var(--accent)",
  "var(--primary)",
  "var(--secondary)",
  "var(--foreground)"
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div
        className="
          bg-[var(--background)]
          border border-gray-300
          rounded shadow
          px-2 py-1 text-xs
          text-[var(--foreground)]
        "
      >
        <strong>{name}</strong>: {value} items
      </div>
    );
  }
  return null;
};

export default function ResourceDonutChart({
  data,
  total
}: ResourceDonutChartProps) {
  return (
    <div
      className="
        relative rounded-2xl shadow-xl p-4
        bg-[var(--chart-background)]
        transition-colors duration-300
      "
    >
      <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
        Resource Distribution
      </h2>

      <div className="relative w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              isAnimationActive
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center total */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xl font-bold text-[var(--foreground)]">
              {total}
            </div>
            <div className="text-xs text-[var(--foreground)]/70">
              Total Items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
