'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 11-2 0V3h-2zm-7 9a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zM9 17a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-4-2a1 1 0 110-2 1 1 0 010 2zm0-7a1 1 0 110-2 1 1 0 010 2zm14 7a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
