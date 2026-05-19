import React from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/Prime_Sport_Store_logo_design_202605081633.jpeg';

const LuxuryLogo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative group"
      style={{ width: '56px', height: '56px' }}
    >
      {/* Logo image - circular */}
      <img
        src={logo}
        alt="Prime Sport Store DZ"
        className="w-full h-full object-cover rounded-full relative z-10"
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
        }}
      />
    </motion.div>
  );
};

export default LuxuryLogo;
