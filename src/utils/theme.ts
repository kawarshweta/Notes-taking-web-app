import { Theme } from '../types';

export const getThemeClasses = (theme: Theme) => {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    pink: 'text-pink-600 dark:text-pink-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    teal: 'text-teal-600 dark:text-teal-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
  };

  const primaryBgClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    pink: 'bg-pink-600',
    indigo: 'bg-indigo-600',
    teal: 'bg-teal-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    cyan: 'bg-cyan-600',
  };

  const fontClasses = {
    inter: 'font-inter',
    roboto: 'font-roboto',
    system: 'font-system',
    'open-sans': 'font-open-sans',
    'source-sans': 'font-source-sans',
    poppins: 'font-poppins',
    lato: 'font-lato',
    montserrat: 'font-montserrat',
  };

  return {
    primary: colorClasses[theme.color],
    primaryBg: primaryBgClasses[theme.color],
    font: fontClasses[theme.font],
    background: theme.mode === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50',
    surface: theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white',
    sidebar: theme.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    text: theme.mode === 'dark' ? 'text-gray-100' : 'text-gray-900',
    border: theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme.mode === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900',
  };
};