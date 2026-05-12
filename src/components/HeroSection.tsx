import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import heroBg from '@/assets/Sports_e-commerce_hero_background_202605120006.jpeg';
import heroBgMobile from '@/assets/Sports_e-commerce_hero_mobile_202605120123.jpeg';
import softModeBg from '@/assets/Make_background_and_202602212023.jpeg';
import { useTheme } from '@/context/ThemeContext';

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden luxury-pattern">
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 768px)" srcSet={heroBgMobile} />
          <img 
            src={heroBg} 
            alt="Prime Sport Store DZ" 
            className="w-full h-full object-cover scale-105" 
            style={{ 
              filter: 'blur(1px)',
              boxShadow: 'inset 0 -50px 50px rgba(0, 0, 0, 0.7)'
            }}
            loading="lazy" 
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent/30 to-background/90" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto luxury-glow">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-8 tracking-tight">
            <motion.span 
              className="inline purple-text"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.8)' }}
            >
              Prime Sport Store DZ
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-16 font-medium leading-relaxed max-w-4xl mx-auto tracking-normal"
          style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.8)' }}
        >
          Premium Sports Equipment & Accessories
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            onClick={scrollToProducts}
            className="px-10 py-4 rounded-2xl text-white font-semibold text-lg hover-luxury luxury-shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden group purple-button-solid"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('shop_now')}
          </motion.button>
          <motion.div 
            className="text-base text-white/90 font-medium flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.span
              className="purple-text text-lg"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ◆
            </motion.span>
            <span>Elite Sports Gear</span>
            <motion.span
              className="purple-text text-lg"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            >
              ◆
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium tracking-widest uppercase mb-3 opacity-70">Scroll to Discover</span>
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
