import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import ImageSlider from './ImageSlider';

interface Props {
  product: Product;
  index: number;
}

const ProductCard: React.FC<Props> = ({ product, index }) => {
  const { t } = useTranslation();
  const { addItem } = useCart();

  // Get all images - use new image_urls array or fallback to single image_url
  const getAllImages = (): string[] => {
    if (product.image_urls && product.image_urls.length > 0) {
      return product.image_urls;
    }
    if (product.image_url) {
      return [product.image_url];
    }
    return [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      className="group bg-black backdrop-blur-sm rounded-2xl border-2 border-purple-500/50 overflow-hidden hover-luxury fade-in relative luxury-glow"
      style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      {/* Purple glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      
      <div className="relative">
        <ImageSlider 
          images={getAllImages()} 
          alt={product.name}
          className="w-full"
        />
        {product.is_sold && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 start-4 bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-5 py-2 rounded-full text-xs font-bold tracking-wide shadow-lg z-10"
          >
            {t('sold_out')}
          </motion.div>
        )}
        {/* Luxury overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        />
      </div>

      <div className="p-6 relative z-10">
        <motion.h3 
          className="font-heading font-semibold text-xl text-white mb-3 leading-tight group-hover:text-primary transition-colors duration-300"
          style={{ fontFamily: 'Arial, sans-serif' }}
          whileHover={{ x: 4 }}
        >
          {product.name}
        </motion.h3>
        {product.description && (
          <motion.p 
            className="text-sm text-gray-300 mb-5 line-clamp-2 leading-relaxed font-light"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            {product.description}
          </motion.p>
        )}

        <div className="flex items-center gap-4 mb-7">
          {product.old_price && (
            <motion.span 
              className="text-sm text-gray-400 line-through font-light"
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
            >
              {product.old_price.toFixed(0)} {t('currency')}
            </motion.span>
          )}
          <motion.span 
            className="text-2xl font-bold purple-text"
            style={{ fontFamily: 'Arial, sans-serif' }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {product.new_price.toFixed(0)} {t('currency')}
          </motion.span>
        </div>

        <motion.button
          onClick={() => !product.is_sold && addItem(product)}
          disabled={product.is_sold}
          className={`w-full py-4 rounded-xl font-medium text-base transition-all duration-300 relative overflow-hidden group ${
            product.is_sold
              ? 'bg-muted/30 text-muted-foreground cursor-not-allowed border border-border/20'
              : 'font-semibold shadow-lg'
          }`}
          style={!product.is_sold ? {
            backgroundColor: 'white',
            color: '#8b5cf6',
            border: '2px solid #8b5cf6'
          } : {}}
          data-purple={!product.is_sold ? "true" : "false"}
          whileHover={!product.is_sold ? { scale: 1.02 } : {}}
          whileTap={!product.is_sold ? { scale: 0.98 } : {}}
        >
          {/* Shimmer effect for available products */}
          {!product.is_sold && (
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
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
          )}
          {product.is_sold ? t('sold_out') : t('add_to_cart')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
