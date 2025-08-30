
import React from 'react';

interface ColorControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ColorControl: React.FC<ColorControlProps> = ({ label, value, onChange }) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">{label}</label>
            <div className="flex items-center gap-2">
                <input 
                    type="color" 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="p-1 h-10 w-10 block bg-slate-700 border border-slate-600 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-slate-700 text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 border border-slate-600 focus:border-sky-500 outline-none"
                />
            </div>
        </div>
    );
};

export default ColorControl;
