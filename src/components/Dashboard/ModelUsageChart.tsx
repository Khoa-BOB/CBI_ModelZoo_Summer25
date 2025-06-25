"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface ModelUsageChartProps {
  data: {
    name: string;
    usage: number;
  }[];
}

export default function ModelUsageChart({ data }: ModelUsageChartProps) {
  return (
    <div className="rounded-2xl shadow-xl p-4 bg-white">
      <h2 className="text-lg font-semibold mb-4">Model Usage</h2>
      {data.length === 0 ? (
        <div className="text-gray-500 text-sm">No usage data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
