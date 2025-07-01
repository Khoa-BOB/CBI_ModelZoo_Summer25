'use client';

import React from 'react';
import { ArtifactInfo } from '@/types/artifact';
import { DownloadIcon, EyeOpenIcon, CalendarIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

interface ArtifactListRowProps {
  artifact: ArtifactInfo;
}

export const ArtifactListRow: React.FC<ArtifactListRowProps> = ({ artifact }) => {
  const { manifest, download_count, view_count, created_at } = artifact;
  const createdDate = new Date(created_at).toLocaleDateString();
  const router = useRouter();
  const tags = manifest.tags ?? [];

  const handleClick = () => {
    const id = artifact.id.split('/').pop();
    router.push(`resources/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`
          flex items-center gap-4 p-4
          bg-[var(--chart-background)]
          border border-[var(--primary)]/20 dark:border-[var(--secondary)]/20
          rounded-lg shadow-sm hover:shadow-md
          hover:border-[var(--accent)]/50
          transition duration-200
          cursor-pointer
        `}
    >
      {/* Icon / Thumbnail */}
      <div
        className="
          w-14 h-14 flex-shrink-0 flex items-center justify-center
          bg-[var(--accent)]/30
          rounded
        "
      >
        {manifest.icon ? (
          <img
            src={manifest.icon}
            alt="icon"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <span className="text-2xl text-[var(--accent)]">
            {manifest.id_emoji || '📦'}
          </span>
        )}
      </div>

      {/* Text details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="font-semibold truncate text-[var(--foreground)]">
            {manifest.name}
          </div>
          <div className="text-xs truncate text-[var(--secondary)]">
            {manifest.type}
          </div>
        </div>
        <div className="text-xs line-clamp-2 text-[var(--foreground)]/70 mb-2">
          {manifest.description || 'No description provided.'}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 5).map(tag => (
              <span
                key={tag}
                className="
                  flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full
                  bg-[var(--accent)]/20 text-[var(--accent)]
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="flex flex-col items-end text-xs min-w-[70px] gap-1">
        <div className="flex items-center gap-1 text-[var(--secondary)]">
          <DownloadIcon className="w-4 h-4" /> {download_count}
        </div>
        <div className="flex items-center gap-1 text-[var(--secondary)]">
          <EyeOpenIcon className="w-4 h-4" /> {view_count}
        </div>
        <div className="flex items-center gap-1 text-[var(--secondary)]">
          <CalendarIcon className="w-4 h-4" /> {createdDate}
        </div>
      </div>
    </div>
  );
};
