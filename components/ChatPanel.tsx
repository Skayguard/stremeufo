import React from 'react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  highlightedMessage: ChatMessage | null;
  setHighlightedMessage: (message: ChatMessage | null) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, highlightedMessage, setHighlightedMessage }) => {
  return (
    <div className="bg-dark-surface p-4 rounded-lg h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-dark-text">Chat ao Vivo</h3>
      <div className="flex-grow overflow-y-auto mb-2 space-y-3 pr-2">
        {messages.length === 0 && (
          <p className="text-dark-text-secondary text-center h-full flex items-center justify-center">
            As mensagens do chat aparecerão aqui.
          </p>
        )}
        {[...messages].reverse().map(msg => (
          <div key={msg.id} className="text-sm p-3 rounded-md bg-gray-900 border border-dark-border">
            <p className="font-bold text-brand-blue-light">{msg.user}</p>
            <p className="text-dark-text whitespace-pre-wrap break-words">{msg.text}</p>
            <button 
              onClick={() => setHighlightedMessage(highlightedMessage?.id === msg.id ? null : msg)}
              className={`mt-2 w-full text-xs py-1.5 px-2 rounded-md transition-colors ${
                highlightedMessage?.id === msg.id ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-blue hover:bg-brand-blue-light'
              } text-white font-semibold`}
            >
              {highlightedMessage?.id === msg.id ? 'Ocultar da Tela' : 'Mostrar na Tela'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};