'use client';

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface ModelUsageChartProps {
  data: {
    name: string;
    usage: number;
  }[];
}

export default function ModelUsageChart({ data }: ModelUsageChartProps) {
  // Truncate really long names
  const formatName = (name: string) =>
    name.length > 12 ? `${name.slice(0, 12)}…` : name;

  return (
    <div
      className="
        rounded-2xl shadow-2xl p-4
        bg-[var(--chart-background)]
        transition-colors duration-300
      "
    >
      <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
        Model Usage
      </h2>

      {data.length === 0 ? (
        <div className="text-[var(--foreground)] text-sm">
          No usage data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, bottom: 60, left: 0 }}
          >
            <defs>
              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--foreground)"
              strokeOpacity={0.1}
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              interval={0}
              height={60}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatName}
              // rotate long labels
              angle={-45}
              textAnchor="end"
              // style for tick text
              tick={{ fill: "var(--foreground)", fontSize: 12 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--foreground)", fontSize: 12 }}
            />

            <Tooltip
              wrapperStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--secondary)",
                color: "var(--foreground)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              contentStyle={{ backgroundColor: "var(--background)" }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 500 }}
            />

            <Bar
              dataKey="usage"
              fill="url(#usageGradient)"
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={800}
            >
              <LabelList
                dataKey="usage"
                position="top"
                fill="var(--foreground)"
                style={{ fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
