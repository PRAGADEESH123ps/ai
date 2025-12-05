import React, { useRef, useState } from 'react';
import type { FileDetails, Settings, ProductSettings } from '../types';
import { UploadIcon, ModelIcon, ApparelIcon, ProductIcon, CloseIcon } from './IconComponents';

type AllSettings = Settings | ProductSettings;

interface InputPanelProps {
  onImageUpload: (file: File, type: 'model' | 'apparel' | 'product') => void;
  onImageRemove: (type: 'model' | 'apparel' | 'product', index?: number) => void;
  page: 'Apparel' | 'Product';
  settings: AllSettings;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  modelImage?: FileDetails | null;
  apparelImages?: FileDetails[];
  productImage?: FileDetails | null;
}

const MainTabButton: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${active ? 'bg-purple-600/20 text-purple-300' : 'bg-gray-700/40 text-gray-400 hover:bg-gray-700/60 hover:text-white'}`}>
      {icon}
      <span>{label}</span>
    </button>
  );

const Dropzone: React.FC<{ onFileDrop: (file: File) => void; onRemove?: () => void; image: FileDetails | null; title: string; description: string; Icon?: React.FC<React.SVGProps<SVGSVGElement>>; }> = ({ onFileDrop, onRemove, image, title, description, Icon = UploadIcon }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
          onFileDrop(event.target.files[0]);
        }
      };
    
      const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
          onFileDrop(event.dataTransfer.files[0]);
        }
      };
    
      const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
      };
    
    return (
        <div
          className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors flex-grow flex flex-col justify-center items-center min-h-[200px]"
          onClick={() => !image && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {image ? (
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img src={image.URL} alt="Uploaded preview" className="max-h-full max-w-full rounded-md object-contain" />
              {onRemove && (
                  <button 
                      onClick={(e) => { e.stopPropagation(); onRemove(); }} 
                      className="absolute top-1 right-1 bg-gray-900/70 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      aria-label="Remove image"
                  >
                      <CloseIcon className="w-4 h-4" />
                  </button>
              )}
            </div>
          ) : (
            <>
              <Icon className="mx-auto h-10 w-10 text-gray-500" />
              <p className="mt-2 text-sm text-gray-400">
                <span className="font-semibold text-purple-400">{title}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
    );
};

export const InputPanel: React.FC<InputPanelProps> = ({
  onImageUpload,
  onImageRemove,
  page,
  settings,
  setSettings,
  modelImage,
  apparelImages,
  productImage,
}) => {
  const [activeApparelTab, setActiveApparelTab] = useState<'Model' | 'Apparel'>('Model');

  const updateApparelPrompt = (prompt: string) => {
    setSettings((prev: Settings) => ({ ...prev, prompt }));
  };

  const updateProductPrompt = (prompt: string) => {
    setSettings((prev: ProductSettings) => ({ ...prev, prompt }));
  };

  if (page === 'Product') {
    const productSettings = settings as ProductSettings;
    return (
        <div className="flex flex-col space-y-4 h-full">
            <h2 className="text-lg font-semibold text-white">Inputs</h2>
            <div className="flex-grow flex flex-col space-y-3">
                <label className="text-sm font-medium text-gray-300">Your Uploaded Product</label>
                <Dropzone 
                    onFileDrop={(file) => onImageUpload(file, 'product')}
                    onRemove={() => onImageRemove('product')}
                    image={productImage ?? null} 
                    title="Upload Product"
                    description="Drag 'n' drop or click to browse"
                    Icon={ProductIcon}
                />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Prompt</label>
               <textarea
                  value={productSettings.prompt}
                  onChange={(e) => updateProductPrompt(e.target.value)}
                  placeholder="e.g., on a marble table, with soft morning light..."
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
              />
            </div>
        </div>
    );
  }
  
  // Apparel Page
  const apparelSettings = settings as Settings;
  // Use the first image if available
  const displayApparelImage = apparelImages && apparelImages.length > 0 ? apparelImages[0] : null;

  return (
    <div className="flex flex-col space-y-4 h-full">
      <h2 className="text-lg font-semibold text-white">Inputs</h2>
      
      <div className="flex items-center space-x-2 bg-gray-800/70 p-1 rounded-lg">
        <MainTabButton icon={<ModelIcon className="w-5 h-5"/>} label="Model" active={activeApparelTab === 'Model'} onClick={() => setActiveApparelTab('Model')} />
        <MainTabButton icon={<ApparelIcon className="w-5 h-5"/>} label="Apparel" active={activeApparelTab === 'Apparel'} onClick={() => setActiveApparelTab('Apparel')} />
      </div>

      <div className="flex-grow flex flex-col space-y-4">
        {activeApparelTab === 'Model' ? (
            <Dropzone 
                onFileDrop={(file) => onImageUpload(file, 'model')} 
                onRemove={() => onImageRemove('model')}
                image={modelImage ?? null} 
                title="Upload Your Model"
                description="Drag 'n' drop or click to browse"
            />
        ) : (
            <Dropzone 
                onFileDrop={(file) => onImageUpload(file, 'apparel')} 
                onRemove={() => onImageRemove('apparel')}
                image={displayApparelImage} 
                title="Upload Your Apparel"
                description="Drag 'n' drop or click to browse"
            />
        )}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Prompt</label>
           <textarea
              value={apparelSettings.prompt}
              onChange={(e) => updateApparelPrompt(e.target.value)}
              placeholder="e.g., on a marble table, with soft morning light..."
              rows={5}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
          />
        </div>
      </div>
    </div>
  );
};