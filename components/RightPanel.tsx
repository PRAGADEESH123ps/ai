
import React, { useState } from 'react';
import type { Settings, ProductSettings, AspectRatio, NumImages, EcommercePack, ProductEcommercePack, ColorGrade, JewelScale, ImageResolution, PoseCategory } from '../types';
import { OutputIcon, EcommerceIcon, CreativeIcon, ChevronUpIcon, ChevronDownIcon, SocialMediaIcon, CompleteAssetPackIcon, LooksIcon, SceneAndStyleIcon, PoseIcon } from './IconComponents';

interface RightPanelProps {
    page: 'Apparel' | 'Product';
    settings: Settings | ProductSettings;
    setSettings: React.Dispatch<React.SetStateAction<any>>;
}

const analogCameraOptions = [
    'None',
    '2000s Y2K aesthetic',
    '35mm film photograph',
    'analog camera look',
    'point-and-shoot flash',
    'direct flash photography',
    'grainy film texture',
    'soft vintage lighting',
    'slight color shift',
    'warm undertones',
    'natural indoor lighting',
    'hotel room aesthetic',
    'editorial lifestyle photo',
    'candid pose',
    'retro vibe',
    'slight blur and film grain',
    'low contrast look',
    'soft shadows and highlights',
    'unfiltered 2000s photography',
    'nostalgic analog mood',
    'shot on Kodak Portra 400'
];

const lightingOptions = [
    'None',
    'golden hour',
    'blue hour',
    'soft diffused light',
    'harsh midday sun',
    'backlit',
    'rim lighting',
    'volumetric light',
    'god rays',
    'neon-lit',
    'candlelit',
    'moonlit',
    'overcast light',
    'studio strobe',
    'high-key lighting',
    'low-key lighting',
    'Rembrandt lighting',
    'butterfly lighting',
    'split lighting',
    'chiaroscuro',
    'tungsten glow',
    'fluorescent ambience',
    'daylight-balanced',
    'window light',
    'spotlight beam'
];

const backgroundOptions = [
    'None',
    'seamless white paper backdrop',
    'pastel colorama backdrop',
    'cyclorama studio',
    'brutalist concrete wall',
    'aged brick alley',
    'industrial warehouse',
    'art deco interior',
    'mid-century modern living room',
    'Scandinavian minimal room',
    'Japanese tatami room',
    'neon alleyway',
    'retro 80s arcade',
    '1950s diner booth',
    'Victorian library',
    'baroque palace hall',
    'gothic cathedral nave',
    'futuristic laboratory',
    'space station corridor',
    'cyberpunk skyline',
    'solarpunk greenhouse',
    'misty bamboo forest',
    'desert dunes at dusk',
    'rocky seaside cliffs',
    'snowy pine forest'
];

const poses = [
  { id: 'pose1', name: 'Pose 1', src: 'https://placehold.co/300x400/1a1a1a/e5e7eb?text=Standing' },
  { id: 'pose2', name: 'Pose 2', src: 'https://placehold.co/300x400/1a1a1a/e5e7eb?text=Side+View' },
  { id: 'pose3', name: 'Pose 3', src: 'https://placehold.co/300x400/1a1a1a/e5e7eb?text=Walking' },
  { id: 'pose4', name: 'Pose 4', src: 'https://placehold.co/300x400/1a1a1a/e5e7eb?text=Contrapposto' },
  { id: 'pose5', name: 'Pose 5', src: 'https://placehold.co/300x400/1a1a1a/e5e7eb?text=Striding' },
  { id: 'pose6', name: 'Pose 6', src: 'https://placehold.co/300x400/1a1a1a/e5e7eb?text=Looking+Back' },
  { id: 'pose7', name: 'Pose 7', src: 'https://placehold.co/300x400/1a1a1a/e5e7eb?text=Action' },
  { id: 'pose8', name: 'Pose 8', src: 'https://placehold.co/300x400/1a1a1a/e5e7eb?text=Dynamic' },
];

