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
    <div className="rounded-2xl shadow-xl overflow-x-auto bg-white">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Model Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Usage Count</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Used</th>
          </tr>
        </thead>
        <tbody>
          {models.slice(0, 10).map((model, index) => (
            <tr
              key={model.name}
              className={`border-t transition-colors duration-200 cursor-pointer ${
                index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
              } hover:bg-gray-100`}
            >
              <td className="py-3 px-4">{model.name}</td>
              <td className="py-3 px-4">{model.usage}</td>
              <td className="py-3 px-4">{model.lastUsed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
