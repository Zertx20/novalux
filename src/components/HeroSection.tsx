import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import heroBg from '@/assets/Prime_Sport_Store_cover_banner_202605081638.jpeg';
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
        <img 
          src={heroBg} 
          alt="Prime Sport Store DZ" 
          className="w-full h-full object-cover scale-105" 
          style={{ 
            filter: 'blur(3px)',
            boxShadow: 'inset 0 -50px 50px rgba(0, 0, 0, 0.7)'
          }}
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent/30 to-background/90" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto luxury-glow">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight mb-8 tracking-wider">
            <motion.span 
              className="inline purple-text"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ textShadow: '0 0 20px rgba(147, 51, 234, 0.3)' }}
            >
              PRIME SPORT STORE DZ
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-16 font-semibold leading-relaxed max-w-3xl mx-auto tracking-wide"
          style={{ textShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}
        >
          Tous les Équipements et Accessoires Sportifs
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            onClick={scrollToProducts}
            className="px-12 py-4 rounded-xl text-white font-bold text-lg hover-luxury luxury-shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden group purple-button-solid"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('shop_now')}
          </motion.button>
          <motion.div 
            className="text-sm text-white font-medium flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.span
              className="purple-text"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✦
            </motion.span>
            Premium Sports Equipment
            <motion.span
              className="purple-text"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            >
              ✦
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
