"use client";

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

const COLORS = ["#3b82f6", "#10b981", "#facc15", "#a855f7"]; // Blue, green, yellow, purple

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 rounded shadow px-2 py-1 text-xs">
        <strong>{name}</strong>: {value} items
      </div>
    );
  }
  return null;
};

export default function ResourceDonutChart({ data, total }: ResourceDonutChartProps) {
  return (
    <div className="relative rounded-2xl shadow-xl p-4 bg-white">
      <h2 className="text-lg font-semibold mb-4">Resource Distribution</h2>
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
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center total */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xl font-bold">{total}</div>
            <div className="text-xs text-gray-500">Total Items</div>
          </div>
        </div>
      </div>
    </div>
  );
}
