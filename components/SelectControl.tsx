
import React from 'react';

interface SelectControlProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
}

const SelectControl = <T extends string,>({ label, value, onChange, options }: SelectControlProps<T>) => {
  return (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-400">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className="w-full bg-slate-700 text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 border border-slate-600 focus:border-sky-500 outline-none"
        >
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
  );
};

export default SelectControl;
