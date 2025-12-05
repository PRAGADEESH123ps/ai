
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ImageDisplay } from './components/ImageDisplay';
import { RightPanel } from './components/RightPanel';
import { generateImageFromParts } from './services/geminiService';
import { fileToGenerativePart, base64UrlToGenerativePart } from './utils/fileUtils';
import type { FileDetails, Settings, ProductSettings, Page } from './types';

// Export Page type so it can be used in other files
export type { Page };

const defaultSettings: Settings = {
  aspectRatio: '3:4',
  numImages: 1,
  resolution: '1K',
  ecommercePack: 'Off',
  socialMediaPack: false,
  completeAssetPack: false,
  hyperRealism: false,
  cinematicLook: false,
  colorGrade: 'None',
  analogCamera: 'None',
  lightingAndMood: 'None',
  backgroundSetDesign: 'None',
  poseCategory: 'Womens',
  selectedPose: null,
  prompt: '',
};

const defaultProductSettings: ProductSettings = {
  aspectRatio: '3:4',
  numImages: 4,
  resolution: '1K',
  ecommercePack: 'Off',
  hyperRealism: true,
  cinematicLook: true,
  colorGrade: 'Cinematic Teal & Orange',
  analogCamera: 'None',
  lightingAndMood: 'None',
  backgroundSetDesign: 'None',
  jewelScale: 'Medium',
  prompt: '',
};


