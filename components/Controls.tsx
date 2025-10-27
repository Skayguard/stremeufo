import React from 'react';
import { MicOnIcon, MicOffIcon, CamOnIcon, CamOffIcon, ScreenShareIcon } from './icons';

interface ControlsProps {
  isMicMuted: boolean;
  isCamOff: boolean;
  isScreenSharing: boolean;
  toggleMic: () => void;
  toggleCam: () => void;
  toggleScreenShare: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ isMicMuted, isCamOff, isScreenSharing, toggleMic, toggleCam, toggleScreenShare }) => {
  const baseButtonClass = "flex flex-col items-center justify-center p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-blue";
  const activeClass = "bg-gray-600 text-white";
  const inactiveClass = "bg-red-600 text-white";

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-dark-surface rounded-lg">
      <button onClick={toggleMic} className={`${baseButtonClass} ${isMicMuted ? inactiveClass : activeClass}`}>
        {isMicMuted ? <MicOffIcon className="w-6 h-6" /> : <MicOnIcon className="w-6 h-6" />}
        <span className="text-xs mt-1">{isMicMuted ? 'Ativar Som' : 'Mutar'}</span>
      </button>

      <button onClick={toggleCam} className={`${baseButtonClass} ${isCamOff ? inactiveClass : activeClass}`}>
        {isCamOff ? <CamOffIcon className="w-6 h-6" /> : <CamOnIcon className="w-6 h-6" />}
        <span className="text-xs mt-1">{isCamOff ? 'Ligar Câm' : 'Parar Câm'}</span>
      </button>

      <button onClick={toggleScreenShare} className={`${baseButtonClass} ${isScreenSharing ? inactiveClass : activeClass}`}>
        <ScreenShareIcon className="w-6 h-6" />
        <span className="text-xs mt-1">{isScreenSharing ? 'Parar Tela' : 'Compartilhar'}</span>
      </button>
    </div>
  );
};