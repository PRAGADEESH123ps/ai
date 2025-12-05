
import React, { useState } from 'react';
import { MagicWandIcon, UpscaleIcon, AnimateIcon, EditIcon, DownloadIcon, ProductIcon } from './IconComponents';

interface ImageDisplayProps {
  generatedImages: string[];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
  isLoading: boolean;
  error: string | null;
  hasUploadedContent: boolean;
  onApplyEdit: (prompt: string) => void;
  onUpscale: () => void;
  page: 'Apparel' | 'Product';
}

const ActionButton: React.FC<{ icon: React.ReactNode, label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ icon, label, className, ...props }) => (
    <button {...props} className={`flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${className}`}>
        {icon}
        <span>{label}</span>
    </button>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
    generatedImages, 
    activeImageIndex, 
    setActiveImageIndex, 
    isLoading, 
    error,
    hasUploadedContent,
    onApplyEdit,
    onUpscale,
    page
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const activeImageUrl = generatedImages.length > 0 ? generatedImages[activeImageIndex] : null;

  const handleEditClick = () => {
    setIsEditing(true);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleApplyClick = () => {
    if(editText.trim()) {
        onApplyEdit(editText);
        setIsEditing(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/50 rounded-lg">
            <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-white font-semibold">Generating your masterpiece...</p>
            <p className="mt-1 text-gray-400 text-sm">This can take a moment.</p>
          </div>
      );
    }

    if (error) {
       return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20 text-center p-4 rounded-lg">
            <p className="text-red-400 font-semibold text-lg">Generation Failed</p>
            <p className="text-sm text-gray-400 mt-2 max-w-md">{error}</p>
          </div>
        );
    }
    
    if (activeImageUrl) {
      return <img src={activeImageUrl} alt={`Generated result ${activeImageIndex + 1}`} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />;
    }

    if(hasUploadedContent) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                <MagicWandIcon className="h-12 w-12 text-gray-600" />
                <p className="mt-4 text-lg font-semibold text-gray-400">Ready to Generate</p>
                <p className="text-sm text-gray-500">Hit the 'Generate' button in the header.</p>
            </div>
        );
    }
    
    const Icon = page === 'Apparel' ? MagicWandIcon : ProductIcon;
    const title = page === 'Apparel' ? 'Virtual Studio Canvas' : 'Product Studio Canvas';
    const description = page === 'Apparel' 
        ? "Your generated images and videos will appear here. Begin by adding a model and apparel in the left panel."
        : "Your generated product shots will appear here. Begin by adding a product in the left panel.";


    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Icon className="mx-auto h-10 w-10 text-purple-400" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-gray-400 max-w-sm">{description}</p>
        </div>
    );
  };

  const renderApparelActions = () => (
    <>
      {isEditing ? (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <EditIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Describe your edit, e.g., 'Add a retro filter'"
            className="flex-grow min-w-[200px] bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            onKeyDown={(e) => e.key === 'Enter' && handleApplyClick()}
            autoFocus
          />
          <button onClick={handleApplyClick} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Apply</button>
          <button onClick={handleCancelEdit} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Cancel</button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <ActionButton icon={<UpscaleIcon className="w-4 h-4" />} label="Upscale" onClick={onUpscale} />
          <ActionButton icon={<AnimateIcon className="w-4 h-4" />} label="Animate" />
          <ActionButton icon={<EditIcon className="w-4 h-4" />} label="Edit" onClick={handleEditClick} />
          <div className="flex-grow"></div>
          <a href={activeImageUrl ?? '#'} download={`generated-image-${activeImageIndex + 1}.png`} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md transition-colors duration-200 text-sm font-bold">
            <DownloadIcon className="w-5 h-5" />
            <span>Download</span>
          </a>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {generatedImages.map((imgSrc, index) => (
          <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === activeImageIndex ? 'border-purple-500' : 'border-transparent hover:border-gray-500'}`}>
            <img src={imgSrc} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </>
  );

  const renderProductActions = () => (
    <div className="flex flex-col space-y-3">
       <div className="flex flex-wrap items-center gap-2">
            <ActionButton icon={<UpscaleIcon className="w-4 h-4"/>} label="Upscale" onClick={onUpscale} />
            <ActionButton icon={<AnimateIcon className="w-4 h-4"/>} label="Animate" />
            <div className="flex-grow"></div>
            <ActionButton icon={<EditIcon className="w-4 h-4"/>} label="Edit" onClick={handleEditClick} className="bg-gray-800" />
            <a href={activeImageUrl ?? '#'} download={`generated-product-${activeImageIndex + 1}.png`} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md transition-colors duration-200 text-sm font-bold">
                <DownloadIcon className="w-5 h-5"/>
                <span>Download</span>
            </a>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            {generatedImages.map((imgSrc, index) => (
                <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === activeImageIndex ? 'border-purple-500' : 'border-transparent hover:border-gray-500'}`}>
                    <img src={imgSrc} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                </button>
            ))}
        </div>
    </div>
  );


  return (
    <div className="w-full h-full flex flex-col space-y-4">
        <div className="flex-grow flex items-center justify-center relative min-h-0">
            {renderContent()}
        </div>
        
        {generatedImages.length > 0 && !isLoading && !error && (
            <div className="flex-shrink-0">
                {page === 'Apparel' ? renderApparelActions() : renderProductActions()}
            </div>
        )}
    </div>
  );
};
