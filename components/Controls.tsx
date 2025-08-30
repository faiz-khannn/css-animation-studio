import React, { useState, useEffect } from 'react';
import type { AnimationState, StyleState, SavedAnimation, Preset, AnimationFullState } from '../types';
import { TIMING_FUNCTIONS, DIRECTIONS, FILL_MODES, PRESETS } from '../constants';
import ControlSection from './ControlSection';
import SliderControl from './SliderControl';
import SelectControl from './SelectControl';
import ColorControl from './ColorControl';
import { SaveIcon, TrashIcon } from './icons/Icons';

interface ControlsProps {
  styles: StyleState;
  setStyles: React.Dispatch<React.SetStateAction<StyleState>>;
  animation: AnimationState;
  setAnimation: React.Dispatch<React.SetStateAction<AnimationState>>;
  keyframes: string;
  setKeyframes: React.Dispatch<React.SetStateAction<string>>;
  onReset: () => void;
  savedAnimations: SavedAnimation[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onApplyPreset: (name: string) => void;
}

const Controls: React.FC<ControlsProps> = ({ styles, setStyles, animation, setAnimation, keyframes, setKeyframes, onReset, savedAnimations, onSave, onLoad, onDelete, onApplyPreset }) => {
    
    const [localKeyframes, setLocalKeyframes] = useState(keyframes);
    const [saveName, setSaveName] = useState("");
    const [selectedSavedAnim, setSelectedSavedAnim] = useState("");

    useEffect(() => {
        setLocalKeyframes(keyframes);
    }, [keyframes]);
    
    const handleStyleChange = <S extends keyof StyleState, K extends keyof StyleState[S]>(
        section: S, 
        key: K, 
        value: StyleState[S][K]
    ) => {
        setStyles(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };
    
    const handleAnimationChange = <K extends keyof AnimationState>(key: K, value: AnimationState[K]) => {
        setAnimation(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveAnimation = () => {
        if (saveName.trim()) {
            onSave(saveName.trim());
            setSaveName("");
        }
    }

    const handleLoadAnimation = (id: string) => {
        onLoad(id);
        setSelectedSavedAnim(id);
    }

    return (
        <div className="bg-slate-800 rounded-lg p-4 space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-100">Controls</h2>
                <button onClick={onReset} className="px-3 py-1.5 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">Reset</button>
            </div>
            
            <ControlSection title="Presets">
                <SelectControl label="Load a preset" value={''} onChange={v => onApplyPreset(v)} options={PRESETS.map(p => p.name)} />
            </ControlSection>

            <ControlSection title="My Library">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-400">Save Current Animation</label>
                    <div className="flex gap-2">
                        <input type="text" value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Animation name..." className="flex-grow w-full bg-slate-700 text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 border border-slate-600 focus:border-sky-500 outline-none" />
                        <button onClick={handleSaveAnimation} disabled={!saveName.trim()} className="p-2 rounded-md bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"><SaveIcon className="w-5 h-5"/></button>
                    </div>
                </div>
                 {savedAnimations.length > 0 && (
                    <div className="space-y-3">
                         <label className="block text-sm font-medium text-slate-400">Load Saved Animation</label>
                         <div className="flex gap-2">
                            <select value={selectedSavedAnim} onChange={e => handleLoadAnimation(e.target.value)} className="flex-grow w-full bg-slate-700 text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 border border-slate-600 focus:border-sky-500 outline-none">
                                <option value="">Select saved animation...</option>
                                {savedAnimations.map(anim => <option key={anim.id} value={anim.id}>{anim.name}</option>)}
                            </select>
                             <button onClick={() => onDelete(selectedSavedAnim)} disabled={!selectedSavedAnim} className="p-2 rounded-md bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                 )}
            </ControlSection>

            <ControlSection title="Transform">
                <SliderControl label="Translate X" value={styles.transform.translateX} onChange={v => handleStyleChange('transform', 'translateX', v)} min={-200} max={200} unit="px" />
                <SliderControl label="Translate Y" value={styles.transform.translateY} onChange={v => handleStyleChange('transform', 'translateY', v)} min={-200} max={200} unit="px" />
                <SliderControl label="Scale" value={styles.transform.scale} onChange={v => handleStyleChange('transform', 'scale', v)} min={0} max={2} step={0.01} />
                <SliderControl label="Rotate" value={styles.transform.rotate} onChange={v => handleStyleChange('transform', 'rotate', v)} min={-360} max={360} unit="deg" />
                <SliderControl label="Skew X" value={styles.transform.skewX} onChange={v => handleStyleChange('transform', 'skewX', v)} min={-90} max={90} unit="deg" />
                <SliderControl label="Skew Y" value={styles.transform.skewY} onChange={v => handleStyleChange('transform', 'skewY', v)} min={-90} max={90} unit="deg" />
            </ControlSection>

            <ControlSection title="Appearance">
                 <ColorControl label="Background" value={styles.other.backgroundColor} onChange={v => handleStyleChange('other', 'backgroundColor', v)} />
                 <SliderControl label="Border Radius" value={styles.other.borderRadius} onChange={v => handleStyleChange('other', 'borderRadius', v)} min={0} max={50} unit="px" />
                 <SliderControl label="Opacity" value={styles.other.opacity} onChange={v => handleStyleChange('other', 'opacity', v)} min={0} max={1} step={0.01} />
            </ControlSection>

            <ControlSection title="Filter">
                <SliderControl label="Blur" value={styles.filter.blur} onChange={v => handleStyleChange('filter', 'blur', v)} min={0} max={20} unit="px" />
                <SliderControl label="Brightness" value={styles.filter.brightness} onChange={v => handleStyleChange('filter', 'brightness', v)} min={0} max={2} step={0.01} />
                <SliderControl label="Contrast" value={styles.filter.contrast} onChange={v => handleStyleChange('filter', 'contrast', v)} min={0} max={2} step={0.01} />
                <SliderControl label="Grayscale" value={styles.filter.grayscale} onChange={v => handleStyleChange('filter', 'grayscale', v)} min={0} max={1} step={0.01} />
                <SliderControl label="Hue Rotate" value={styles.filter.hueRotate} onChange={v => handleStyleChange('filter', 'hueRotate', v)} min={0} max={360} unit="deg" />
                <SliderControl label="Saturate" value={styles.filter.saturate} onChange={v => handleStyleChange('filter', 'saturate', v)} min={0} max={2} step={0.01} />
                <SliderControl label="Sepia" value={styles.filter.sepia} onChange={v => handleStyleChange('filter', 'sepia', v)} min={0} max={1} step={0.01} />
            </ControlSection>

            <ControlSection title="Animation">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-400">Name</label>
                    <input type="text" value={animation.name} onChange={e => handleAnimationChange('name', e.target.value)} className="w-full bg-slate-700 text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 border border-slate-600 focus:border-sky-500 outline-none" />
                </div>
                <SliderControl label="Duration" value={animation.duration} onChange={v => handleAnimationChange('duration', v)} min={0} max={10} step={0.1} unit="s" />
                <SliderControl label="Delay" value={animation.delay} onChange={v => handleAnimationChange('delay', v)} min={0} max={10} step={0.1} unit="s" />
                <SelectControl label="Timing Function" value={animation.timingFunction} onChange={v => handleAnimationChange('timingFunction', v as AnimationState['timingFunction'])} options={TIMING_FUNCTIONS} />
                <SelectControl label="Direction" value={animation.direction} onChange={v => handleAnimationChange('direction', v as AnimationState['direction'])} options={DIRECTIONS} />
                <SelectControl label="Fill Mode" value={animation.fillMode} onChange={v => handleAnimationChange('fillMode', v as AnimationState['fillMode'])} options={FILL_MODES} />
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-400">Iteration Count</label>
                    <input type="text" value={animation.iterationCount} onChange={e => handleAnimationChange('iterationCount', e.target.value)} className="w-full bg-slate-700 text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 border border-slate-600 focus:border-sky-500 outline-none" placeholder="e.g., infinite or 3"/>
                </div>
            </ControlSection>

            <ControlSection title="Keyframes Editor">
                 <textarea
                    value={localKeyframes}
                    onChange={(e) => setLocalKeyframes(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-900 font-mono text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 border border-slate-600 focus:border-sky-500 outline-none transition-colors"
                    placeholder="@keyframes ..."
                />
                <button onClick={() => setKeyframes(localKeyframes)} className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Update Keyframes</button>
            </ControlSection>

        </div>
    );
};

export default Controls;
