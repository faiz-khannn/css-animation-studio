
import React, { useState } from 'react';
import { SparklesIcon } from './icons/Icons';

interface GeminiPanelProps {
    onGenerate: (prompt: string) => void;
    isLoading: boolean;
    error: string | null;
}

const GeminiPanel: React.FC<GeminiPanelProps> = ({ onGenerate, isLoading, error }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onGenerate(prompt);
        }
    };
    
    return (
        <div className="bg-slate-800 rounded-lg p-4">
            <h2 className="text-lg font-bold text-slate-100 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-violet-400" />
                Generate with AI
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., a button that shakes violently"
                    rows={3}
                    className="w-full bg-slate-700 text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 border border-slate-600 focus:border-sky-500 outline-none transition-colors"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-violet-500"
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : 'Generate'}
                </button>
                {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            </form>
        </div>
    )
};

export default GeminiPanel;
