/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Theme colors for borders
    'border-blue-500', 'border-red-500', 'border-purple-500', 'border-emerald-500', 'border-orange-500', 'border-pink-500', 'border-lightgray-500',
    'dark:border-blue-400', 'dark:border-red-400', 'dark:border-purple-400', 'dark:border-emerald-400', 'dark:border-orange-400', 'dark:border-pink-400', 'dark:border-lightgray-400',
    // Theme colors for backgrounds (selected state)
    'bg-blue-50', 'bg-red-50', 'bg-purple-50', 'bg-emerald-50', 'bg-orange-50', 'bg-pink-50', 'bg-lightgray-50',
    // Dark mode backgrounds (selected state)
    'dark:bg-blue-900/20', 'dark:bg-red-900/20', 'dark:bg-purple-900/20', 'dark:bg-emerald-900/20', 'dark:bg-orange-900/20', 'dark:bg-pink-900/20', 'dark:bg-lightgray-900/20',
    // Text colors 
    'text-blue-500', 'text-red-500', 'text-purple-500', 'text-emerald-500', 'text-orange-500', 'text-pink-500', 'text-lightgray-600',
    'text-blue-600', 'text-red-600', 'text-purple-600', 'text-emerald-600', 'text-orange-600', 'text-pink-600',
    'dark:text-blue-400', 'dark:text-red-400', 'dark:text-purple-400', 'dark:text-emerald-400', 'dark:text-orange-400', 'dark:text-pink-400', 'dark:text-lightgray-400',
    // Main background colors
    'bg-blue-600', 'bg-red-600', 'bg-purple-600', 'bg-emerald-600', 'bg-orange-600', 'bg-pink-600', 'bg-lightgray-600',
    // Light background colors for opacity effects
    'bg-blue-100', 'bg-red-100', 'bg-purple-100', 'bg-emerald-100', 'bg-orange-100', 'bg-pink-100', 'bg-lightgray-100',
    'hover:bg-blue-200', 'hover:bg-red-200', 'hover:bg-purple-200', 'hover:bg-emerald-200', 'hover:bg-orange-200', 'hover:bg-pink-200', 'hover:bg-lightgray-200',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        lightgray: {
          50: '#f8f9f9',
          100: '#f0f1f1',
          200: '#e1e3e2',
          300: '#d2d5d4',
          400: '#c3c7c6',
          500: '#dee1e0',
          600: '#b8bbba',
          700: '#929594',
          800: '#6c6f6e',
          900: '#464948',
        },
      },
      fontFamily: {
        nunito: ['var(--font-nunito-sans)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
}
