import React, { useState, useCallback, useMemo } from 'react';
import { ClipboardIcon, CheckIcon } from './icons/Icons';

interface CodeSnippetProps {
  css: string;
  keyframes: string;
}

const highlightCss = (text: string) => {
    return text
        .replace(/([a-zA-Z-]+)(:)/g, '<span class="text-sky-400">$1</span>$2') // Properties
        .replace(/(\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, '<span class="text-emerald-400">$1</span>') // Selectors
        .replace(/(@[a-zA-Z-]+)/g, '<span class="text-violet-400">$1</span>') // At-rules
        .replace(/\b(from|to|infinite|linear|ease-in-out|ease|forwards|both|normal)\b/g, '<span class="text-amber-400">$1</span>') // Keywords
        .replace(/(#[a-fA-F0-9]{3,8}|rgb\([^)]*\)|hsl\([^)]*\))/g, '<span class="text-rose-400">$1</span>') // Colors
        .replace(/(-?\d*\.?\d+)(px|s|deg|%|em|rem)/g, '$1<span class="text-amber-400">$2</span>') // Units
        .replace(/({|}|;|,|\(|\))/g, '<span class="text-slate-500">$1</span>'); // Punctuation
};


const CodeSnippet: React.FC<CodeSnippetProps> = ({ css, keyframes }) => {
  const [copied, setCopied] = useState(false);

  const fullCss = useMemo(() => keyframes ? `${css}\n\n${keyframes}` : css, [css, keyframes]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullCss).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [fullCss]);

  const lines = useMemo(() => fullCss.split('\n'), [fullCss]);
  const highlightedCode = useMemo(() => highlightCss(fullCss), [fullCss]);

  return (
    <div className="bg-slate-800 rounded-lg relative">
        <div className="flex justify-between items-center p-3 border-b border-slate-700">
            <h3 className="font-semibold text-slate-300">Generated Code</h3>
            <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
            >
            {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
            </button>
      </div>
      <div className="p-4 text-sm overflow-x-auto flex font-mono">
        <div className="text-slate-600 pr-4 text-right select-none">
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre><code className="language-css text-slate-300" dangerouslySetInnerHTML={{ __html: highlightedCode }} /></pre>
      </div>
    </div>
  );
};

export default CodeSnippet;
