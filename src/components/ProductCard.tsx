import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import ImageSlider from './ImageSlider';

interface Props {
  product: Product;
  index: number;
}

const ProductCard: React.FC<Props> = ({ product, index }) => {
  const { t } = useTranslation();

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
    <Link to={`/product/${product.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="product-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '380px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(139,92,246,0.2)',
          background: 'linear-gradient(135deg, rgba(26, 26, 38, 0.8), rgba(17, 17, 24, 0.9))'
        }}
        whileHover={{ 
          y: -6,
          transition: { duration: 0.3 }
        }}
      >
        {/* Image - fixed height */}
        <div 
          className="product-image-wrapper"
          style={{
            width: '100%',
            height: '260px',
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {getAllImages().length > 1 ? (
            <ImageSlider images={getAllImages()} alt={product.name} />
          ) : (
            <>
              {getAllImages().length > 0 ? (
                <img 
                  src={getAllImages()[0]} 
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'rgba(26, 26, 38, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: '#9B99B8' }}>لا توجد صورة</span>
                </div>
              )}
              {product.is_sold && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                    {t('sold_out')}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Info label - always visible */}
        <div 
          style={{
            flex: 1,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '12px 14px',
            background: 'rgba(15, 10, 30, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(139,92,246,0.15)',
            minHeight: '120px'
          }}
        >
          <h3 style={{ 
            color: '#F1F0FF', 
            fontSize: '14px', 
            fontWeight: 600, 
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4'
          }}>
            {product.name}
          </h3>
          
          {!product.is_sold && (
            <>
              <div style={{ 
                color: '#A78BFA', 
                fontSize: '13px', 
                fontWeight: 700,
                marginBottom: '8px'
              }}>
                <span dir="ltr">{t('currency')}</span> {product.new_price.toFixed(0)}
              </div>

              <motion.button
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  width: '100%',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                  marginTop: 'auto'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('order_now')}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
