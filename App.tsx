import React, { useState, useEffect, useCallback } from 'react';
import type { AnimationState, StyleState, SavedAnimation } from './types';
import { DEFAULT_ANIMATION_STATE, DEFAULT_STYLE_STATE, PRESETS } from './constants';
import { generateCssFromState } from './utils/styleUtils';
import Header from './components/Header';
import Controls from './components/Controls';
import Preview from './components/Preview';
import CodeSnippet from './components/CodeSnippet';
import GeminiPanel from './components/GeminiPanel';
import { generateAnimation } from './services/geminiService';

const App: React.FC = () => {
  const [styles, setStyles] = useState<StyleState>(DEFAULT_STYLE_STATE);
  const [animation, setAnimation] = useState<AnimationState>(DEFAULT_ANIMATION_STATE);
  const [keyframes, setKeyframes] = useState<string>('@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}');
  const [generatedCss, setGeneratedCss] = useState({ css: '', keyframes: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAnimations, setSavedAnimations] = useState<SavedAnimation[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('css-animations');
      if (saved) {
        setSavedAnimations(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load animations from local storage", e);
    }
  }, []);

  useEffect(() => {
    const { css, keyframes: newKeyframes } = generateCssFromState(styles, animation, keyframes);
    setGeneratedCss({ css, keyframes: newKeyframes });
  }, [styles, animation, keyframes]);
  
  const handleGeminiGenerate = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateAnimation(prompt);
      if (result) {
        setStyles(result.styles);
        setAnimation(result.animation);
        setKeyframes(result.keyframes);
      } else {
        setError('The AI response was missing key animation data. Please try a different prompt.');
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setStyles(DEFAULT_STYLE_STATE);
    setAnimation(DEFAULT_ANIMATION_STATE);
    setKeyframes('@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}');
  }
  
  const applyState = (state: {styles: StyleState, animation: AnimationState, keyframes: string}) => {
    setStyles(state.styles);
    setAnimation(state.animation);
    setKeyframes(state.keyframes);
  }

  const handleApplyPreset = (name: string) => {
    const preset = PRESETS.find(p => p.name === name);
    if (preset) {
      applyState(preset.state);
    }
  }

  const handleSaveAnimation = (name: string) => {
    const newAnimation: SavedAnimation = {
      id: crypto.randomUUID(),
      name,
      styles,
      animation,
      keyframes,
    };
    const updatedAnimations = [...savedAnimations, newAnimation];
    setSavedAnimations(updatedAnimations);
    localStorage.setItem('css-animations', JSON.stringify(updatedAnimations));
  };

  const handleLoadAnimation = (id: string) => {
    const animationToLoad = savedAnimations.find(anim => anim.id === id);
    if (animationToLoad) {
      applyState(animationToLoad);
    }
  };
  
  const handleDeleteAnimation = (id: string) => {
    const updatedAnimations = savedAnimations.filter(anim => anim.id !== id);
    setSavedAnimations(updatedAnimations);
    localStorage.setItem('css-animations', JSON.stringify(updatedAnimations));
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <GeminiPanel onGenerate={handleGeminiGenerate} isLoading={isLoading} error={error} />
          <Controls 
            styles={styles} 
            setStyles={setStyles} 
            animation={animation} 
            setAnimation={setAnimation} 
            keyframes={keyframes}
            setKeyframes={setKeyframes}
            onReset={handleReset}
            savedAnimations={savedAnimations}
            onSave={handleSaveAnimation}
            onLoad={handleLoadAnimation}
            onDelete={handleDeleteAnimation}
            onApplyPreset={handleApplyPreset}
            />
        </div>
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 lg:gap-8">
          <div className="flex-grow min-h-[300px] lg:min-h-0">
            <Preview css={generatedCss.css} keyframes={generatedCss.keyframes} />
          </div>
          <div className="flex-shrink-0">
             <CodeSnippet css={generatedCss.css} keyframes={generatedCss.keyframes} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;