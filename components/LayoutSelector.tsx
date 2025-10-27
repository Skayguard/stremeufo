import React from 'react';
import { LayoutType } from '../types';

interface LayoutSelectorProps {
  currentLayout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

const layouts = [
  { id: LayoutType.Solo, name: 'Solo' },
  { id: LayoutType.Split, name: 'Dividido' },
  { id: LayoutType.PictureInPicture, name: 'PiP' },
];

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({ currentLayout, setLayout }) => {
  return (
    <div className="bg-dark-surface p-4 rounded-lg h-full">
        <h3 className="text-lg font-bold mb-4 text-dark-text">Layout</h3>
        <div className="flex gap-2">
        {layouts.map(layout => (
            <button
            key={layout.id}
            onClick={() => setLayout(layout.id)}
            className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${
                currentLayout === layout.id
                ? 'bg-brand-blue text-white'
                : 'bg-gray-600 hover:bg-gray-500 text-dark-text'
            }`}
            >
            {layout.name}
            </button>
        ))}
        </div>
    </div>
  );
};