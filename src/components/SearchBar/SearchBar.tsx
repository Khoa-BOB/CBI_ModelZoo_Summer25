import React from 'react';
import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons';

interface SearchBarProps {
  value: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
}

export default function SearchBar({
  value,
  onSearchChange,
  selectedTags,
  onRemoveTag,
}: SearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto my-4">
      <div className="flex flex-wrap items-center border border-gray-300 rounded-lg px-3 py-2 gap-2">
        <MagnifyingGlassIcon className="text-gray-400" />

        {selectedTags.map((tag) => (
          <div
            key={tag}
            className="flex items-center bg-blue-600 text-white rounded-full px-2 py-1 text-sm"
          >
            <span className="mr-1">{tag}</span>
            <Cross2Icon
              className="w-4 h-4 cursor-pointer"
              onClick={() => onRemoveTag(tag)}
            />
          </div>
        ))}

        <input
          type="text"
          value={value}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resources..."
          className="flex-1 min-w-[120px] focus:outline-none"
        />
      </div>
    </div>
  );
}
