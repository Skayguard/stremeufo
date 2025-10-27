import React, { useState } from 'react';
// Fix: Correctly import GoogleGenAI from the @google/genai package.
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon, SendIcon } from './icons';

interface AIAssistantPanelProps {
  onGeneratedTitle: (title: string) => void;
  onGeneratedDescription: (description: string) => void;
}

const ACTION_PROMPTS = {
  TITLE: 'Gere um título curto e chamativo para uma transmissão ao vivo sobre...',
  DESCRIPTION: 'Gere uma descrição para uma transmissão ao vivo no YouTube sobre...'
};

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ onGeneratedTitle, onGeneratedDescription }) => {
  const [topic, setTopic] = useState('');
  const [freeformQuery, setFreeformQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGemini = async (fullPrompt: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    setResponse('');
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key not available.");
      }
      // Fix: Initialize the GoogleGenAI client with a named apiKey parameter.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Fix: Use the `ai.models.generateContent` method to generate content.
      const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
      });

      // Fix: Extract the generated text directly from the `text` property of the response.
      const textResponse = result.text;
      setResponse(textResponse);
      return textResponse;
    } catch (e: any) {
      const errorMessage = e.message || "Ocorreu um erro ao chamar a IA.";
      setError(errorMessage);
      console.error(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: 'TITLE' | 'DESCRIPTION') => {
    if (!topic) {
        setError('Por favor, descreva o tema da sua transmissão primeiro.');
        return;
    }
    const fullPrompt = `${ACTION_PROMPTS[action]} "${topic}"`;
    const result = await callGemini(fullPrompt);
    if (result) {
        // Remove quotes if the model wraps the response in them
        const cleanedResult = result.replace(/^"|"$/g, '').trim();
        if(action === 'TITLE') onGeneratedTitle(cleanedResult);
        if(action === 'DESCRIPTION') onGeneratedDescription(cleanedResult);
    }
  }

  const handleFreeformSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!freeformQuery) return;
      callGemini(freeformQuery);
      setFreeformQuery('');
  }

  return (
    <div className="bg-dark-surface p-4 rounded-lg h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-dark-text flex items-center gap-2">
        <SparklesIcon className="w-5 h-5 text-brand-blue" />
        Assistente de IA
      </h3>
      
      <div className="flex flex-col gap-4 flex-grow">
          <p className="text-sm text-dark-text-secondary">Descreva o tema da sua transmissão e a IA pode ajudar.</p>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Uma aula sobre pão de fermentação natural."
            rows={3}
            className="w-full bg-gray-900 border border-dark-border rounded-md px-3 py-2 text-dark-text focus:ring-brand-blue focus:border-brand-blue"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <button onClick={() => handleAction('TITLE')} disabled={isLoading || !topic} className="flex-1 text-sm py-2 px-4 rounded-md bg-brand-blue hover:bg-brand-blue-light text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed">
                Gerar Título
            </button>
            <button onClick={() => handleAction('DESCRIPTION')} disabled={isLoading || !topic} className="flex-1 text-sm py-2 px-4 rounded-md bg-brand-blue hover:bg-brand-blue-light text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed">
                Gerar Descrição
            </button>
          </div>

          <div className="mt-4 border-t border-dark-border pt-4 flex-grow flex flex-col">
              <h4 className="text-md font-semibold text-dark-text mb-2">Resposta da IA</h4>
              <div className="bg-gray-900 p-3 rounded-md flex-grow overflow-y-auto min-h-[100px]">
                  {isLoading && <p className="text-dark-text-secondary animate-pulse">Gerando...</p>}
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  {response && <p className="text-dark-text whitespace-pre-wrap break-words">{response}</p>}
                  {!isLoading && !error && !response && <p className="text-dark-text-secondary text-sm">A resposta aparecerá aqui.</p>}
              </div>
          </div>

          <form onSubmit={handleFreeformSubmit} className="mt-auto flex items-center gap-2 pt-4 border-t border-dark-border">
             <input
                type="text"
                value={freeformQuery}
                onChange={(e) => setFreeformQuery(e.target.value)}
                placeholder="Faça uma pergunta..."
                className="flex-grow bg-gray-900 border border-dark-border rounded-md px-3 py-2 text-dark-text focus:ring-brand-blue focus:border-brand-blue"
                disabled={isLoading}
             />
             <button type="submit" disabled={isLoading || !freeformQuery} className="p-2 rounded-md bg-brand-blue hover:bg-brand-blue-light text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed">
                <SendIcon className="w-5 h-5" />
             </button>
          </form>
      </div>
    </div>
  );
};
