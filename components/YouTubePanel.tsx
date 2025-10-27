import React, { useState, useEffect } from 'react';
import { YouTubeSettings } from '../types';
import { CopyIcon } from './icons';

declare global {
  interface Window {
    gapi: any;
  }
}

interface YouTubePanelProps {
  settings: YouTubeSettings;
  setSettings: (settings: YouTubeSettings) => void;
}

const SCOPES = 'https://www.googleapis.com/auth/youtube.force-ssl';

export const YouTubePanel: React.FC<YouTubePanelProps> = ({ settings, setSettings }) => {
  const [clientId, setClientId] = useState('');
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamInfo, setStreamInfo] = useState<{ streamKey: string; serverUrl: string } | null>(null);

  useEffect(() => {
    window.gapi.load('client:auth2', () => {
      setIsApiReady(true);
    });
  }, []);

  const initClient = async () => {
    if (!clientId) {
      setError("Por favor, insira um ID de Cliente OAuth 2.0.");
      return;
    }
    setError(null);
    try {
      await window.gapi.client.init({
        clientId: clientId,
        scope: SCOPES,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      });
      const authInstance = window.gapi.auth2.getAuthInstance();
      setAuthenticated(authInstance.isSignedIn.get());
      authInstance.isSignedIn.listen(setAuthenticated);
    } catch (e: any) {
      console.error("Error initializing Google API client", e);
      setError(`Erro ao iniciar API: ${e.details || e.message}`);
    }
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      window.gapi.auth2.getAuthInstance().signOut();
    } else {
      window.gapi.auth2.getAuthInstance().signIn();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };
  
  const createLiveStream = async () => {
    if (!settings.title) {
        setError("O título é obrigatório para criar a transmissão.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setStreamInfo(null);
    try {
        const broadcastResponse = await window.gapi.client.youtube.liveBroadcasts.insert({
            part: ['snippet,contentDetails,status'],
            resource: {
                snippet: {
                    title: settings.title,
                    description: settings.description,
                    scheduledStartTime: new Date().toISOString(),
                },
                contentDetails: {
                    isReusable: true,
                },
                status: {
                    privacyStatus: settings.privacy,
                },
            },
        });
        
        const broadcastId = broadcastResponse.result.id;
        
        const streamResponse = await window.gapi.client.youtube.liveStreams.insert({
            part: ['snippet,cdn,status'],
            resource: {
                snippet: {
                    title: settings.title,
                },
                cdn: {
                    format: "1080p",
                    ingestionType: "rtmp",
                },
            },
        });

        const streamId = streamResponse.result.id;
        const streamKey = streamResponse.result.cdn.ingestionInfo.streamName;
        const serverUrl = streamResponse.result.cdn.ingestionInfo.ingestionAddress;
        
        await window.gapi.client.youtube.liveBroadcasts.bind({
            part: ['id,snippet,contentDetails,status'],
            id: broadcastId,
            streamId: streamId,
        });

        setStreamInfo({ streamKey, serverUrl });

    } catch(e: any) {
        console.error("Error creating live stream", e);
        setError(`Erro ao criar transmissão: ${e.result?.error?.message || e.message}`);
    } finally {
        setIsLoading(false);
    }
  }
  
  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
  }

  if (!isApiReady) {
    return <p className="text-dark-text-secondary text-center">Carregando API do Google...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-bold text-dark-text">Configurações do YouTube</h3>
      
      {!isAuthenticated ? (
        <div className="flex flex-col gap-4">
          <p className="text-dark-text-secondary text-sm">Para conectar, insira seu ID de Cliente OAuth 2.0 do Google Cloud.</p>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Seu_ID_de_Cliente.apps.googleusercontent.com"
            className="w-full bg-gray-900 border border-dark-border rounded-md px-3 py-2 text-dark-text focus:ring-brand-blue focus:border-brand-blue"
          />
          <button
            onClick={initClient}
            disabled={!clientId}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-800 disabled:cursor-not-allowed"
          >
            Configurar Cliente
          </button>
          <button
            onClick={handleAuthClick}
            disabled={!window.gapi.auth2?.getAuthInstance()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-red-900 disabled:cursor-not-allowed"
          >
            Conectar com YouTube
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-dark-text-secondary mb-1">Título</label>
                <input type="text" id="title" name="title" value={settings.title} onChange={handleInputChange} className="w-full bg-gray-900 border border-dark-border rounded-md px-3 py-2 text-dark-text" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-dark-text-secondary mb-1">Descrição</label>
                <textarea id="description" name="description" value={settings.description} onChange={handleInputChange} rows={3} className="w-full bg-gray-900 border border-dark-border rounded-md px-3 py-2 text-dark-text" />
            </div>
            <div>
                <label htmlFor="privacy" className="block text-sm font-medium text-dark-text-secondary mb-1">Privacidade</label>
                <select id="privacy" name="privacy" value={settings.privacy} onChange={handleInputChange} className="w-full bg-gray-900 border border-dark-border rounded-md px-3 py-2 text-dark-text">
                    <option value="public">Público</option>
                    <option value="unlisted">Não listado</option>
                    <option value="private">Privado</option>
                </select>
            </div>
            <button
                onClick={createLiveStream}
                disabled={isLoading}
                className="bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500"
            >
                {isLoading ? 'Criando...' : 'Criar Transmissão e Obter Chave'}
            </button>
            {streamInfo && (
                <div className="mt-4 p-3 bg-gray-900 rounded-lg space-y-2 border border-dark-border">
                    <h4 className="font-semibold text-dark-text">Informações da Transmissão:</h4>
                    <div className="text-sm">
                        <label className="font-bold text-dark-text-secondary">URL do Servidor (RTMP):</label>
                        <div className="flex items-center gap-2 mt-1">
                           <input type="text" readOnly value={streamInfo.serverUrl} className="w-full bg-dark-bg border border-dark-border rounded-md px-2 py-1 text-xs" />
                           <button onClick={() => copyToClipboard(streamInfo.serverUrl)}><CopyIcon className="w-5 h-5" /></button>
                        </div>
                    </div>
                     <div className="text-sm">
                        <label className="font-bold text-dark-text-secondary">Chave da Transmissão:</label>
                        <div className="flex items-center gap-2 mt-1">
                           <input type="password" readOnly value={streamInfo.streamKey} className="w-full bg-dark-bg border border-dark-border rounded-md px-2 py-1 text-xs" />
                           <button onClick={() => copyToClipboard(streamInfo.streamKey)}><CopyIcon className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={handleAuthClick} className="mt-2 text-sm text-red-400 hover:text-red-500">Desconectar</button>
        </div>
      )}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};
