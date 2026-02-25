import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import type { Language } from '@/types';
import { useState } from 'react';

const languages: { code: Language; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
];

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { itemCount, setIsOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { currentLang, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full gold-gradient flex items-center justify-center">
            <span className="text-sm font-bold text-background font-heading">NL</span>
          </div>
          <span className="text-xl font-heading font-bold gold-text hidden sm:block">
            {t('brand')}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('home')}
          </Link>

          {/* Language switcher */}
          <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  currentLang === lang.code
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Cart */}
          <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setIsOpen(true)} className="relative p-2 text-muted-foreground">
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-muted-foreground">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">{t('home')}</Link>
              <div className="flex gap-1">
                {languages.map(lang => (
                  <button key={lang.code} onClick={() => { setLanguage(lang.code); setMobileOpen(false); }}
                    className={`px-3 py-1 text-xs rounded-full ${currentLang === lang.code ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {lang.label}
                  </button>
                ))}
              </div>
              <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-muted-foreground">
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
