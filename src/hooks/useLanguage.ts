import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import type { Language } from '@/types';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language as Language;
  const isRTL = currentLang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang, isRTL]);

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  return { currentLang, isRTL, setLanguage };
};
