/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Theme colors for borders
    'border-blue-500', 'border-red-500', 'border-purple-500', 'border-emerald-500', 'border-orange-500', 'border-pink-500',
    // Theme colors for backgrounds (selected state)
    'bg-blue-50', 'bg-red-50', 'bg-purple-50', 'bg-emerald-50', 'bg-orange-50', 'bg-pink-50',
    // Dark mode backgrounds (selected state)
    'dark:bg-blue-900/20', 'dark:bg-red-900/20', 'dark:bg-purple-900/20', 'dark:bg-emerald-900/20', 'dark:bg-orange-900/20', 'dark:bg-pink-900/20',
    // Text colors for checkmarks
    'text-blue-500', 'text-red-500', 'text-purple-500', 'text-emerald-500', 'text-orange-500', 'text-pink-500',
    'dark:text-blue-400', 'dark:text-red-400', 'dark:text-purple-400', 'dark:text-emerald-400', 'dark:text-orange-400', 'dark:text-pink-400',
    // Main background colors
    'bg-blue-600', 'bg-red-600', 'bg-purple-600', 'bg-emerald-600', 'bg-orange-600', 'bg-pink-600',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
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
