import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CartSlideOver: React.FC = () => {
  const { t } = useTranslation();
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
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 end-0 z-50 h-full w-full max-w-md bg-background border-s border-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-heading font-bold">{t('your_cart')}</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">{t('empty_cart')}</p>
              ) : !showCheckout ? (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3 bg-card rounded-lg p-3 border border-border">
                      {item.product.image_url && (
                        <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 rounded object-cover" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-primary text-sm font-bold">{item.product.new_price.toFixed(2)} {t('currency')}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 bg-secondary rounded hover:bg-muted transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 bg-secondary rounded hover:bg-muted transition-colors">
                            <Plus size={14} />
                          </button>
                          <button onClick={() => removeItem(item.product.id)} className="p-1 text-destructive ms-auto hover:bg-destructive/10 rounded transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('name')}</label>
                    <input required value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('phone')}</label>
                    <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('address')}</label>
                    <textarea required value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('delivery_type')}</label>
                    <select value={form.delivery_type} onChange={e => setForm(p => ({ ...p, delivery_type: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="home">{t('home_delivery')}</option>
                      <option value="office">{t('office_delivery')}</option>
                    </select>
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full gold-gradient py-3 rounded-lg text-background font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                    {submitting ? '...' : t('place_order')}
                  </button>
                </form>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-border">
                <div className="flex justify-between mb-4">
                  <span className="font-heading font-bold text-lg">{t('total')}</span>
                  <span className="font-bold text-lg text-primary">{total.toFixed(2)} {t('currency')}</span>
                </div>
                {!showCheckout ? (
                  <button onClick={() => setShowCheckout(true)}
                    className="w-full gold-gradient py-3 rounded-lg text-background font-semibold hover:opacity-90 transition-opacity">
                    {t('checkout')}
                  </button>
                ) : (
                  <button onClick={() => setShowCheckout(false)}
                    className="w-full bg-secondary py-3 rounded-lg text-secondary-foreground font-medium hover:bg-muted transition-colors">
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
