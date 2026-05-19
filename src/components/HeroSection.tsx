import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import heroBg from '@/assets/Sports_e-commerce_hero_background_202605120006.jpeg';
import heroBgMobile from '@/assets/Sports_e-commerce_hero_mobile_202605120123.jpeg';
import { useTheme } from '@/context/ThemeContext';
import LuxuryLogo from './LuxuryLogo';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const scrollToProducts = () => {
    const productsElement = document.getElementById('products');
    if (productsElement) {
      productsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero-section relative flex items-center justify-center overflow-hidden luxury-pattern" style={{ minHeight: '100vh' }}>
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 768px)" srcSet={heroBgMobile} />
          <img 
            src={heroBg} 
            alt="Prime Sport Store DZ" 
            className="w-full h-full object-cover scale-105" 
            loading="lazy" 
          />
        </picture>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,10,15,0.85) 0%, rgba(88,28,135,0.4) 100%)' }} />
      </div>
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto luxury-glow">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-6 md:mb-12 flex flex-col items-center gap-4 md:gap-6"
        >
          <div className="w-16 h-16 md:w-24 md:h-24">
            <LuxuryLogo />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight whitespace-nowrap">
            <motion.span 
              className="inline text-white"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ textShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}
            >
              {t('brand')}
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="text-sm sm:text-xl md:text-3xl lg:text-4xl mb-8 md:mb-16 font-medium leading-relaxed max-w-4xl mx-auto tracking-normal"
          style={{ color: '#C4B5FD', textShadow: '0 0 20px rgba(0, 0, 0, 0.8)' }}
        >
          {t('hero_subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
        >
          <motion.button
            onClick={scrollToProducts}
            className="hero-cta-button px-5 py-2 md:px-8 md:py-4 text-sm md:text-base rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('shop_now')}
          </motion.button>
          <motion.div 
            className="pill-badge text-sm md:text-base font-medium flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {t('premium_fashion')}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements - scroll indicator hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="hidden md:flex absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium tracking-widest uppercase mb-3 opacity-70">مرر للاكتشاف</span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-0.5 h-12 purple-gradient rounded-full"
          />
        </div>
      </motion.div>

      {/* Floating luxury particles */}
      <motion.div
        className="absolute top-20 right-10 w-1 h-1 rounded-full purple-gradient opacity-40"
        animate={{
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-32 left-20 w-1.5 h-1.5 rounded-full purple-gradient opacity-30"
        animate={{
          opacity: [0.1, 0.4, 0.8],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </section>
  );
};

export default HeroSection;
