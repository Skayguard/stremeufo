import React, { useRef } from 'react';
import { OverlayTemplate } from '../types';

interface BrandingPanelProps {
  bannerText: string;
  setBannerText: (text: string) => void;
  setLogo: (file: File | null) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  overlayTemplate: OverlayTemplate;
  setOverlayTemplate: (template: OverlayTemplate) => void;
}

const themeColors = ['#1e40af', '#be123c', '#047857', '#7e22ce']; // Blue, Red, Green, Purple

export const BrandingPanel: React.FC<BrandingPanelProps> = ({ 
  bannerText, 
  setBannerText, 
  setLogo,
  themeColor,
  setThemeColor,
  overlayTemplate,
  setOverlayTemplate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0]);
    }
  };
  
  const handleClearLogo = () => {
    setLogo(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="bg-dark-surface p-4 rounded-lg h-full flex flex-col gap-6">
      <h3 className="text-lg font-bold text-dark-text">Identidade Visual</h3>
      
      <div>
        <h4 className="block text-sm font-medium text-dark-text-secondary mb-2">Cor do Tema</h4>
        <div className="flex items-center gap-2">
            {themeColors.map(color => (
                <button 
                    key={color} 
                    onClick={() => setThemeColor(color)}
                    className={`w-8 h-8 rounded-full transition-all ${themeColor === color ? 'ring-2 ring-offset-2 ring-offset-dark-surface ring-white' : ''}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Definir cor do tema para ${color}`}
                />
            ))}
             <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-8 h-8 rounded-full border-none bg-transparent cursor-pointer"
                style={{'--color': themeColor} as React.CSSProperties}
             />
        </div>
      </div>

      <div>
        <h4 className="block text-sm font-medium text-dark-text-secondary mb-2">Modelo de Overlay</h4>
        <div className="flex gap-2">
            <button
                onClick={() => setOverlayTemplate(OverlayTemplate.Classic)}
                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${overlayTemplate === OverlayTemplate.Classic ? 'bg-brand-blue text-white' : 'bg-gray-600 hover:bg-gray-500 text-dark-text'}`}
            >
                Clássico
            </button>
            <button
                onClick={() => setOverlayTemplate(OverlayTemplate.Ticker)}
                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${overlayTemplate === OverlayTemplate.Ticker ? 'bg-brand-blue text-white' : 'bg-gray-600 hover:bg-gray-500 text-dark-text'}`}
            >
                Letreiro
            </button>
        </div>
      </div>

      <div>
        <label htmlFor="banner" className="block text-sm font-medium text-dark-text-secondary mb-1">Texto do Banner</label>
        <input
          type="text"
          id="banner"
          value={bannerText}
          onChange={(e) => setBannerText(e.target.value)}
          placeholder="Digite um texto para o banner"
          className="w-full bg-gray-900 border border-dark-border rounded-md px-3 py-2 text-dark-text focus:ring-brand-blue focus:border-brand-blue"
        />
      </div>
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-dark-text-secondary mb-1">Logo</label>
        <input
          type="file"
          id="logo"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/gif"
          onChange={handleLogoChange}
          className="w-full text-sm text-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-blue-light cursor-pointer"
        />
         <button onClick={handleClearLogo} className="mt-2 text-xs text-red-400 hover:text-red-500">
            Remover Logo
          </button>
      </div>
    </div>
  );
};