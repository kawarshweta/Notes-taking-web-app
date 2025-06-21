export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export type ScreenSize = 'mobile' | 'tablet' | 'desktop';

export const getScreenSize = (width: number): ScreenSize => {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = React.useState<ScreenSize>(() => {
    if (typeof window !== 'undefined') {
      return getScreenSize(window.innerWidth);
    }
    return 'desktop';
  });

  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    screenSize,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    isMobileOrTablet: screenSize === 'mobile' || screenSize === 'tablet',
  };
};

// CSS classes for responsive design
export const responsiveClasses = {
  // Container classes
  container: {
    mobile: 'px-4',
    tablet: 'px-6',
    desktop: 'px-8',
  },
  
  // Spacing classes
  spacing: {
    mobile: 'gap-2',
    tablet: 'gap-4',
    desktop: 'gap-6',
  },
  
  // Text sizes
  text: {
    mobile: {
      title: 'text-xl',
      subtitle: 'text-lg',
      body: 'text-sm',
      caption: 'text-xs',
    },
    tablet: {
      title: 'text-2xl',
      subtitle: 'text-xl',
      body: 'text-base',
      caption: 'text-sm',
    },
    desktop: {
      title: 'text-3xl',
      subtitle: 'text-2xl',
      body: 'text-base',
      caption: 'text-sm',
    },
  },
};

import React from 'react'; 