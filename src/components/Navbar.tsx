import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from './NavLink';
import LuxuryLogo from './LuxuryLogo';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
    <nav 
      dir="rtl" 
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled
          ? 'rgba(10, 10, 15, 0.6)'
          : 'rgba(10, 10, 15, 0.15)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        borderBottom: scrolled
          ? '1px solid rgba(139, 92, 246, 0.25)'
          : '1px solid rgba(139, 92, 246, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' }}
            transition={{ duration: 0.3 }}
          >
            <LuxuryLogo />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl font-heading font-bold text-white hidden lg:block tracking-tight whitespace-nowrap"
          >
            {t('brand')}
          </motion.span>
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          <NavLink 
            to="/" 
            className="nav-link"
          >
            {t('home')}
            <motion.div
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A78BFA] transition-all duration-300 group-hover:w-full"
              initial={false}
              whileHover={{ width: '100%' }}
            />
          </NavLink>
        </div>

        {/* Spacer for balance */}
        <div className="hidden lg:flex items-center w-12"></div>

        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center">
          <motion.button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="p-3 text-[#9B99B8] hover:text-[#A78BFA] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(10, 10, 15, 0.95)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
            }}
            className="lg:hidden overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <NavLink 
                to="/" 
                onClick={() => setMobileOpen(false)} 
                className="text-base text-[#9B99B8] hover:text-[#A78BFA] transition-colors font-medium"
              >
                {t('home')}
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
