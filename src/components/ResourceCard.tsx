'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArtifactInfo } from '@/types/artifact';
import { DownloadIcon, EyeOpenIcon, CalendarIcon } from '@radix-ui/react-icons';
import { resolveHyphaUrl } from '@/utils/urlHelpers';
import { useRouter } from 'next/navigation';

interface ArtifactCardProps {
  artifact: ArtifactInfo;
}

const CARD_COLORS = [
  'var(--accent)/10',
  'var(--primary)/10',
  'var(--secondary)/10',
  'var(--accent)/5',
];

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact }) => {
  // 1) Guard against missing manifest
  if (!artifact.manifest) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        Artifact data is unavailable.
      </div>
    );
  }

  // 2) Destructure and normalize tags
  const { manifest, download_count, view_count, created_at } = artifact;
  const tags = manifest.tags ?? [];
  const createdDate = new Date(created_at).toLocaleDateString();

  const router = useRouter();
  const [bgColor, setBgColor] = useState<string>('');

  // Refs & state for scrolling title & tags
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tagContainerRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [shouldScrollTitle, setShouldScrollTitle] = useState(false);
  const [showTagButtons, setShowTagButtons] = useState(false);
  const [isTagHover, setIsTagHover] = useState(false);

  // 3) Pick a tinted accent background on mount
  useEffect(() => {
    const color = CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
    setBgColor(`bg-[${color}]`);
  }, []);

  // 4) Detect overflowing title text
  useEffect(() => {
    const container = titleContainerRef.current;
    const text = titleRef.current;
    if (container && text) {
      const overflow = text.scrollWidth - container.clientWidth;
      if (overflow > 0) {
        setScrollDistance(-overflow);
        setShouldScrollTitle(true);
      }
    }
  }, [manifest.name]);

  // 5) Detect overflowing tags
  useEffect(() => {
    const tl = tagContainerRef.current;
    if (tl) {
      setShowTagButtons(tl.scrollWidth > tl.clientWidth);
    }
  }, [tags]);

  const handleClick = () => {
    const id = artifact.id.split('/').pop();
    router.push(`resources/${id}`);
  };

  const scrollTags = (dir: 'left' | 'right') => {
    tagContainerRef.current?.scrollBy({
      left: dir === 'left' ? -80 : 80,
      behavior: 'smooth'
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex flex-col justify-between rounded-xl shadow-lg p-4
        bg-[var(--chart-background)]
        text-[var(--foreground)]
        transition-colors duration-300
        border border-[var(--primary)]/20 hover:border-[var(--accent)]/50
        cursor-pointer h-full min-h-[200px]
        ${bgColor}
      `}
    >
      {/* Media / Covers */}
      <div className="relative w-full aspect-video overflow-hidden rounded-md mb-4">
        {manifest.covers?.length ? (
          <div
            className="absolute inset-0 flex overflow-x-auto whitespace-nowrap"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {manifest.covers.map((url, idx) => (
              <img
                key={idx}
                src={resolveHyphaUrl(url, artifact.id)}
                alt={`${manifest.name} cover ${idx + 1}`}
                className="inline-block w-full h-full object-cover scroll-snap-align-center"
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]">
            {manifest.icon ? (
              <img
                src={manifest.icon}
                alt={`${manifest.name} icon`}
                className="w-2/5 h-2/5 object-contain"
              />
            ) : manifest.id_emoji ? (
              <span className="text-4xl">{manifest.id_emoji}</span>
            ) : (
              <div className="w-16 h-16 bg-[var(--secondary)] rounded-full" />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {manifest.icon ? (
            <img
              src={manifest.icon}
              alt=""
              className="w-10 h-10 rounded"
            />
          ) : (
            <span className="text-3xl">{manifest.id_emoji || '📦'}</span>
          )}

          <div className="min-w-0">
            <div
              ref={titleContainerRef}
              className="relative overflow-hidden"
            >
              <div
                ref={titleRef}
                className="whitespace-nowrap inline-block font-semibold"
                onMouseEnter={() => {
                  if (shouldScrollTitle && titleRef.current) {
                    titleRef.current.style.transition = 'transform 4s linear';
                    titleRef.current.style.transform = `translateX(${scrollDistance}px)`;
                  }
                }}
                onMouseLeave={() => {
                  if (shouldScrollTitle && titleRef.current) {
                    titleRef.current.style.transition = 'transform 0.5s ease-out';
                    titleRef.current.style.transform = 'translateX(0)';
                  }
                }}
              >
                {manifest.name}
              </div>
            </div>
            <p className="text-sm opacity-80">{manifest.type}</p>
          </div>
        </div>

        <p className="text-sm line-clamp-3 opacity-90 mb-2">
          {manifest.description || 'No description provided.'}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div
            className="relative mb-2"
            onMouseEnter={() => setIsTagHover(true)}
            onMouseLeave={() => setIsTagHover(false)}
          >
            {showTagButtons && isTagHover && (
              <>
                <button
                  onClick={() => scrollTags('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-[var(--background)]/70 p-1 rounded-full shadow"
                >
                  ◀
                </button>
                <button
                  onClick={() => scrollTags('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-[var(--background)]/70 p-1 rounded-full shadow"
                >
                  ▶
                </button>
              </>
            )}
            <div
              ref={tagContainerRef}
              className="flex gap-2 overflow-x-auto hide-scrollbar px-1"
            >
              {tags.map(tag => (
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
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs opacity-70 pt-2 border-t border-[var(--primary)]/20">
        <div className="flex items-center gap-1">
          <DownloadIcon className="w-4 h-4" /> {download_count}
        </div>
        <div className="flex items-center gap-1">
          <EyeOpenIcon className="w-4 h-4" /> {view_count}
        </div>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" /> {createdDate}
        </div>
      </div>
    </div>
  );
};
