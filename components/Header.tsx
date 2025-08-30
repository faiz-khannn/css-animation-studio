
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 md:px-6 lg:px-8 bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-sky-400 to-violet-500 rounded-lg animate-pulse"></div>
            <h1 className="text-xl font-bold text-slate-100">CSS Animation Studio</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
