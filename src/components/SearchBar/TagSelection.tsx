import React, { useState } from 'react';
import { MixerVerticalIcon } from '@radix-ui/react-icons';

interface TagSelectionProps {
  onTagSelect: (tag: string) => void;
  selectedTags?: string[];
}

export const tagCategories: Record<string, string[]> = {
  modality: [
    'electron-microscopy',
    'cryo-electron-microscopy',
    'fluorescence-light-microscopy',
    'transmission-light-microscopy',
    'super-resolution-microscopy',
    'x-ray-microscopy',
    'force-microscopy',
    'high-content-imaging',
    'whole-slide-imaging',
  ],
  dims: ['2D', '3D', '2d-t', '3d-t'],
  content: [
    'cells',
    'nuclei',
    'extracellular-vesicles',
    'tissue',
    'plant',
    'mitochondria',
    'vasculature',
    'cell-membrane',
    'brain',
    'whole-organism',
  ],
  framework: ['tensorflow', 'pytorch', 'tensorflow.js'],
  software: ['ilastik', 'imagej', 'fiji', 'imjoy', 'deepimagej', 'napari'],
  method: ['stardist', 'cellpose', 'yolo', 'care', 'n2v', 'denoiseg'],
  network: ['unet', 'densenet', 'resnet', 'inception', 'shufflenet'],
  task: [
    'semantic-segmentation',
    'instance-segmentation',
    'object-detection',
    'image-classification',
    'denoising',
    'image-restoration',
    'image-reconstruction',
    'in-silico-labeling',
  ],
};

const TagSelection: React.FC<TagSelectionProps> = ({ onTagSelect, selectedTags = [] }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(prev => !prev);
  const handleTagClick = (tag: string) => {
    onTagSelect(tag);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="flex items-center px-3 py-2 border border-gray-300 shadow rounded-md hover:border-gray-500 focus:outline-none"
        aria-label="Filter by tags"
      >
        <MixerVerticalIcon className="h-5 w-5 " />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-md z-50">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Filter by Tags</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              Close
            </button>
          </div>

          <div className="p-4 space-y-6">
            {Object.entries(tagCategories).map(([category, tags]) => (
              <div key={category}>
                <h4 className="text-base font-medium text-gray-700 capitalize">
                  {category.replace(/-/g, ' ')}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`px-2 py-1 text-sm rounded-full whitespace-nowrap focus:outline-none
                          ${
                            isSelected
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelection;
