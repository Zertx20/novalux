import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import CartSlideOver from '@/components/CartSlideOver';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen luxury-glow">
      <Navbar />
      <HeroSection />
      <ProductGrid />
      <CartSlideOver />
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm py-12 luxury-glow">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-heading font-bold purple-text mb-2">Prime Sport Store DZ</h3>
              <p className="text-muted-foreground font-light">{t('premium_fashion')}</p>
            </div>
            <div className="w-24 h-0.5 purple-gradient mx-auto rounded-full mb-6" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Prime Sport Store DZ. {t('copyright')}.
            </p>
            <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
              <span className="purple-text">✦</span>
              <span>{t('algeria')}</span>
              <span className="purple-text">✦</span>
              <span>{t('european_fashion')}</span>
              <span className="purple-text">✦</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
