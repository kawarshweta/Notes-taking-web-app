import { Theme } from '../types';

export const getThemeClasses = (theme: Theme) => {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
  };

  const primaryBgClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
  };

  const fontClasses = {
    inter: 'font-sans',
    roboto: 'font-sans',
    system: 'font-sans',
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