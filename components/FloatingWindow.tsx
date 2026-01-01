
import React, { useState, useRef, useEffect } from 'react';
import { CameraStream } from './CameraStream';
import { BackgroundStyle, WindowPosition } from '../types';

interface Props {
  bgStyle: BackgroundStyle;
}

export const FloatingWindow: React.FC<Props> = ({ bgStyle }) => {
  const [position, setPosition] = useState<WindowPosition>({ x: 50, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<WindowPosition>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      setPosition({
        x: clientX - dragStartRef.current.x,
        y: clientY - dragStartRef.current.y
      });
    };

    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  const getBackgroundClass = () => {
    switch (bgStyle) {
      case 'blur': return 'bg-white/10 backdrop-blur-xl border border-white/20';
      case 'color': return 'bg-zinc-800 border border-zinc-700';
      case 'gradient': return 'bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20';
      default: return 'bg-white/10';
    }
  };

  return (
    <div 
      className={`absolute w-72 h-44 rounded-3xl overflow-hidden shadow-2xl cursor-move select-none flex flex-col transition-shadow ${getBackgroundClass()} ${isDragging ? 'shadow-3xl ring-2 ring-white/30' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <div className="h-8 flex items-center px-4 space-x-2 bg-black/20">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Camera Preview</span>
      </div>
      <div className="flex-1 p-2">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner ring-1 ring-white/10">
          <CameraStream />
        </div>
      </div>
    </div>
  );
};
