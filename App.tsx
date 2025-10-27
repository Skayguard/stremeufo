import React, { useState, useEffect, useRef } from 'react';
import { StreamPreview } from './components/StreamPreview';
import { SourcePanel } from './components/SourcePanel';
import { Controls } from './components/Controls';
import { LayoutSelector } from './components/LayoutSelector';
import { BrandingPanel } from './components/BrandingPanel';
import { ChatPanel } from './components/ChatPanel';
import { YouTubePanel } from './components/YouTubePanel';
import { AIAssistantPanel } from './components/AIAssistantPanel';
import { SourcesIcon, ChatIcon, BrandingIcon, YouTubeIcon, SparklesIcon } from './components/icons';
import { StreamSource, LayoutType, OverlayTemplate, ChatMessage, YouTubeSettings } from './types';

type Tab = 'sources' | 'chat' | 'branding' | 'youtube' | 'ai';

const App: React.FC = () => {
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [onStageSourceIds, setOnStageSourceIds] = useState<string[]>([]);
  
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [layout, setLayout] = useState<LayoutType>(LayoutType.Solo);

  const [bannerText, setBannerText] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('#1e40af');
  const [overlayTemplate, setOverlayTemplate] = useState<OverlayTemplate>(OverlayTemplate.Classic);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [highlightedMessage, setHighlightedMessage] = useState<ChatMessage | null>(null);

  const [youtubeSettings, setYoutubeSettings] = useState<YouTubeSettings>({
    title: '',
    description: '',
    privacy: 'public',
  });
  
  const [isLive, setIsLive] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('sources');

  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (logo) {
      const url = URL.createObjectURL(logo);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoUrl(null);
    }
  }, [logo]);

  useEffect(() => {
    const mockUsers = ['Alice', 'Bruno', 'Carla', 'Daniel', 'Elisa'];
    const mockComments = [
      'Que transmissão incrível!', 'Adorando o conteúdo! 🚀', 'Pode explicar isso de novo?', 
      'Qual a sua ferramenta favorita para isso?', 'Isso é muito útil, obrigado!', 'Ansioso pela próxima live!'
    ];
    const interval = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randomComment = mockComments[Math.floor(Math.random() * mockComments.length)];
      setMessages(prev => [{ id: Date.now().toString(), user: randomUser, text: randomComment }, ...prev].slice(0, 50));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const getCamera = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          cameraStreamRef.current = stream;
          if (isMicMuted) {
            stream.getAudioTracks().forEach(track => track.enabled = false);
          }
          const camSource: StreamSource = { id: 'camera', stream, name: 'Câmera', type: 'camera' };
          setSources(prev => [...prev.filter(s => s.id !== 'camera'), camSource]);
          if (onStageSourceIds.length === 0) {
              setOnStageSourceIds(['camera']);
          }
      } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      }
  };

  const stopCamera = () => {
      cameraStreamRef.current?.getTracks().forEach(track => track.stop());
      setSources(prev => prev.filter(s => s.id !== 'camera'));
      setOnStageSourceIds(prev => prev.filter(id => id !== 'camera'));
  }

  const toggleCam = async () => {
    if (isCamOff) {
      await getCamera();
    } else {
      stopCamera();
    }
    setIsCamOff(!isCamOff);
  };
  
  const toggleMic = () => {
      if(cameraStreamRef.current){
          cameraStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
          setIsMicMuted(prev => !prev);
      }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
        screenStreamRef.current?.getTracks().forEach(track => track.stop());
        setSources(prev => prev.filter(s => s.id !== 'screen'));
        setOnStageSourceIds(prev => prev.filter(id => id !== 'screen'));
        setIsScreenSharing(false);
    } else {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStreamRef.current = stream;
            const screenSource: StreamSource = { id: 'screen', stream, name: 'Tela', type: 'screen' };
            setSources(prev => [...prev, screenSource]);
            setIsScreenSharing(true);
        } catch (err) {
            console.error("Error sharing screen:", err);
        }
    }
  };
  
  useEffect(() => {
      getCamera();
      return () => {
          stopCamera();
          if(screenStreamRef.current) {
              screenStreamRef.current.getTracks().forEach(track => track.stop());
          }
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSourceOnStage = (id: string) => {
    setOnStageSourceIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(sourceId => sourceId !== id);
      }
      if (prev.length < 2) {
        return [...prev, id];
      }
      return [prev[1], id]; 
    });
  };

  const onStageSources = sources.filter(s => onStageSourceIds.includes(s.id));
  
  const TabButton: React.FC<{tab: Tab, label: string, icon: React.ReactNode}> = ({ tab, label, icon }) => (
      <button 
          onClick={() => setActiveTab(tab)}
          className={`flex-1 flex flex-col items-center justify-center p-2 text-xs transition-colors ${activeTab === tab ? 'bg-brand-blue text-white' : 'bg-dark-surface hover:bg-dark-border text-dark-text-secondary'}`}
      >
          {icon}
          <span>{label}</span>
      </button>
  );

  return (
    <div className="bg-dark-bg min-h-screen text-dark-text font-sans p-4 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">StreamStudio Pro</h1>
        <p className="text-center text-dark-text-secondary mt-2">Crie e gerencie sua transmissão ao vivo com facilidade.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <StreamPreview 
                onStageSources={onStageSources}
                layout={layout}
                bannerText={bannerText}
                logoUrl={logoUrl}
                isLive={isLive}
                themeColor={themeColor}
                overlayTemplate={overlayTemplate}
                highlightedMessage={highlightedMessage}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controls 
                    isMicMuted={isMicMuted}
                    isCamOff={isCamOff}
                    isScreenSharing={isScreenSharing}
                    toggleMic={toggleMic}
                    toggleCam={toggleCam}
                    toggleScreenShare={toggleScreenShare}
                />
                 <div className="bg-dark-surface p-4 rounded-lg flex items-center justify-center">
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`w-full py-3 text-lg font-bold rounded-lg transition-colors ${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-blue hover:bg-brand-blue-light'} text-white`}
                    >
                        {isLive ? 'Parar Transmissão' : 'Iniciar Transmissão'}
                    </button>
                </div>
            </div>
        </div>

        <aside className="lg:col-span-1 bg-dark-surface rounded-lg flex flex-col overflow-hidden">
            <div className="flex">
                <TabButton tab="sources" label="Fontes" icon={<SourcesIcon className="w-5 h-5 mb-1" />} />
                <TabButton tab="chat" label="Chat" icon={<ChatIcon className="w-5 h-5 mb-1" />} />
                <TabButton tab="branding" label="Marca" icon={<BrandingIcon className="w-5 h-5 mb-1" />} />
                <TabButton tab="youtube" label="YouTube" icon={<YouTubeIcon className="w-5 h-5 mb-1" />} />
                <TabButton tab="ai" label="IA" icon={<SparklesIcon className="w-5 h-5 mb-1" />} />
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'sources' && <SourcePanel sources={sources} onStageSourceIds={onStageSourceIds} toggleSourceOnStage={toggleSourceOnStage} />}
                {activeTab === 'chat' && <ChatPanel messages={messages} highlightedMessage={highlightedMessage} setHighlightedMessage={setHighlightedMessage} />}
                {activeTab === 'branding' && (
                  <div className="space-y-6">
                      <BrandingPanel bannerText={bannerText} setBannerText={setBannerText} setLogo={setLogo} themeColor={themeColor} setThemeColor={setThemeColor} overlayTemplate={overlayTemplate} setOverlayTemplate={setOverlayTemplate} />
                      <LayoutSelector currentLayout={layout} setLayout={setLayout} />
                  </div>
                )}
                {activeTab === 'youtube' && <YouTubePanel settings={youtubeSettings} setSettings={setYoutubeSettings} />}
                {activeTab === 'ai' && <AIAssistantPanel onGeneratedTitle={(title) => setYoutubeSettings(s => ({ ...s, title }))} onGeneratedDescription={(desc) => setYoutubeSettings(s => ({ ...s, description: desc }))} />}
            </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
