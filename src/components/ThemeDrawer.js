'use client';

import { useEffect } from 'react';
import { themeColors, themeClass } from '../utils/theme';

export default function ThemeDrawer({ isOpen, onClose, currentTheme, onThemeChange, isDarkMode, onDarkModeChange }) {
  // Close drawer when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }  }, [isOpen, onClose]);

  return (
    <>      {/* Backdrop - only show when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[120] transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Theme Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-8">
            {/* Dark Mode Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Appearance Mode
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Light Mode Button */}                <button
                  onClick={() => onDarkModeChange(false)}                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    !isDarkMode 
                      ? `border-${currentTheme}-500 ${themeClass('bgSelected', currentTheme)}`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="w-12 h-8 rounded-md bg-white border border-gray-300 mb-2 relative overflow-hidden">
                    <div className="absolute inset-1 bg-gray-100 rounded-sm"></div>
                    <div className="absolute top-1 left-1 w-2 h-1 bg-gray-300 rounded-sm"></div>
                    <div className="absolute top-3 left-1 right-1 h-0.5 bg-gray-300 rounded-sm"></div>
                    <div className="absolute top-4 left-1 right-1 h-0.5 bg-gray-300 rounded-sm"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Light
                  </span>
                  {!isDarkMode && (
                    <svg className={`w-4 h-4 ${themeClass('text', currentTheme)} mt-1`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Dark Mode Button */}                <button
                  onClick={() => onDarkModeChange(true)}                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    isDarkMode 
                      ? `border-${currentTheme}-500 ${themeClass('bgSelected', currentTheme)}`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="w-12 h-8 rounded-md bg-gray-800 border border-gray-600 mb-2 relative overflow-hidden">
                    <div className="absolute inset-1 bg-gray-700 rounded-sm"></div>
                    <div className="absolute top-1 left-1 w-2 h-1 bg-gray-500 rounded-sm"></div>
                    <div className="absolute top-3 left-1 right-1 h-0.5 bg-gray-500 rounded-sm"></div>
                    <div className="absolute top-4 left-1 right-1 h-0.5 bg-gray-500 rounded-sm"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark
                  </span>
                  {isDarkMode && (
                    <svg className={`w-4 h-4 ${themeClass('text', currentTheme)} mt-1`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Color Theme Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Color Theme
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(themeColors).map((color) => (
                  <button
                    key={color}
                    onClick={() => onThemeChange(color)}                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                      color === currentTheme 
                        ? `border-${color}-500 ${themeClass('bgSelected', color)}`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-${color}-600 dark:bg-${color}-500`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {color}
                    </span>
                    {color === currentTheme && (
                      <svg className={`w-4 h-4 ${themeClass('text', color)} ml-auto`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Changes are automatically saved
            </p>
          </div>
        </div>
      </div>
    </>
  );
}