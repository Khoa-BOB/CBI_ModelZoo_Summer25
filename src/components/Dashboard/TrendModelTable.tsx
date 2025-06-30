'use client';

import React from 'react';

interface Model {
  name: string;
  usage: number;
  lastUsed: string;
}

interface ModelTableProps {
  models: Model[];
}

export default function ModelTable({ models }: ModelTableProps) {
  return (
    <div
      className={`
        rounded-2xl shadow-2xl overflow-x-auto p-6
        bg-white
        dark:bg-[var(--chart-background)]
        transition-colors duration-300
      `}
    >
      <table className="w-full table-auto border-separate border-spacing-y-4">
        <thead>
          <tr
            className="
              bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]
              text-white uppercase tracking-wide
            "
          >
            {['Model Name', 'Usage Count', 'Last Used'].map((h) => (
              <th key={h} className="text-left py-3 px-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.slice(0, 10).map((model, idx) => {
            // light: St. Jude Red / Cloud Blue tints
            const lightBg = idx % 2 === 0
              ? 'bg-[var(--accent)]/10'
              : 'bg-[var(--primary)]/10';

            // dark: deeper tints
            const darkBg = idx % 2 === 0
              ? 'dark:bg-[var(--accent)]/20'
              : 'dark:bg-[var(--primary)]/20';

            return (
              <tr
                key={model.name}
                className={`
                  ${lightBg} ${darkBg}
                  rounded-lg shadow-sm hover:shadow-md
                  transition-shadow duration-200
                  cursor-pointer
                `}
              >
                <td className="first:rounded-l-lg last:rounded-r-lg py-4 px-6 text-black dark:text-[var(--foreground)]">
                  {model.name}
                </td>
                <td className="py-4 px-6 text-black dark:text-[var(--foreground)]">
                  {model.usage}
                </td>
                <td className="py-4 px-6 text-black dark:text-[var(--foreground)]">
                  {model.lastUsed}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