const Section: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode, defaultOpen?: boolean }> = ({ icon, title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center space-x-3">
                    {icon}
                    <h3 className="font-semibold text-white">{title}</h3>
                </div>
                {isOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-400" /> : <ChevronDownIcon className="w-5 h-5 text-gray-400" />}
            </button>
            {isOpen && <div className="p-4 pt-0 space-y-4">{children}</div>}
        </div>
    );
}

const ToggleSwitch: React.FC<{ label: string, enabled: boolean, onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <button onClick={() => onChange(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${enabled ? 'bg-purple-600' : 'bg-gray-600'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const OptionButton: React.FC<{ label: React.ReactNode, active: boolean, onClick: () => void, className?: string }> = ({ label, active, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200 ${active ? 'bg-purple-600 text-white' : 'bg-gray-700/60 text-gray-300 hover:bg-gray-700'} ${className}`}
  >
    {label}
  </button>
);

const SelectSetting: React.FC<{ label: string, value: string, options: string[], onChange: (val: string) => void }> = ({ label, value, options, onChange }) => (
    <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <div className="relative">
            <select
                className="w-full appearance-none bg-gray-700/60 border border-gray-600 text-gray-200 text-sm rounded-lg p-2.5 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block transition-colors cursor-pointer"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                 <ChevronDownIcon className="h-4 w-4" />
            </div>
        </div>
    </div>
);

export const RightPanel: React.FC<RightPanelProps> = ({ page, settings, setSettings }) => {
    const updateSetting = (key: keyof Settings | keyof ProductSettings, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const aspectRatioOptions: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9'];

    if (page === 'Product') {
        const productSettings = settings as ProductSettings;
        return (
             <div className="w-full h-full text-white">
                <h2 className="text-lg font-semibold text-white p-4">Settings</h2>
                <Section icon={<OutputIcon className="w-5 h-5 text-gray-400" />} title="Output">
                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-2 block">Aspect Ratio</label>
                        <div className="grid grid-cols-3 gap-2">
                           {aspectRatioOptions.map(r => 
                                <OptionButton key={r} label={r} active={productSettings.aspectRatio === r} onClick={() => updateSetting('aspectRatio', r)} />
                            )}
                        </div>
                    </div>
                     <div>
                        <label className="text-xs font-medium text-gray-400 mb-2 block">Number of Images</label>
                        <div className="flex items-center space-x-2">
                           {([1, 2, 4] as NumImages[]).map(n => 
                                <OptionButton key={n} label={n} active={productSettings.numImages === n} onClick={() => updateSetting('numImages', n)} />
                            )}
                        </div>
                    </div>
                     <div>
                        <label className="text-xs font-medium text-gray-400 mb-2 block">Resolution</label>
                        <div className="flex items-center space-x-2">
                           {(['1K', '2K', '4K'] as ImageResolution[]).map(r =>
                                <OptionButton key={r} label={r} active={productSettings.resolution === r} onClick={() => updateSetting('resolution', r)} />
                            )}
                        </div>
                    </div>
                </Section>
                <Section icon={<CreativeIcon className="w-5 h-5 text-gray-400" />} title="Creative Controls">
                    <ToggleSwitch label="Hyper Realism" enabled={productSettings.hyperRealism} onChange={v => updateSetting('hyperRealism', v)} />
                    <ToggleSwitch label="Cinematic Look" enabled={productSettings.cinematicLook} onChange={v => updateSetting('cinematicLook', v)} />
                     <div>
                        <label className="text-xs font-medium text-gray-400 mb-2 block">Jewel Scale</label>
                        <div className="flex items-center space-x-2">
                           {(['Small', 'Medium', 'Large'] as JewelScale[]).map(s => 
                                <OptionButton key={s} label={s} active={productSettings.jewelScale === s} onClick={() => updateSetting('jewelScale', s)} className="flex-1 text-center justify-center"/>
                            )}
                        </div>
                    </div>
                    <SelectSetting 
                        label="Analog Camera" 
                        value={productSettings.analogCamera} 
                        options={analogCameraOptions} 
                        onChange={(v) => updateSetting('analogCamera', v)} 
                    />
                    <SelectSetting 
                        label="Lighting & Mood" 
                        value={productSettings.lightingAndMood} 
                        options={lightingOptions} 
                        onChange={(v) => updateSetting('lightingAndMood', v)} 
                    />
                     <SelectSetting 
                        label="Backgrounds & Set Design" 
                        value={productSettings.backgroundSetDesign} 
                        options={backgroundOptions} 
                        onChange={(v) => updateSetting('backgroundSetDesign', v)} 
                    />
                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-2 block">Color Grade</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['None', 'Cinematic Teal & Orange', 'Vintage Film', 'High-Contrast B&W', 'Warm Vintage', 'Cool Blue', 'Golden Hour', 'Noir'] as ColorGrade[]).map(c => 
                                <OptionButton key={c} label={c} active={productSettings.colorGrade === c} onClick={() => updateSetting('colorGrade', c)} className="py-2.5 text-xs h-12 flex items-center justify-center" />
                            )}
                        </div>
                    </div>
                </Section>
             </div>
        );
    }
    
    const apparelSettings = settings as Settings;
    return (
        <div className="w-full h-full text-white">
            <h2 className="text-lg font-semibold text-white p-4">Settings</h2>
            
            <Section icon={<OutputIcon className="w-5 h-5 text-gray-400" />} title="Output">
                <div>
                    <label className="text-xs font-medium text-gray-400 mb-2 block">Aspect Ratio</label>
                    <div className="grid grid-cols-3 gap-2">
                       {aspectRatioOptions.map(r => 
                            <OptionButton key={r} label={r} active={apparelSettings.aspectRatio === r} onClick={() => updateSetting('aspectRatio', r)} />
                        )}
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-medium text-gray-400 mb-2 block">Number of Images</label>
                    <div className="flex items-center space-x-2">
                       {([1, 2, 4] as NumImages[]).map(n => 
                            <OptionButton key={n} label={n} active={apparelSettings.numImages === n} onClick={() => updateSetting('numImages', n)} />
                        )}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-400 mb-2 block">Resolution</label>
                    <div className="flex items-center space-x-2">
                       {(['1K', '2K', '4K'] as ImageResolution[]).map(r =>
                            <OptionButton key={r} label={r} active={apparelSettings.resolution === r} onClick={() => updateSetting('resolution', r)} />
                        )}
                    </div>
                </div>
            </Section>

            <Section icon={<PoseIcon className="w-5 h-5 text-gray-400" />} title="Pose Reference">
                <SelectSetting 
                    label="Category" 
                    value={apparelSettings.poseCategory} 
                    options={['Mens', 'Womens', 'Kids']} 
                    onChange={(v) => updateSetting('poseCategory', v)} 
                />
                <div>
                    <label className="text-xs font-medium text-gray-400 mb-2 block">Poses</label>
                    <div className="grid grid-cols-4 gap-2">
                        {poses.map((pose) => (
                            <button
                                key={pose.id}
                                onClick={() => updateSetting('selectedPose', pose.name)}
                                className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-200 group ${apparelSettings.selectedPose === pose.name ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-gray-700 hover:border-gray-500'}`}
                            >
                                <div className="absolute inset-0 bg-gray-800 flex flex-col items-center p-2">
                                    <div className="relative flex-1 w-full h-full mb-1">
                                        <img 
                                            src={pose.src} 
                                            alt={pose.name} 
                                            className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity" 
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-400 text-center leading-tight font-medium">{pose.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
};
