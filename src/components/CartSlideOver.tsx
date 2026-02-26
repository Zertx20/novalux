import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CartSlideOver: React.FC = () => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', delivery_type: 'home' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    const orderItems = items.map(i => ({
      product_id: i.product.id,
      name: i.product.name,
      price: i.product.new_price,
      quantity: i.quantity,
    }));

    const { error } = await supabase.from('orders').insert({
      ...form,
      items: orderItems as any,
      total_price: total,
      status: 'pending',
    });

    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('order_success'));
      clearCart();
      setShowCheckout(false);
      setIsOpen(false);
      setForm({ customer_name: '', phone: '', address: '', delivery_type: 'home' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: currentLang === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: currentLang === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 end-0 z-50 h-full w-full max-w-lg bg-background/95 backdrop-blur-lg border-s border-border/50 luxury-shadow-lg flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-2xl font-heading font-bold gold-text">{t('your_cart')}</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-4 rounded-full hover:bg-card/50 transition-all duration-300 text-muted-foreground hover:text-foreground hover-luxury luxury-glow"
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full gold-gradient/20 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} className="text-muted-foreground" />
                  </div>
                  <p className="text-lg text-muted-foreground font-light">{t('empty_cart')}</p>
                </div>
              ) : !showCheckout ? (
                <div className="space-y-6">
                  {items.map(item => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border/30 hover-luxury"
                    >
                      {item.product.image_url && (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name} 
                          className="w-20 h-20 rounded-xl object-cover luxury-shadow" 
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-foreground mb-1">{item.product.name}</h4>
                        <p className="gold-text font-bold text-lg mb-3">
                          {item.product.new_price.toFixed(0)} {t('currency')}
                        </p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)} 
                            className="p-2 bg-card rounded-xl hover:bg-muted transition-all duration-300 hover-luxury"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-base font-medium w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)} 
                            className="p-2 bg-card rounded-xl hover:bg-muted transition-all duration-300 hover-luxury"
                          >
                            <Plus size={16} />
                          </button>
                          <button 
                            onClick={() => removeItem(item.product.id)} 
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 hover-luxury ms-auto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('name')}</label>
                    <input 
                      required 
                      value={form.customer_name} 
                      onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                      className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('phone')}</label>
                    <input 
                      required 
                      value={form.phone} 
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('address')}</label>
                    <textarea 
                      required 
                      value={form.address} 
                      onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                      className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" 
                      rows={3} 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('delivery_type')}</label>
                    <select 
                      value={form.delivery_type} 
                      onChange={e => setForm(p => ({ ...p, delivery_type: e.target.value }))}
                      className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                    >
                      <option value="home">{t('home_delivery')}</option>
                      <option value="office">{t('office_delivery')}</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full gold-gradient py-4 rounded-xl text-background font-semibold hover-luxury luxury-shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {submitting ? '...' : t('place_order')}
                  </button>
                </form>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border/50 bg-card/30 backdrop-blur-sm">
                <div className="flex justify-between mb-6">
                  <span className="font-heading font-bold text-xl text-foreground">{t('total')}</span>
                  <span className="font-bold text-2xl gold-text">{total.toFixed(0)} {t('currency')}</span>
                </div>
                {!showCheckout ? (
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full gold-gradient py-4 rounded-xl text-background font-semibold hover-luxury luxury-shadow-lg hover:scale-[1.02] transition-all duration-300 text-lg"
                  >
                    {t('checkout')}
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="w-full bg-card/50 backdrop-blur-sm py-4 rounded-xl text-foreground font-medium hover:bg-card transition-all duration-300 border border-border/30 text-lg"
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSlideOver;
