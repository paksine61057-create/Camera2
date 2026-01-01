
import React, { useState } from 'react';
import { SWIFT_PROJECT } from '../constants/swiftCode';

export const CodeEditor: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SWIFT_PROJECT[activeIndex].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10">
      <div className="flex bg-[#252526] border-b border-white/5">
        {SWIFT_PROJECT.map((file, idx) => (
          <button
            key={file.name}
            onClick={() => setActiveIndex(idx)}
            className={`px-4 py-3 text-xs font-medium transition-colors border-r border-white/5 ${
              activeIndex === idx 
                ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {file.name}
          </button>
        ))}
      </div>
      <div className="relative flex-1 overflow-auto p-6 hide-scrollbar">
        <button 
          onClick={handleCopy}
          className="absolute top-4 right-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow-lg transition-all"
        >
          {copied ? 'COPIED!' : 'COPY CODE'}
        </button>
        <pre className="code-font text-sm leading-relaxed text-zinc-300 whitespace-pre">
          {SWIFT_PROJECT[activeIndex].content}
        </pre>
      </div>
    </div>
  );
};
