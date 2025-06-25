import React from 'react';
import { ArtifactInfo } from '@/types/artifact';
import { DownloadIcon, EyeOpenIcon, CalendarIcon } from '@radix-ui/react-icons';

interface ArtifactListRowProps {
  artifact: ArtifactInfo;
}

export const ArtifactListRow: React.FC<ArtifactListRowProps> = ({ artifact }) => {
  const { manifest, download_count, view_count, created_at } = artifact;
  const createdDate = new Date(created_at).toLocaleDateString();

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg shadow-sm bg-white hover:shadow-md transition cursor-pointer">
      {/* Icon / Thumbnail */}
      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded">
        {manifest.icon ? (
          <img src={manifest.icon} alt="icon" className="w-10 h-10 object-cover rounded" />
        ) : (
          <span className="text-2xl">{manifest.id_emoji || '📦'}</span>
        )}
      </div>

      {/* Text details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-semibold truncate">{manifest.name}</div>
          <div className="text-xs text-gray-400 truncate">{manifest.type}</div>
        </div>
        <div className="text-xs text-gray-500 line-clamp-2">{manifest.description || 'No description provided.'}</div>

        {/* Tags */}
        {manifest.tags && manifest.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {manifest.tags.slice(0, 5).map(tag => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="flex flex-col items-end text-xs text-gray-500 min-w-[70px]">
        <div className="flex items-center gap-1"><DownloadIcon /> {download_count}</div>
        <div className="flex items-center gap-1"><EyeOpenIcon /> {view_count}</div>
        <div className="flex items-center gap-1"><CalendarIcon /> {createdDate}</div>
      </div>
    </div>
  );
};
