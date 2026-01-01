
import React, { useRef, useEffect, useState } from 'react';

export const CameraStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Camera Access Denied. Please enable permissions.");
      }
    }
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {error ? (
        <div className="text-white text-xs p-4 text-center">{error}</div>
      ) : (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover scale-x-[-1]"
        />
      )}
    </div>
  );
};
