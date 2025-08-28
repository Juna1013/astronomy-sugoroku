'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => setTheme('light')} 
        className={`px-3 py-1 text-sm rounded-md ${
          theme === 'light' ? 'bg-white text-black' : 'bg-gray-700 text-white'
        }`}>
          Light
      </button>
      <button 
        onClick={() => setTheme('dark')} 
        className={`px-3 py-1 text-sm rounded-md ${
          theme === 'dark' ? 'bg-white text-black' : 'bg-gray-700 text-white'
        }`}>
          Dark
      </button>
      <button 
        onClick={() => setTheme('system')} 
        className={`px-3 py-1 text-sm rounded-md ${
          theme === 'system' ? 'bg-white text-black' : 'bg-gray-700 text-white'
        }`}>
          System
      </button>
    </div>
  );
}
