'use client'

import React, {useEffect,useState,useCallback} from "react";
import { usePathname,useRouter } from "next/navigation";
import { useHyphaStore } from "@/store/hyphaStore";
import {ArtifactCard} from "@/components/ResourceCard"
import { ArtifactInfo } from '@/types/artifact'
import SearchBar from "./SearchBar/SearchBar";
import { ArtifactListRow } from "./ResrouceListRow";
import { DashboardIcon, ListBulletIcon } from '@radix-ui/react-icons';
import TagSelection from "./SearchBar/TagSelection";

interface ResourceGridProps {
  type?: 'model' | 'application' | 'notebook' | 'dataset';
}


// Add this overlay spinner component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-white/70 to-gray-100/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/90 rounded-xl p-8 shadow-2xl flex flex-col items-center space-y-4">
      {/* Custom spinner with icon */}
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-t-transparent border-b-transparent border-l-blue-500 border-r-blue-300 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl text-blue-500 opacity-80">
          📦
        </div>
      </div>

      {/* Loading text */}
      <div className="text-lg font-semibold text-gray-700 tracking-wide">
        Loading resources...
      </div>

      {/* Optional subtext */}
      <div className="text-xs text-gray-500">
        Please wait while we fetch your data.
      </div>
    </div>
  </div>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
      >
        Previous
      </button>
      
      {/* Page numbers */}
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded ${
              currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        );
      })}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};


export const ResroucesGrid: React.FC<ResourceGridProps> = ({type}) =>{
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pathname = usePathname();
    const navigate = useRouter();
    const { 
        resources,
        resourceType,
        setResourceType,
        fetchResources,
        totalItems,
        itemsPerPage
    } = useHyphaStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [serverSearchQuery, setServerSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');


    useEffect(() => {
        const path = pathname.split('/')[1];

        //Transform plural path to singular type
        const typeMap: { [key: string]: string } = {
            models: 'model',
            datasets: 'dataset',
            applications: 'application',
            notebooks: 'notebook'
        };

        //Update artifact type in store when path change
        const currentType = typeMap[path] || null;

        setResourceType(currentType);

        //Reset the first page when artifact type change
        setCurrentPage(1);

    }, [pathname, setResourceType]);

    //Fetch resrouces
    useEffect(() => {
        const loadResources = async () => {
        try {
            setLoading(true);
            await fetchResources(currentPage, serverSearchQuery, {
            tags: selectedTags
            });
        } finally {
            setLoading(false);
        }
        };

        loadResources();
    }, [pathname, currentPage, resourceType, serverSearchQuery, selectedTags, fetchResources]);

    // Add debounced server search
  useEffect(() => {
    const timer = setTimeout(() => {
      setServerSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500); // 500ms delay before triggering server search

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Remove client-side filtering since server handles it
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      // Toggle tag: add if not present, remove if present
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    setCurrentPage(1);
  };

//   const handlePartnerClick = useCallback((partnerId: string) => {
//     setSearchQuery(partnerId);
//     setCurrentPage(1);
//   }, []);

//   const handleTagSelect = (tag: string) => {
//     setSelectedTags(prev => {
//       return [tag];
//     });
//     setSearchQuery(tag);
//     setCurrentPage(1);
//   };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
    return(
        <div>
           {loading && <LoadingOverlay/>}
          
          <div className="max-w-3xl mx-auto w-full">
  <div
    className="
      rounded-xl shadow-md 
      border border-[var(--primary)]
      bg-[var(--chart-background)] dark:bg-[var(--background)]
      transition-colors duration-300
    "
  >
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex-1 min-w-0">
        <SearchBar
          value={searchQuery}
          onSearchChange={handleSearchChange}
          selectedTags={selectedTags}
          onRemoveTag={(tag) =>
            setSelectedTags((prev) => prev.filter((t) => t !== tag))
          }
        />
      </div>
      <div className="flex-none">
        <TagSelection
          onTagSelect={handleTagSelect}
          selectedTags={selectedTags}
        />
      </div>
    </div>
  </div>
</div>



          {/*Toggle button */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded bg-gray-100 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                aria-label="Grid view"
              >
                <DashboardIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                aria-label="List view"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-[1400px] mx-auto">
              {resources.map(artifact => (
                  <div
                    key={artifact.id}
                    className="h-full max-w-[320px] w-full mx-auto"
                  >
                    <ArtifactCard artifact={artifact} />
                  </div>
                  ))}
            </div>
          ):(
            <div className="flex flex-col gap-4 max-w-[900px] mx-auto">
              {resources.map(artifact => (
                <ArtifactListRow key={artifact.id} artifact={artifact} />
              ))}
            </div>
          )}
          


          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

        </div>
    )
}