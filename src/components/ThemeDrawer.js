'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeColors, themeClass, THEME_MODES, BACKGROUND_OPTIONS, isBackgroundSwitchDisabled } from '../utils/theme';

export default function ThemeDrawer({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  themeMode,
  onThemeModeChange,
  currentBackground,
  onBackgroundChange,
  isDarkMode
}) {
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
    }
  }, [isOpen, onClose]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] transition-all duration-300"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="fixed right-0 top-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-[120] border-l border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Theme Settings
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Content */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 p-6 space-y-8 overflow-y-auto"
              >
                {/* Appearance Mode Section */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Appearance Mode
                  </h3>
                  <div className="relative grid grid-cols-1 gap-3">
                    {/* Light Mode Button */}
                    <motion.button
                      variants={buttonHoverVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => onThemeModeChange(THEME_MODES.LIGHT)}
                      className="group relative flex items-center p-4 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:shadow-md transition-all duration-300 backdrop-blur-sm overflow-hidden"
                    >
                      {themeMode === THEME_MODES.LIGHT && (
                        <motion.div
                          layoutId="appearanceMode"
                          className={`absolute inset-0 border-${currentTheme}-500/80 ${themeClass('bgSelected', currentTheme)} shadow-lg shadow-${currentTheme}-500/20 rounded-xl border-2`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-white to-gray-100 border border-gray-300/50 mr-4 relative overflow-hidden shadow-inner z-10">
                        <div className="absolute inset-1 bg-gray-50 rounded-md"></div>
                        <div className="absolute top-1 left-1 w-2 h-1 bg-yellow-400 rounded-full shadow-sm"></div>
                        <div className="absolute top-3 left-1 right-1 h-0.5 bg-gray-300 rounded-full"></div>
                        <div className="absolute top-4 left-1 right-1 h-0.5 bg-gray-300 rounded-full"></div>
                      </div>
                      <div className="flex-1 text-left z-10">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          Light
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          Always use light theme
                        </p>
                      </div>
                      {themeMode === THEME_MODES.LIGHT && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-4 h-4 ${themeClass('text', currentTheme)} ml-2 z-10`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </motion.button>

                    {/* Dark Mode Button */}
                    <motion.button
                      variants={buttonHoverVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => onThemeModeChange(THEME_MODES.DARK)}
                      className="group relative flex items-center p-4 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:shadow-md transition-all duration-300 backdrop-blur-sm overflow-hidden"
                    >
                      {themeMode === THEME_MODES.DARK && (
                        <motion.div
                          layoutId="appearanceMode"
                          className={`absolute inset-0 border-${currentTheme}-500/80 ${themeClass('bgSelected', currentTheme)} shadow-lg shadow-${currentTheme}-500/20 rounded-xl border-2`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 mr-4 relative overflow-hidden shadow-inner z-10">
                        <div className="absolute inset-1 bg-gray-800 rounded-md"></div>
                        <div className="absolute top-1 left-1 w-2 h-1 bg-blue-400 rounded-full shadow-sm"></div>
                        <div className="absolute top-3 left-1 right-1 h-0.5 bg-gray-600 rounded-full"></div>
                        <div className="absolute top-4 left-1 right-1 h-0.5 bg-gray-600 rounded-full"></div>
                      </div>
                      <div className="flex-1 text-left z-10">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          Dark
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          Always use dark theme
                        </p>
                      </div>
                      {themeMode === THEME_MODES.DARK && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-4 h-4 ${themeClass('text', currentTheme)} ml-2 z-10`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </motion.button>

                    {/* System Mode Button */}
                    <motion.button
                      variants={buttonHoverVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => onThemeModeChange(THEME_MODES.SYSTEM)}
                      className="group relative flex items-center p-4 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:shadow-md transition-all duration-300 backdrop-blur-sm overflow-hidden"
                    >
                      {themeMode === THEME_MODES.SYSTEM && (
                        <motion.div
                          layoutId="appearanceMode"
                          className={`absolute inset-0 border-${currentTheme}-500/80 ${themeClass('bgSelected', currentTheme)} shadow-lg shadow-${currentTheme}-500/20 rounded-xl border-2`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <div className="w-12 h-8 rounded-lg mr-4 relative overflow-hidden shadow-inner border border-gray-300/50 dark:border-gray-700/50 z-10">
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-white to-gray-100 border-r border-gray-300/50">
                            <div className="absolute inset-1 bg-gray-50 rounded-l-md"></div>
                            <div className="absolute top-1 left-1 w-1 h-0.5 bg-yellow-400 rounded-full"></div>
                            <div className="absolute top-2.5 left-1 w-2 h-0.5 bg-gray-300 rounded-full"></div>
                          </div>
                          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-br from-gray-900 to-gray-800 border-l border-gray-700/50">
                            <div className="absolute inset-1 bg-gray-800 rounded-r-md"></div>
                            <div className="absolute top-1 right-1 w-1 h-0.5 bg-blue-400 rounded-full"></div>
                            <div className="absolute top-2.5 right-1 w-2 h-0.5 bg-gray-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 text-left z-10">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          System
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          Follow device theme
                        </p>
                      </div>
                      {themeMode === THEME_MODES.SYSTEM && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-4 h-4 ${themeClass('text', currentTheme)} ml-2 z-10`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Color Theme Section */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-conic from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 border-2 border-white dark:border-gray-800 shadow-sm"></div>
                    Color Theme
                  </h3>
                  <div className="relative grid grid-cols-2 gap-3">
                    {Object.keys(themeColors).map((color, index) => {
                      const colorClasses = {
                        blue: 'bg-blue-500',
                        red: 'bg-red-500',
                        purple: 'bg-purple-500',
                        emerald: 'bg-emerald-500',
                        orange: 'bg-orange-500',
                        pink: 'bg-pink-500',
                        lightgray: 'bg-gray-400'
                      };
                      // Disable all colors except lightgray when ColorBends is selected
                      const isDisabled = currentBackground === 'colorbends' && color !== 'lightgray';

                      return (
                        <motion.button
                          key={color}
                          variants={buttonHoverVariants}
                          whileHover={!isDisabled ? "hover" : {}}
                          whileTap={!isDisabled ? "tap" : {}}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => !isDisabled && onThemeChange(color)}
                          disabled={isDisabled}
                          className={`group relative flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 backdrop-blur-sm overflow-hidden ${isDisabled
                            ? 'opacity-50 cursor-not-allowed border-gray-200/30 dark:border-gray-700/30'
                            : 'hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:shadow-md'
                            }`}
                        >
                          {color === currentTheme && !isDisabled && (
                            <motion.div
                              layoutId="colorTheme"
                              className={`absolute inset-0 border-${color}-500/80 ${themeClass('bgSelected', color)} shadow-lg shadow-${color}-500/20 rounded-xl border-2`}
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                          <motion.div
                            className={`w-6 h-6 rounded-full ${colorClasses[color]} shadow-lg border-2 border-white dark:border-gray-800 z-10`}
                            whileHover={!isDisabled ? { scale: 1.2, rotate: 360 } : {}}
                            transition={{ duration: 0.3 }}
                          />
                          <span className={`text-sm font-semibold capitalize transition-colors z-10 ${isDisabled
                            ? 'text-gray-400 dark:text-gray-600'
                            : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                            }`}>
                            {color}
                          </span>
                          {color === currentTheme && (
                            <motion.svg
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className={`w-4 h-4 ${themeClass('text', color)} ml-auto z-10`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Background Section */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Background
                    </h3>
                    {isBackgroundSwitchDisabled() && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/50"
                      >
                        Special Day
                      </motion.span>
                    )}
                  </div>
                  <div className="relative grid grid-cols-1 gap-3">
                    {Object.entries(BACKGROUND_OPTIONS).map(([key, value], index) => {
                      const backgroundNames = {
                        beams: 'Beams',
                        silk: 'Silk',
                        gridscan: 'GridScan',
                        colorbends: 'ColorBends'
                      };

                      const backgroundDescriptions = {
                        beams: 'Animated light beams',
                        silk: 'Flowing silk patterns',
                        gridscan: 'Futuristic grid scanner',
                        colorbends: 'Colorful bending waves'
                      };

                      const isSpecialBackground = value === 'colorbends';

                      const isDisabled = isBackgroundSwitchDisabled();

                      return (
                        <motion.button
                          key={value}
                          variants={buttonHoverVariants}
                          whileHover={!isDisabled ? "hover" : {}}
                          whileTap={!isDisabled ? "tap" : {}}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => !isDisabled && onBackgroundChange(value)}
                          disabled={isDisabled}
                          className={`group relative flex items-center p-4 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 backdrop-blur-sm overflow-hidden ${isDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:shadow-md'
                            }`}
                        >
                          {value === currentBackground && !isDisabled && (
                            <motion.div
                              layoutId="backgroundOption"
                              className={`absolute inset-0 border-${currentTheme}-500/80 ${themeClass('bgSelected', currentTheme)} shadow-lg shadow-${currentTheme}-500/20 rounded-xl border-2`}
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                          {/* Background Icon - Static Preview */}
                          <motion.div
                            className="w-20 h-14 rounded-lg mr-4 relative overflow-hidden border border-gray-300/50 dark:border-gray-600/50 shadow-inner z-10"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {value === 'beams' && (
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                                {/* Static beams representation */}
                                <div className="absolute inset-0 flex items-center justify-center gap-1">
                                  <div className="w-0.5 h-8 bg-blue-400/40 rounded-full transform -rotate-12"></div>
                                  <div className="w-0.5 h-10 bg-blue-300/50 rounded-full"></div>
                                  <div className="w-0.5 h-8 bg-blue-400/40 rounded-full transform rotate-12"></div>
                                  <div className="w-0.5 h-6 bg-blue-200/30 rounded-full transform rotate-20"></div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent"></div>
                              </div>
                            )}

                            {value === 'silk' && (
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
                                {/* Flowing silk curves */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 56" preserveAspectRatio="none">
                                  <path
                                    d="M0,28 Q20,14 40,28 T80,28"
                                    fill="none"
                                    stroke="rgba(147, 51, 234, 0.4)"
                                    strokeWidth="2"
                                  />
                                  <path
                                    d="M0,35 Q20,45 40,35 T80,35"
                                    fill="none"
                                    stroke="rgba(59, 130, 246, 0.3)"
                                    strokeWidth="2"
                                  />
                                  <path
                                    d="M0,20 Q20,10 40,20 T80,20"
                                    fill="none"
                                    stroke="rgba(147, 51, 234, 0.3)"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-blue-500/10 to-transparent"></div>
                              </div>
                            )}

                            {value === 'gridscan' && (
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black">
                                {/* Grid lines */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 50" preserveAspectRatio="none">
                                  {/* Horizontal lines */}
                                  <line x1="0" y1="10" x2="80" y2="10" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.5" />
                                  <line x1="0" y1="20" x2="80" y2="20" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.5" />
                                  <line x1="0" y1="30" x2="80" y2="30" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="0.5" />
                                  <line x1="0" y1="40" x2="80" y2="40" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.5" />

                                  {/* Vertical lines */}
                                  <line x1="20" y1="0" x2="20" y2="50" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.5" />
                                  <line x1="40" y1="0" x2="40" y2="50" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="0.5" />
                                  <line x1="60" y1="0" x2="60" y2="50" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.5" />

                                  {/* Scan line */}
                                  <line x1="0" y1="25" x2="80" y2="25" stroke="rgba(236, 72, 153, 0.6)" strokeWidth="1.5">
                                    <animate attributeName="y1" values="10;40;10" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="y2" values="10;40;10" dur="2s" repeatCount="indefinite" />
                                  </line>
                                </svg>
                                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 via-transparent to-transparent"></div>
                              </div>
                            )}
                            {value === 'colorbends' && (
                              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500">
                                {/* Colorful wave patterns */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 50" preserveAspectRatio="none">
                                  <path d="M0,25 Q20,15 40,25 T80,25" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none">
                                    <animate attributeName="d" values="M0,25 Q20,15 40,25 T80,25;M0,25 Q20,35 40,25 T80,25;M0,25 Q20,15 40,25 T80,25" dur="3s" repeatCount="indefinite" />
                                  </path>
                                  <path d="M0,30 Q20,20 40,30 T80,30" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none">
                                    <animate attributeName="d" values="M0,30 Q20,20 40,30 T80,30;M0,30 Q20,40 40,30 T80,30;M0,30 Q20,20 40,30 T80,30" dur="2.5s" repeatCount="indefinite" />
                                  </path>
                                  <path d="M0,20 Q20,10 40,20 T80,20" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none">
                                    <animate attributeName="d" values="M0,20 Q20,10 40,20 T80,20;M0,20 Q20,30 40,20 T80,20;M0,20 Q20,10 40,20 T80,20" dur="4s" repeatCount="indefinite" />
                                  </path>
                                </svg>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                              </div>
                            )}
                          </motion.div>                          <div className="flex-1 text-left z-10">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                {backgroundNames[value]}
                              </span>
                              {isSpecialBackground && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/50"
                                >
                                  Special
                                </motion.span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                              {backgroundDescriptions[value]}
                            </p>
                          </div>

                          {value === currentBackground && !isDisabled && (
                            <motion.svg
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className={`w-4 h-4 ${themeClass('text', currentTheme)} ml-2 z-10`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  {isBackgroundSwitchDisabled() && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-gray-500 dark:text-gray-400 text-center"
                    >
                      Background switching is disabled on special days
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Changes are automatically saved
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}