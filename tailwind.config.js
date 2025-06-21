/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'system': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'source-sans': ['Source Sans Pro', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      spacing: {
        'safe-area-bottom': 'env(safe-area-inset-bottom)',
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      minWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      maxWidth: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
  safelist: [
    // Background colors
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500', 'bg-yellow-500', 'bg-cyan-500',
    // Text colors
    'text-blue-600', 'text-purple-600', 'text-green-600', 'text-orange-600', 'text-pink-600', 'text-indigo-600', 'text-teal-600', 'text-red-600', 'text-yellow-600', 'text-cyan-600',
    // Dark text colors
    'dark:text-blue-400', 'dark:text-purple-400', 'dark:text-green-400', 'dark:text-orange-400', 'dark:text-pink-400', 'dark:text-indigo-400', 'dark:text-teal-400', 'dark:text-red-400', 'dark:text-yellow-400', 'dark:text-cyan-400',
    // Border colors
    'border-blue-500', 'border-purple-500', 'border-green-500', 'border-orange-500', 'border-pink-500', 'border-indigo-500', 'border-teal-500', 'border-red-500', 'border-yellow-500', 'border-cyan-500',
    // Light backgrounds
    'bg-blue-50', 'bg-purple-50', 'bg-green-50', 'bg-orange-50', 'bg-pink-50', 'bg-indigo-50', 'bg-teal-50', 'bg-red-50', 'bg-yellow-50', 'bg-cyan-50',
    // Dark backgrounds
    'bg-blue-900/20', 'bg-purple-900/20', 'bg-green-900/20', 'bg-orange-900/20', 'bg-pink-900/20', 'bg-indigo-900/20', 'bg-teal-900/20', 'bg-red-900/20', 'bg-yellow-900/20', 'bg-cyan-900/20',
    // Primary backgrounds
    'bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-orange-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600', 'bg-red-600', 'bg-yellow-600', 'bg-cyan-600',
    // Font families
    'font-inter', 'font-roboto', 'font-system', 'font-open-sans', 'font-source-sans', 'font-poppins', 'font-lato', 'font-montserrat',
    // Responsive utilities
    'w-full', 'w-80', 'w-64', 'w-96', 'min-w-0', 'flex-shrink-0', 'flex-1',
    'h-full', 'h-screen', 'min-h-screen', 'max-h-screen',
    'p-2', 'p-4', 'p-6', 'px-2', 'px-4', 'px-6', 'py-2', 'py-4', 'py-6',
    'gap-1', 'gap-2', 'gap-4', 'gap-6', 'space-y-1', 'space-y-2', 'space-y-4', 'space-y-6',
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'hidden', 'block', 'flex', 'inline-flex', 'grid',
    'md:hidden', 'md:block', 'md:flex', 'lg:hidden', 'lg:block', 'lg:flex',
    'fixed', 'relative', 'absolute', 'inset-0', 'inset-y-0', 'left-0', 'right-0', 'top-0', 'bottom-0',
    'z-10', 'z-20', 'z-30', 'z-40', 'z-50',
    'overflow-hidden', 'overflow-y-auto', 'overflow-x-hidden',
    'border-l', 'border-r', 'border-t', 'border-b', 'border-l-2', 'border-r-2',
    'rounded-lg', 'rounded-full', 'rounded-t-lg', 'rounded-b-lg',
    'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl',
    'transition-all', 'transition-colors', 'transition-transform', 'duration-200', 'duration-300',
    'hover:bg-gray-50', 'hover:bg-gray-100', 'hover:bg-gray-200', 'dark:hover:bg-gray-700', 'dark:hover:bg-gray-800',
    'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent',
    'line-clamp-1', 'line-clamp-2', 'line-clamp-3',
    'safe-area-bottom',
  ],
};