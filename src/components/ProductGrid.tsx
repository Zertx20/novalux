import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

const ProductGrid: React.FC = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div id="products" className="container mx-auto px-6 py-24 luxury-pattern">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl border border-border/30 animate-pulse overflow-hidden luxury-glow">
              <div className="aspect-[4/5] bg-muted relative" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="flex items-center gap-3">
                  <div className="h-6 bg-muted rounded w-1/3" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                </div>
                <div className="h-12 bg-muted rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="products" className="container mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold gold-text mb-4">
          {t('products')}
        </h2>
        <div className="w-24 h-0.5 gold-gradient mx-auto rounded-full" />
      </div>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground font-light">{t('no_products')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
