
import React, { useRef, useEffect } from 'react';

interface VideoSourceProps {
  stream: MediaStream;
  name: string;
  isMuted?: boolean;
}

export const VideoSource: React.FC<VideoSourceProps> = ({ stream, name, isMuted = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video w-full">
      <video ref={videoRef} autoPlay playsInline muted={isMuted} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
        {name}
      </div>
    </div>
  );
};
