
export interface FileDetails {
  file: File;
  URL: string;
}

export interface GenerativePart {
    inlineData: {
        data: string;
        mimeType: string;
    };
}

export type Page = 'Apparel' | 'Product';

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type NumImages = 1 | 2 | 4;
export type EcommercePack = 'Off' | 'Essential' | 'Plus' | 'Dynamic' | 'Editorial' | 'POV';
export type ColorGrade = 'None' | 'Cinematic Teal & Orange' | 'Vintage Film' | 'High-Contrast B&W' | 'Warm Vintage' | 'Cool Blue' | 'Golden Hour' | 'Noir';
export type ImageResolution = '1K' | '2K' | '4K';

export type AnalogCamera = 'None' | '2000s Y2K aesthetic' | '35mm film photograph' | 'analog camera look' | 'point-and-shoot flash' | 'direct flash photography' | 'grainy film texture' | 'soft vintage lighting' | 'slight color shift' | 'warm undertones' | 'natural indoor lighting' | 'hotel room aesthetic' | 'editorial lifestyle photo' | 'candid pose' | 'retro vibe' | 'slight blur and film grain' | 'low contrast look' | 'soft shadows and highlights' | 'unfiltered 2000s photography' | 'nostalgic analog mood' | 'shot on Kodak Portra 400';

export type LightingAndMood = 'None' | 'golden hour' | 'blue hour' | 'soft diffused light' | 'harsh midday sun' | 'backlit' | 'rim lighting' | 'volumetric light' | 'god rays' | 'neon-lit' | 'candlelit' | 'moonlit' | 'overcast light' | 'studio strobe' | 'high-key lighting' | 'low-key lighting' | 'Rembrandt lighting' | 'butterfly lighting' | 'split lighting' | 'chiaroscuro' | 'tungsten glow' | 'fluorescent ambience' | 'daylight-balanced' | 'window light' | 'spotlight beam';

export type BackgroundSetDesign = 'None' | 'seamless white paper backdrop' | 'pastel colorama backdrop' | 'cyclorama studio' | 'brutalist concrete wall' | 'aged brick alley' | 'industrial warehouse' | 'art deco interior' | 'mid-century modern living room' | 'Scandinavian minimal room' | 'Japanese tatami room' | 'neon alleyway' | 'retro 80s arcade' | '1950s diner booth' | 'Victorian library' | 'baroque palace hall' | 'gothic cathedral nave' | 'futuristic laboratory' | 'space station corridor' | 'cyberpunk skyline' | 'solarpunk greenhouse' | 'misty bamboo forest' | 'desert dunes at dusk' | 'rocky seaside cliffs' | 'snowy pine forest';

export type PoseCategory = 'Mens' | 'Womens' | 'Kids';

export interface Settings {
    aspectRatio: AspectRatio;
    numImages: NumImages;
    resolution: ImageResolution;
    ecommercePack: EcommercePack;
    socialMediaPack: boolean;
    completeAssetPack: boolean;
    hyperRealism: boolean;
    cinematicLook: boolean;
    colorGrade: ColorGrade;
    analogCamera: AnalogCamera;
    lightingAndMood: LightingAndMood;
    backgroundSetDesign: BackgroundSetDesign;
    poseCategory: PoseCategory;
    selectedPose: string | null;
    prompt: string;
}

export type ProductEcommercePack = 'Off' | 'Essential' | 'Plus';
export type JewelScale = 'Small' | 'Medium' | 'Large';

export interface ProductSettings {
    aspectRatio: AspectRatio;
    numImages: NumImages;
    resolution: ImageResolution;
    ecommercePack: ProductEcommercePack;
    hyperRealism: boolean;
    cinematicLook: boolean;
    colorGrade: ColorGrade;
    analogCamera: AnalogCamera;
    lightingAndMood: LightingAndMood;
    backgroundSetDesign: BackgroundSetDesign;
    jewelScale: JewelScale;
    prompt: string;
}