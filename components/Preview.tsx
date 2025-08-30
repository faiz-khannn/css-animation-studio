import React, { useState } from 'react';
import { PlayIcon, PauseIcon, RefreshIcon } from './icons/Icons';

interface PreviewProps {
  css: string;
  keyframes: string;
}

const Preview: React.FC<PreviewProps> = ({ css, keyframes }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [playState, setPlayState] = useState<'running' | 'paused'>('running');

  const handleReset = () => {
    setAnimationKey(prev => prev + 1);
    setPlayState('running');
  };

  const togglePlayState = () => {
    setPlayState(prev => (prev === 'running' ? 'paused' : 'running'));
  };

  return (
    <div className="h-full w-full bg-slate-800 rounded-lg p-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <button 
              onClick={togglePlayState} 
              className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/70 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label={playState === 'running' ? 'Pause animation' : 'Play animation'}
              >
                {playState === 'running' ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleReset} 
              className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/70 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Reset animation"
            >
                <RefreshIcon className="w-5 h-5" />
            </button>
        </div>
        <style>{keyframes}</style>
        <style>{`.animated-element { width: 100px; height: 100px; } ${css}`}</style>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div key={animationKey} className="animated-element z-10" style={{ animationPlayState: playState }}></div>
    </div>
  );
};

export default Preview;
