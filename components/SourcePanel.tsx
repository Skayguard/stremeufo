import React from 'react';
import { StreamSource } from '../types';
import { VideoSource } from './VideoSource';
import { PlusIcon, MinusIcon } from './icons';

interface SourcePanelProps {
  sources: StreamSource[];
  onStageSourceIds: string[];
  toggleSourceOnStage: (id: string) => void;
}

export const SourcePanel: React.FC<SourcePanelProps> = ({ sources, onStageSourceIds, toggleSourceOnStage }) => {
  return (
    <div className="bg-dark-surface p-4 rounded-lg h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-dark-text">Fontes</h3>
      {sources.length === 0 ? (
         <p className="text-sm text-dark-text-secondary">Sua câmera e compartilhamento de tela aparecerão aqui.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sources.map(source => {
            const isOnStage = onStageSourceIds.includes(source.id);
            return (
              <div key={source.id} className="space-y-2">
                <div className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${isOnStage ? 'ring-4 ring-brand-blue' : 'ring-2 ring-dark-border'}`}>
                  <VideoSource stream={source.stream} name={source.name} isMuted={true} />
                  <div 
                    onClick={() => toggleSourceOnStage(source.id)} 
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                  >
                    {isOnStage ? 
                      <MinusIcon className="w-10 h-10 text-white" /> : 
                      <PlusIcon className="w-10 h-10 text-white" />
                    }
                  </div>
                </div>
                <button 
                  onClick={() => toggleSourceOnStage(source.id)}
                  className={`w-full text-sm py-2 px-4 rounded-md transition-colors ${isOnStage ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-blue hover:bg-brand-blue-light'} text-white font-semibold`}
                >
                  {isOnStage ? 'Remover da Tela' : 'Adicionar à Tela'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};