import React from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/nova-lux-logo.jpeg';

const LuxuryLogo: React.FC = () => {
  const isRTL = false; // Replace with your actual RTL detection logic

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative group"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        ...(isRTL ? {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
        } : {})
      }}
    >
      {/* Gold glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(198, 167, 94, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.3)',
          zIndex: 5,
          ...(isRTL ? {
            insetInline: 'auto 0px 0px 0px auto 0px',
            insetInlineEnd: 'auto 0px 0px auto 0px',
            insetBlockStart: 'auto -40px 0px auto 0px',
            insetBlockEnd: 'auto 40px 0px auto 0px',
            width: '80px',
            height: '80px',
            transform: 'translate(-50%, -50%) scale(1.3)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 5,
          } : {
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            transform: 'scale(1.3)',
            zIndex: 5,
          })
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Logo container with circular luxury styling */}
      <motion.div
        className="relative rounded-full overflow-hidden luxury-shadow-lg hover-luxury border-2 border-transparent group-hover:border-gold/30 transition-all duration-300"
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        style={{
          width: '56px',
          height: '56px',
        }}
      >
        {/* Subtle shimmer overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-full"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
        
        {/* Logo image - circular */}
        <img
          src={logo}
          alt="Nova Lux"
          className="w-full h-full object-cover rounded-full relative z-10"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
          }}
        />
      </motion.div>

      {/* Floating particles for luxury effect */}
      <motion.div
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full gold-gradient opacity-60"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full gold-gradient opacity-40"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Rotating ring effect */}
      <motion.div
        className="absolute inset-0 rounded-full border border-gold/20"
        style={{
          width: '64px',
          height: '64px',
          top: '-4px',
          left: '-4px',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};

export default LuxuryLogo;
