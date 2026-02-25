import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import CartSlideOver from '@/components/CartSlideOver';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductGrid />
      <CartSlideOver />
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nova Lux. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
