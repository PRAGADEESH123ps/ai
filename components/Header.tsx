
import React from 'react';
import { LogoIcon, ApparelIcon, ProductIcon, UserIcon, ChevronDownIcon } from './IconComponents';
import type { Page } from '../App';

interface HeaderProps {
  onGenerate: () => void;
  activePage: Page;
  onNavClick: (page: Page) => void;
  isLoading?: boolean;
}

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center space-x-2 px-2 md:px-3 py-2 rounded-md transition-colors duration-200 ${active ? 'bg-gray-700/50 text-white' : 'text-gray-400 hover:bg-gray-700/30 hover:text-white'}`}>
    {icon}
    <span className="text-sm font-medium hidden md:inline">{label}</span>
  </button>
);

export const Header: React.FC<HeaderProps> = ({ onGenerate, activePage, onNavClick, isLoading }) => {
  return (
    <header className="bg-[#1e1f24]/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10 h-16 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center space-x-3 shrink-0">
        <LogoIcon className="w-8 h-8 text-purple-500" />
        <h1 className="text-xl font-bold tracking-tight text-white hidden md:block">Virtual Studio</h1>
      </div>
      
      <div className="flex items-center space-x-1 md:space-x-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
        <NavItem icon={<ApparelIcon className="w-5 h-5" />} label="Apparel" active={activePage === 'Apparel'} onClick={() => onNavClick('Apparel')} />
        <NavItem icon={<ProductIcon className="w-5 h-5" />} label="Product" active={activePage === 'Product'} onClick={() => onNavClick('Product')} />
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 md:px-5 rounded-lg transition-colors duration-200 text-sm flex items-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
              <path d="M5 12a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2z" />
              <path d="M11 16.5A1.5 1.5 0 019.5 18h-3A1.5 1.5 0 015 16.5v-3A1.5 1.5 0 016.5 12h3A1.5 1.5 0 0111 13.5v3z" />
            </svg>
          )}
          <span className="hidden sm:inline">{isLoading ? 'Generating...' : 'Generate'}</span>
        </button>
        <div className="h-6 w-px bg-gray-700"></div>
        <button className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white">
          <UserIcon className="w-6 h-6" />
          <span className="hidden lg:inline">premium.user@virtualstudio.ai</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
