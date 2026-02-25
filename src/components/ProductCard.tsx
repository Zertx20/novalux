import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
  index: number;
}

const ProductCard: React.FC<Props> = ({ product, index }) => {
  const { t } = useTranslation();
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart size={48} />
          </div>
        )}
        {product.is_sold && (
          <div className="absolute top-3 start-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold">
            {t('sold_out')}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center gap-3 mb-4">
          {product.old_price && (
            <span className="text-sm text-muted-foreground line-through">
              {product.old_price.toFixed(2)} {t('currency')}
            </span>
          )}
          <span className="text-lg font-bold text-primary">
            {product.new_price.toFixed(2)} {t('currency')}
          </span>
        </div>

        <button
          onClick={() => !product.is_sold && addItem(product)}
          disabled={product.is_sold}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
            product.is_sold
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'gold-gradient text-background hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          {product.is_sold ? t('sold_out') : t('add_to_cart')}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
