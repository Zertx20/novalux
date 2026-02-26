import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import type { Language } from '@/types';
import { NavLink } from './NavLink';
import LuxuryLogo from './LuxuryLogo';

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      scrolled 
        ? theme === 'dark' 
          ? 'bg-black/0.1 shadow-md border-b border-gray-800/10' 
          : 'bg-white/0.1 shadow-md border-b border-gray-200/10'
        : 'bg-background/0.1 border-b border-border/5'
    } luxury-shadow`}>
      <div className="container mx-auto px-6 h-20 flex items-center">
        {/* Left - Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <LuxuryLogo />
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl font-heading font-bold gold-text hidden lg:block tracking-wide"
          >
            {t('brand')}
          </motion.span>
        </Link>

        {/* Center - Home Link */}
        <div className="flex-1 flex justify-center">
          <div className="hidden lg:flex items-center gap-8">
            <NavLink 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:tracking-wide relative group"
            >
              {t('home')}
              <motion.div
                className="absolute bottom-0 left-0 w-0 h-0.5 gold-gradient transition-all duration-300 group-hover:w-full"
                initial={false}
                whileHover={{ width: '100%' }}
              />
            </NavLink>
          </div>
        </div>

        {/* Right - Controls */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Language switcher */}
          <div className="flex items-center gap-1 bg-card/50 backdrop-blur-sm rounded-full p-1 border border-border/50">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 text-xs rounded-full transition-all duration-300 font-medium ${
                  currentLang === lang.code
                    ? 'gold-gradient text-primary-foreground shadow-md luxury-shadow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <motion.button 
            onClick={toggleTheme} 
            className="p-3 rounded-full hover:bg-card/50 transition-all duration-300 text-muted-foreground hover:text-foreground hover-luxury relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 gold-gradient opacity-0 hover:opacity-20 transition-opacity duration-300"
            />
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>

          {/* Cart */}
          <motion.button
            onClick={() => setIsOpen(true)} 
            className="relative p-4 w-12 h-12 rounded-full hover:bg-card/50 transition-all duration-300 text-muted-foreground hover:text-foreground hover-luxury"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 gold-gradient opacity-0 hover:opacity-20 transition-opacity duration-300"
            />
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 h-5 w-5 min-w-[20px] rounded-full gold-gradient text-primary-foreground text-[11px] flex items-center justify-center font-bold shadow-md luxury-shadow"
                style={{ transform: 'translate(35%, -35%)' }}
                whileHover={{ scale: 1.1 }}
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-3">
          <motion.button 
            onClick={() => setIsOpen(true)} 
            className="relative p-3 text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full gold-gradient text-primary-foreground text-xs flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </motion.button>
          <motion.button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="p-3 text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <NavLink 
                to="/" 
                onClick={() => setMobileOpen(false)} 
                className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {t('home')}
              </NavLink>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button 
                    key={lang.code} 
                    onClick={() => { setLanguage(lang.code); setMobileOpen(false); }}
                    className={`px-4 py-2 text-sm rounded-full transition-all duration-300 font-medium ${
                      currentLang === lang.code 
                        ? 'gold-gradient text-primary-foreground shadow-md' 
                        : 'bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={toggleTheme} 
                className="flex items-center gap-3 text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
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
