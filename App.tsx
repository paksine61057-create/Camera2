
import React, { useState } from 'react';
import { FloatingWindow } from './components/FloatingWindow';
import { CodeEditor } from './components/CodeEditor';
import { BackgroundStyle } from './types';

const App: React.FC = () => {
  const [bgStyle, setBgStyle] = useState<BackgroundStyle>('blur');
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 lg:p-10 flex flex-col lg:flex-row gap-8">
      {/* Left Panel: The iPad Simulator */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">iPadOS Floating Preview</h1>
            <p className="text-zinc-400 mt-1">Simulated SwiftUI Environment</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {(['blur', 'color', 'gradient'] as BackgroundStyle[]).map(style => (
              <button
                key={style}
                onClick={() => setBgStyle(style)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  bgStyle === style ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {style.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="ipad-screen flex-1 bg-cover bg-center shadow-2xl relative" style={{ backgroundImage: 'url(https://picsum.photos/id/403/1200/800)' }}>
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-10 px-10 flex items-center justify-between text-white text-[10px] font-bold">
            <span>9:41 AM</span>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.34V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
            </div>
          </div>

          {/* Desktop Icons Placeholder */}
          <div className="p-16 grid grid-cols-4 lg:grid-cols-6 gap-12 opacity-80 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md" />
                <div className="w-12 h-2 bg-white/20 rounded-full" />
              </div>
            ))}
          </div>

          {/* THE MAIN FEATURE: Floating Window */}
          <FloatingWindow bgStyle={bgStyle} />

          {/* iPad Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/40 rounded-full" />
        </div>
      </div>

      {/* Right Panel: The Source Code */}
      <div className="w-full lg:w-[500px] xl:w-[600px] flex flex-col h-[80vh] lg:h-auto">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Source Files</h2>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">Swift 5.10 / SwiftUI</span>
        </div>
        <CodeEditor />
        
        <div className="mt-6 p-6 glass rounded-2xl">
          <h3 className="text-white font-bold mb-2">Technical Implementation</h3>
          <ul className="text-sm text-zinc-400 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              Uses <strong>AVFoundation</strong> for high-performance low-latency camera capture.
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              Implemented <strong>UIViewRepresentable</strong> to bridge UIKit's VideoPreviewLayer into SwiftUI.
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <strong>DragGesture</strong> allows fluid dragging with state tracking for smooth repositioning.
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              Optimized for <strong>iPad multitasking</strong> environment.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
