import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

const ProductGrid: React.FC = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div id="products" className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-lg border border-border animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-10 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="products" className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-heading font-bold text-center mb-12 gold-text">
        {t('products')}
      </h2>
      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">{t('no_products')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
