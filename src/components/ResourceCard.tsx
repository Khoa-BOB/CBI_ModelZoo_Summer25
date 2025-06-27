import React, { useRef, useEffect, useState } from 'react';
import { ArtifactInfo } from '@/types/artifact';
import { DownloadIcon, EyeOpenIcon, CalendarIcon  } from '@radix-ui/react-icons';
import { resolveHyphaUrl } from '@/utils/urlHelpers';
import { useRouter } from 'next/navigation';

interface ArtifactCardProps {
  artifact: ArtifactInfo;
}

const CARD_COLORS = [
  'bg-red-50',
  'bg-blue-50',
  'bg-green-50',
  'bg-yellow-50',
  'bg-purple-50',
  'bg-pink-50',
  'bg-indigo-50',
  'bg-orange-50'
];

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact }) => {
  const { manifest, download_count, view_count, created_at } = artifact;
  const createdDate = new Date(created_at).toLocaleDateString();

  const [bgColor, setBgColor] = useState('bg-white');

  const tagContainerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [scrollDistance, setScrollDistance] = useState(0);
  const [shouldScrollTitle, setShouldScrollTitle] = useState(false);
  const [showTagButtons, setShowTagButtons] = useState(false);
  const [isTagHover, setIsTagHover] = useState(false);

  const router = useRouter();
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Store covers URL
  const covers = artifact.manifest.covers || [];
  
  // // Get the resolved cover URL for the current index
  // const getCurrentCoverUrl = () => {
  //   if (covers.length === 0) return '';
  //   return resolveHyphaUrl(covers[currentImageIndex], artifact.id);
  // };

  useEffect(() => {
    // Set random background color
    const random = CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
    setBgColor(random);
  }, []);

  useEffect(() => {
    // Check if title overflows
    if (titleContainerRef.current && titleRef.current) {
      const containerWidth = titleContainerRef.current.offsetWidth;
      const textWidth = titleRef.current.scrollWidth;
      if (textWidth > containerWidth) {
        setScrollDistance(containerWidth - textWidth);
        setShouldScrollTitle(true);
      } else {
        setShouldScrollTitle(false);
      }
    }
  }, [manifest.name]);

  useEffect(() => {
    // Check if tags overflow
    if (tagContainerRef.current) {
      const { scrollWidth, clientWidth } = tagContainerRef.current;
      setShowTagButtons(scrollWidth > clientWidth);
    }
  }, [manifest.tags]);

  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if the click target is the card itself, not children
    // if (e.target === e.currentTarget) {
      const id = artifact.id.split('/').pop();
      router.push(`resources/${id}`)
    // }
  };

  function scrollTags(dir: 'left' | 'right') {
    if (tagContainerRef.current) {
      tagContainerRef.current.scrollBy({
        left: dir === 'left' ? -100 : 100,
        behavior: 'smooth'
      });
    }
  }

  return (
    <div
      className={`flex flex-col justify-between rounded-xl shadow-lg p-4 ${bgColor} border hover:border-blue-400 transition cursor-pointer h-full min-h-[200px]`}
      onClick={handleClick}
    >
      {/*Media section */}
      <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
        {covers.length > 0 ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollSnapType: 'x mandatory'
            }}
          >
            {covers.map((coverUrl, index) => (
              <img
                key={index}
                src={resolveHyphaUrl(coverUrl, artifact.id)}
                alt={`${artifact.manifest.name} cover ${index + 1}`}
                style={{
                  display: 'inline-block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer',
                  scrollSnapAlign: 'center'
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }}
          >
            {artifact.manifest.icon ? (
              <img
                src={artifact.manifest.icon}
                alt={artifact.manifest.name}
                style={{
                  width: '40%',
                  height: '40%',
                  objectFit: 'contain'
                }}
              />
            ) : artifact.manifest.id_emoji ? (
              <span style={{ fontSize: '3rem' }}>{artifact.manifest.id_emoji}</span>
            ) : (
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '50%'
                }}
              />
            )}
          </div>
        )}
      </div>

      {/*Contet section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {manifest.icon ? (
            <img src={manifest.icon} alt="icon" className="w-10 h-10 rounded" />
          ) : (
            <span className="text-3xl">{manifest.id_emoji || '📦'}</span>
          )}

          <div className="min-w-0">
            <div
              ref={titleContainerRef}
              className="relative overflow-hidden max-w-full"
            >
              <div
                ref={titleRef}
                className="text-sm font-semibold whitespace-nowrap inline-block"
                onMouseEnter={() => {
                  if (shouldScrollTitle && titleRef.current) {
                    titleRef.current.style.transition = 'transform 4s linear';
                    titleRef.current.style.transform = `translateX(${scrollDistance}px)`;
                  }
                }}
                onMouseLeave={() => {
                  if (shouldScrollTitle && titleRef.current) {
                    titleRef.current.style.transition = 'transform 0.5s ease-out';
                    titleRef.current.style.transform = `translateX(0)`;
                  }
                }}
              >
                {manifest.name}
              </div>
            </div>
            <p className="text-xs text-gray-500 truncate">{manifest.type}</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 line-clamp-3">
          {manifest.description || 'No description provided.'}
        </p>

        {manifest.tags && manifest.tags.length > 0 && (
          <div
            className="relative mt-2"
            onMouseEnter={() => setIsTagHover(true)}
            onMouseLeave={() => setIsTagHover(false)}
          >
            {showTagButtons && isTagHover && (
              <>
                <button
                  onClick={() => scrollTags('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow"
                >
                  ◀
                </button>
                <button
                  onClick={() => scrollTags('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow"
                >
                  ▶
                </button>
              </>
            )}

            <div
              ref={tagContainerRef}
              className="flex overflow-x-auto gap-1 hide-scrollbar"
            >
              {manifest.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex-shrink-0 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t">
        <div><DownloadIcon/> {download_count}</div>
        <div><EyeOpenIcon/> {view_count}</div>
        <div><CalendarIcon/> {createdDate}</div>
      </div>
    </div>
  );
};