export default function App(): React.JSX.Element {
  // Apparel Page State
  const [modelImage, setModelImage] = useState<FileDetails | null>(null);
  const [apparelImages, setApparelImages] = useState<FileDetails[]>([]);
  const [apparelSettings, setApparelSettings] = useState<Settings>(defaultSettings);
  const [generatedApparelImages, setGeneratedApparelImages] = useState<string[]>([]);
  const [activeApparelImageIndex, setActiveApparelImageIndex] = useState<number>(0);

  // Product Page State
  const [productImage, setProductImage] = useState<FileDetails | null>(null);
  const [productSettings, setProductSettings] = useState<ProductSettings>(defaultProductSettings);
  const [generatedProductImages, setGeneratedProductImages] = useState<string[]>([]);
  const [activeProductImageIndex, setActiveProductImageIndex] = useState<number>(0);

  // Common State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<Page>('Product');

  const handleImageUpload = (file: File, type: 'model' | 'apparel' | 'product') => {
    const details = { file, URL: URL.createObjectURL(file) };
    if (type === 'model') {
      setModelImage(details);
    } else if (type === 'apparel') {
      setApparelImages(prev => [...prev, details]);
    } else if (type === 'product') {
      setProductImage(details);
    }
    
    if (type !== 'apparel') {
        setGeneratedApparelImages([]);
        setActiveApparelImageIndex(0);
        setGeneratedProductImages([]);
        setActiveProductImageIndex(0);
        setError(null);
    }
  };
  
  const handleImageRemove = (type: 'model' | 'apparel' | 'product', index?: number) => {
    if (type === 'model') {
      setModelImage(null);
    } else if (type === 'apparel') {
      if (typeof index === 'number') {
        setApparelImages(prev => prev.filter((_, i) => i !== index));
      } else {
        setApparelImages([]);
      }
    } else if (type === 'product') {
        setProductImage(null);
    }
    setError(null);
  };

  const buildApparelPrompt = (): string => {
    let promptParts: string[] = [`A ${apparelSettings.poseCategory.toLowerCase()} fashion photoshoot of the model wearing the apparel.`];
    if (apparelSettings.socialMediaPack) promptParts.push("Styled for a social media lifestyle shot.");
    if (apparelSettings.completeAssetPack) promptParts.push("Part of a complete asset pack, showing various angles and styles.");
    if (apparelSettings.ecommercePack !== 'Off') promptParts.push(`An e-commerce shot in '${apparelSettings.ecommercePack}' style.`);
    
    // Creative Controls
    if (apparelSettings.hyperRealism) promptParts.push("with hyper realism");
    if (apparelSettings.cinematicLook) promptParts.push("in a cinematic look");
    if (apparelSettings.colorGrade !== 'None') promptParts.push(`with ${apparelSettings.colorGrade.toLowerCase()} color grading`);
    if (apparelSettings.analogCamera !== 'None') promptParts.push(`in ${apparelSettings.analogCamera} style`);
    if (apparelSettings.lightingAndMood !== 'None') promptParts.push(`with ${apparelSettings.lightingAndMood}`);
    if (apparelSettings.backgroundSetDesign !== 'None') promptParts.push(`set against a ${apparelSettings.backgroundSetDesign}`);
    
    if (apparelSettings.selectedPose && apparelSettings.selectedPose !== 'None') {
        promptParts.push(`Model is posing in a ${apparelSettings.selectedPose} stance.`);
    }

    // Aspect ratio is now handled by imageConfig
    
    let basePrompt = promptParts.join(" ") + ".";
    if (apparelSettings.prompt.trim()) {
        basePrompt += ` Additional instructions: ${apparelSettings.prompt.trim()}`;
    }
    return basePrompt;
  };

  const buildProductPrompt = (): string => {
    let basePrompt = productSettings.prompt.trim();
    if (!basePrompt) {
        basePrompt = "A photorealistic product shot of the item in the image on a clean white background.";
    }

    const styleParts: string[] = [];
    if (productSettings.ecommercePack !== 'Off') styleParts.push(`e-commerce style: ${productSettings.ecommercePack}`);
    if (productSettings.hyperRealism) styleParts.push("hyper-realistic");
    if (productSettings.cinematicLook) styleParts.push("cinematic look");
    if (productSettings.colorGrade !== 'None') styleParts.push(`color grade: ${productSettings.colorGrade}`);
    if (productSettings.analogCamera !== 'None') styleParts.push(`analog aesthetic: ${productSettings.analogCamera}`);
    if (productSettings.lightingAndMood !== 'None') styleParts.push(`lighting: ${productSettings.lightingAndMood}`);
    if (productSettings.backgroundSetDesign !== 'None') styleParts.push(`background: ${productSettings.backgroundSetDesign}`);
    styleParts.push(`product scale: ${productSettings.jewelScale}`);
    // Aspect ratio is now handled by imageConfig

    if (styleParts.length > 0) {
      return `${basePrompt}. Apply the following styles: ${styleParts.join(', ')}.`;
    }
    
    return basePrompt;
  };


  const handleGenerateClick = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    // Determine settings and model based on resolution
    const currentSettings = activePage === 'Apparel' ? apparelSettings : productSettings;
    const isProModel = currentSettings.resolution === '2K' || currentSettings.resolution === '4K';
    const model = isProModel ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    // Check API Key for Pro model
    if (isProModel) {
         // @ts-ignore
         if (window.aistudio && window.aistudio.hasSelectedApiKey && window.aistudio.openSelectKey) {
             // @ts-ignore
             const hasKey = await window.aistudio.hasSelectedApiKey();
             if (!hasKey) {
                 try {
                    // @ts-ignore
                    await window.aistudio.openSelectKey();
                 } catch (e) {
                     console.error("Failed to select API key", e);
                     setError("API Key selection failed. Please try again.");
                     setIsLoading(false);
                     return;
                 }
             }
         }
    }

    if (activePage === 'Apparel') {
      if (!modelImage || apparelImages.length === 0) {
        setError('Please upload a model and at least one apparel item to generate an image.');
        setIsLoading(false);
        return;
      }
      setGeneratedApparelImages([]);
      setActiveApparelImageIndex(0);
      try {
        const modelPart = await fileToGenerativePart(modelImage.file);
        
        const apparelParts = await Promise.all(apparelImages.map(img => fileToGenerativePart(img.file)));
        const prompt = buildApparelPrompt();
        
        const newImages: string[] = [];
        // Execute sequentially to avoid rate limits
        for (let i = 0; i < apparelSettings.numImages; i++) {
             if (i > 0) await new Promise(r => setTimeout(r, 5000)); // Throttle
             const result = await generateImageFromParts(
                 [modelPart, ...apparelParts, {text: `${prompt} (Variation ${i + 1})`}],
                 { model, resolution: apparelSettings.resolution, aspectRatio: apparelSettings.aspectRatio }
             );
             if (result) newImages.push(result);
        }

        if (newImages.length > 0) setGeneratedApparelImages(newImages);
        else setError('Failed to generate images. The result was empty.');
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      }
    } else if (activePage === 'Product') {
      if (!productImage) {
        setError('Please upload a product to generate an image.');
        setIsLoading(false);
        return;
      }
       if (!productSettings.prompt.trim()) {
        setError('Please enter a prompt describing the scene.');
        setIsLoading(false);
        return;
      }
      setGeneratedProductImages([]);
      setActiveProductImageIndex(0);
       try {
        const productPart = await fileToGenerativePart(productImage.file);
        const prompt = buildProductPrompt();

        const newImages: string[] = [];
        // Execute sequentially to avoid rate limits
        for (let i = 0; i < productSettings.numImages; i++) {
            if (i > 0) await new Promise(r => setTimeout(r, 5000)); // Throttle
            const result = await generateImageFromParts(
                [productPart, { text: `${prompt} (Variation ${i + 1})`}],
                { model, resolution: productSettings.resolution, aspectRatio: productSettings.aspectRatio }
            );
            if (result) newImages.push(result);
        }

        if (newImages.length > 0) setGeneratedProductImages(newImages);
        else setError('Failed to generate images. The result was empty.');
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      }
    }
    setIsLoading(false);
  }, [activePage, modelImage, apparelImages, apparelSettings, productImage, productSettings, isLoading]);
  
  const handleUpscaleClick = useCallback(async (page: Page) => {
    if (isLoading) return;
    const images = page === 'Apparel' ? generatedApparelImages : generatedProductImages;
    const activeIndex = page === 'Apparel' ? activeApparelImageIndex : activeProductImageIndex;
    const currentSettings = page === 'Apparel' ? apparelSettings : productSettings;

    if (images.length === 0 || activeIndex < 0 || activeIndex >= images.length) {
        setError("No valid image selected to upscale.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const imageToUpscaleUrl = images[activeIndex];
        const imagePart = base64UrlToGenerativePart(imageToUpscaleUrl);
        const prompt = "Please upscale this image. Increase the resolution and enhance the details, making it sharper and clearer, while preserving the original content and artistic style.";
        
        const isProModel = currentSettings.resolution === '2K' || currentSettings.resolution === '4K';
        const model = isProModel ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

        const result = await generateImageFromParts(
            [imagePart, {text: prompt}],
            { model, resolution: currentSettings.resolution, aspectRatio: currentSettings.aspectRatio }
        );
        if (result) {
            const newImages = [...images];
            newImages[activeIndex] = result;
            if (page === 'Apparel') setGeneratedApparelImages(newImages);
            else setGeneratedProductImages(newImages);
        } else {
            setError('Failed to upscale the image. The result was empty.');
        }
    } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [generatedApparelImages, activeApparelImageIndex, generatedProductImages, activeProductImageIndex, isLoading, apparelSettings, productSettings]);

  const handleApplyEdit = useCallback(async (prompt: string, page: Page) => {
    if (isLoading) return;
    const images = page === 'Apparel' ? generatedApparelImages : generatedProductImages;
    const activeIndex = page === 'Apparel' ? activeApparelImageIndex : activeProductImageIndex;
    const currentSettings = page === 'Apparel' ? apparelSettings : productSettings;

    if (images.length === 0 || activeIndex < 0 || activeIndex >= images.length) {
        setError("No valid image selected to edit.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const imageToEditUrl = images[activeIndex];
        const imagePart = base64UrlToGenerativePart(imageToEditUrl);
        
        const isProModel = currentSettings.resolution === '2K' || currentSettings.resolution === '4K';
        const model = isProModel ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

        const result = await generateImageFromParts(
            [imagePart, {text: prompt}],
            { model, resolution: currentSettings.resolution, aspectRatio: currentSettings.aspectRatio }
        );
        if (result) {
            const newImages = [...images];
            newImages[activeIndex] = result;
            if (page === 'Apparel') setGeneratedApparelImages(newImages);
            else setGeneratedProductImages(newImages);
        } else {
            setError('Failed to edit the image. The result was empty.');
        }
    } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [generatedApparelImages, activeApparelImageIndex, generatedProductImages, activeProductImageIndex, isLoading, apparelSettings, productSettings]);

  return (
    <div className="min-h-screen bg-[#0f1014] text-gray-200 flex flex-col">
      <Header 
        onGenerate={handleGenerateClick} 
        activePage={activePage}
        onNavClick={(page) => { setActivePage(page); setError(null); }}
        isLoading={isLoading}
      />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 lg:h-[calc(100vh-64px)]">
        {activePage === 'Apparel' ? (
            <>
              <div className="lg:col-span-3 bg-[#1e1f24] rounded-lg p-4 flex flex-col lg:h-full lg:overflow-y-auto">
                <InputPanel
                  page="Apparel"
                  onImageUpload={handleImageUpload}
                  onImageRemove={(type, index) => handleImageRemove(type, index)}
                  modelImage={modelImage}
                  apparelImages={apparelImages}
                  settings={apparelSettings}
                  setSettings={setApparelSettings}
                />
              </div>
              <div className="order-first lg:order-none lg:col-span-6 bg-[#1e1f24] rounded-lg p-4 flex flex-col lg:h-full lg:overflow-hidden">
                <ImageDisplay
                  page="Apparel"
                  generatedImages={generatedApparelImages}
                  activeImageIndex={activeApparelImageIndex}
                  setActiveImageIndex={setActiveApparelImageIndex}
                  isLoading={isLoading}
                  error={error}
                  hasUploadedContent={!!modelImage && apparelImages.length > 0}
                  onApplyEdit={(prompt) => handleApplyEdit(prompt, 'Apparel')}
                  onUpscale={() => handleUpscaleClick('Apparel')}
                />
              </div>
              <div className="lg:col-span-3 bg-[#1e1f24] rounded-lg flex flex-col lg:h-full lg:overflow-y-auto">
                 <RightPanel page="Apparel" settings={apparelSettings} setSettings={setApparelSettings} />
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-3 bg-[#1e1f24] rounded-lg p-4 flex flex-col lg:h-full lg:overflow-y-auto">
                <InputPanel
                  page="Product"
                  onImageUpload={handleImageUpload}
                  onImageRemove={(type) => handleImageRemove(type)}
                  productImage={productImage}
                  settings={productSettings}
                  setSettings={setProductSettings}
                />
              </div>
              <div className="order-first lg:order-none lg:col-span-6 bg-[#1e1f24] rounded-lg p-4 flex flex-col lg:h-full lg:overflow-hidden">
                <ImageDisplay
                  page="Product"
                  generatedImages={generatedProductImages}
                  activeImageIndex={activeProductImageIndex}
                  setActiveImageIndex={setActiveProductImageIndex}
                  isLoading={isLoading}
                  error={error}
                  hasUploadedContent={!!productImage}
                  onApplyEdit={(prompt) => handleApplyEdit(prompt, 'Product')}
                  onUpscale={() => handleUpscaleClick('Product')}
                />
              </div>
              <div className="lg:col-span-3 bg-[#1e1f24] rounded-lg flex flex-col lg:h-full lg:overflow-y-auto">
                 <RightPanel page="Product" settings={productSettings} setSettings={setProductSettings} />
              </div>
            </>
          )}
      </main>
    </div>
  );
}