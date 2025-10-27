import React from 'react';
import { StreamSource, LayoutType, OverlayTemplate, ChatMessage } from '../types';
import { VideoSource } from './VideoSource';

interface StreamPreviewProps {
  onStageSources: StreamSource[];
  layout: LayoutType;
  bannerText: string;
  logoUrl: string | null;
  isLive: boolean;
  themeColor: string;
  overlayTemplate: OverlayTemplate;
  highlightedMessage: ChatMessage | null;
}

export const StreamPreview: React.FC<StreamPreviewProps> = ({ 
  onStageSources, 
  layout, 
  bannerText, 
  logoUrl, 
  isLive,
  themeColor,
  overlayTemplate,
  highlightedMessage
}) => {
  const renderLayout = () => {
    const sources = onStageSources.slice(0, 2);
    if (sources.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <p className="text-dark-text-secondary">Adicione uma fonte à transmissão</p>
        </div>
      );
    }

    switch (layout) {
      case LayoutType.PictureInPicture:
        if (sources.length > 1) {
          return (
            <div className="relative w-full h-full">
              <VideoSource stream={sources[0].stream} name={sources[0].name} />
              <div className="absolute bottom-4 right-4 w-1/4 md:w-1/5 border-2 border-dark-border rounded-lg overflow-hidden z-10">
                <VideoSource stream={sources[1].stream} name={sources[1].name} />
              </div>
            </div>
          );
        }
        return <VideoSource stream={sources[0].stream} name={sources[0].name} />;
      
      case LayoutType.Split:
        if (sources.length > 1) {
          return (
            <div className="flex w-full h-full gap-2">
              <div className="w-1/2 h-full"><VideoSource stream={sources[0].stream} name={sources[0].name} /></div>
              <div className="w-1/2 h-full"><VideoSource stream={sources[1].stream} name={sources[1].name} /></div>
            </div>
          );
        }
        return <VideoSource stream={sources[0].stream} name={sources[0].name} />;
        
      case LayoutType.Solo:
      default:
        return <VideoSource stream={sources[0].stream} name={sources[0].name} />;
    }
  };

  return (
    <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${isLive ? 'ring-4 ring-red-500' : 'ring-2 ring-dark-border'}`}>
      {renderLayout()}
      
      {isLive && (
        <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-md z-20">
          AO VIVO
        </div>
      )}

      {logoUrl && overlayTemplate === OverlayTemplate.Classic && (
        <div className="absolute top-4 right-4 w-16 h-16 md:w-24 md:h-24 z-20">
          <img src={logoUrl} alt="Logo" className="object-contain w-full h-full" />
        </div>
      )}

      {bannerText && overlayTemplate === OverlayTemplate.Classic && (
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 text-white text-center p-3 rounded-lg z-20 shadow-lg"
          style={{ backgroundColor: themeColor }}
        >
          <p className="font-semibold text-sm md:text-xl">{bannerText}</p>
        </div>
      )}

      {bannerText && overlayTemplate === OverlayTemplate.Ticker && (
         <div 
            className="absolute bottom-0 left-0 w-full text-white text-center p-3 z-20 shadow-lg overflow-hidden"
            style={{ backgroundColor: themeColor }}
        >
          <p className="ticker-move font-semibold text-sm md:text-xl whitespace-nowrap">{bannerText}</p>
        </div>
      )}

      {highlightedMessage && (
        <div
          className="absolute bottom-24 left-4 max-w-md bg-dark-bg bg-opacity-80 backdrop-blur-sm p-3 rounded-lg z-30 border-l-4"
          style={{ borderColor: themeColor }}
        >
          <p className="font-bold text-sm" style={{ color: themeColor }}>{highlightedMessage.user}</p>
          <p className="text-white text-base">{highlightedMessage.text}</p>
        </div>
      )}
    </div>
  );
};