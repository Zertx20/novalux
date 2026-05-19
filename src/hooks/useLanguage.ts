import { useEffect } from 'react';

export const useLanguage = () => {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  return {
    currentLang: 'ar' as const,
    isRTL: true,
  };
};
